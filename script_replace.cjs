const fs = require('fs');

let html = fs.readFileSync('info.html', 'utf8');

const regex = /<script>\s*document\.addEventListener\('DOMContentLoaded', \(\) => {[\s\S]*?(?=<\/body>)/;
const replacement = `<script>
document.addEventListener('DOMContentLoaded', () => {
  const searchForm = document.querySelector('.search-box-container');
  const searchInput = document.querySelector('.search-input');
  const materialList = document.querySelector('.material-list');
  const statsText = document.querySelector('.search-stats-text');
  const bomTitle = document.querySelector('.bom-title');

  const getCatClass = (cat) => {
    const known = ['display','semiconductor','power','glass','metal','audio'];
    const c = (cat || '').toLowerCase().replace(/[^a-z]/g,'');
    return known.includes(c) ? c : 'default';
  };

  async function performSearch(query) {
    if (!query || !window.sb) return;
    materialList.innerHTML = '<div style="text-align:center;padding:60px;color:#5f6368">Finding materials...<br><br><div style="border:4px solid #e0e0e0;border-left-color:#4285F4;border-radius:50%;width:36px;height:36px;animation:spin 1s linear infinite;margin:16px auto;"></div></div>';
    statsText.innerHTML = '<span style="color:#4285F4">✦</span> Querying database...';
    bomTitle.textContent = \\'Bill of Materials — \\' + query;

    try {
      // Step 1: Find product
      const { data: products } = await window.sb
        .from('products')
        .select('id, name')
        .ilike('name', '%' + query + '%')
        .limit(1);

      if (!products || products.length === 0) {
        materialList.innerHTML = '<div style="text-align:center;padding:40px;color:#5f6368">No matching products found in database.</div>';
        statsText.innerHTML = '<span style="color:#4285F4">✦</span> 0 materials found';
        return;
      }
      const productId = products[0].id;

      // Step 2: Get component IDs
      const { data: pcRows } = await window.sb
        .from('product_components')
        .select('component_id')
        .eq('product_id', productId);

      if (!pcRows || pcRows.length === 0) {
        materialList.innerHTML = '<div style="text-align:center;padding:40px;color:#5f6368">No components found for this product.</div>';
        return;
      }

      const componentIds = pcRows.map(r => r.component_id);

      // Step 3: Get component details
      const { data: components } = await window.sb
        .from('components')
        .select('id, component_name, component_category')
        .in('id', componentIds);

      if (!components || components.length === 0) {
        materialList.innerHTML = '<div style="text-align:center;padding:40px;color:#5f6368">No components found.</div>';
        return;
      }

      // Step 4: For each component get supplier data
      const results = await Promise.all(components.map(async (comp) => {
        const { data: csRows } = await window.sb
          .from('component_suppliers')
          .select('supplier_id, distance_km, stock_status, google_maps_link, supplier_product_link')
          .eq('component_id', comp.id)
          .limit(1);

        let supplierName = 'N/A', city = 'N/A', distanceKm = 'N/A', stockStatus = 'N/A', mapsLink = null, websiteLink = null;

        if (csRows && csRows.length > 0) {
          const cs = csRows[0];
          distanceKm = cs.distance_km ? '~' + cs.distance_km + ' km away' : 'N/A';
          stockStatus = cs.stock_status || 'N/A';
          mapsLink = cs.google_maps_link || null;
          websiteLink = cs.supplier_product_link || null;

          if (cs.supplier_id) {
            const { data: supRows } = await window.sb
              .from('suppliers')
              .select('supplier_name, city')
              .eq('id', cs.supplier_id)
              .limit(1);

            if (supRows && supRows.length > 0) {
              supplierName = supRows[0].supplier_name || 'N/A';
              city = supRows[0].city || 'N/A';
            }
          }
        }

        return {
          name: comp.component_name,
          category: comp.component_category,
          distanceKm, stockStatus, supplierName, city, mapsLink, websiteLink
        };
      }));

      // Render
      materialList.innerHTML = '';
      results.forEach((mat, i) => {
        const catClass = getCatClass(mat.category);
        const stockClass = (mat.stockStatus || '').toLowerCase().includes('low') ? 'low-stock' : 'in-stock';
        const card = document.createElement('article');
        card.className = 'material-card cat-' + catClass;
        card.innerHTML = \`
          <div class="material-info">
            <div class="material-meta-row">
              <h2 class="material-name">\${i+1}. \${mat.name}</h2>
              <span class="pill-tag pill-\${catClass}">\${mat.category}</span>
              <span class="distance-badge">\${mat.distanceKm}</span>
              <span class="stock-indicator \${stockClass}"><span class="stock-dot"></span>\${mat.stockStatus}</span>
            </div>
            <div class="supplier-details">
              <span class="supplier-name">\${mat.supplierName}</span>
              <span class="supplier-address">\${mat.city}</span>
            </div>
          </div>
          <div class="row-actions">
            \${mat.websiteLink ? \\\`<a href="\\\${mat.websiteLink}" target="_blank" class="btn btn-row-action btn-supplier-web">🌐 Supplier Website</a>\\\` : ''}
            \${mat.mapsLink ? \\\`<a href="\\\${mat.mapsLink}" target="_blank" class="btn btn-row-action btn-supplier-maps">📍 Open in Google Maps</a>\\\` : ''}
          </div>
        \`;
        materialList.appendChild(card);
      });

      statsText.innerHTML = '<span style="color:#4285F4">✦</span> Sourced ' + results.length + ' of ' + results.length + ' materials • Click 📍 to open supplier location in Google Maps';

    } catch (err) {
      materialList.innerHTML = '<div style="text-align:center;padding:40px;color:#c5221f">Error: ' + err.message + '</div>';
    }
  }

  function waitForSb(cb) {
    if (window.sb) { cb(); } else { setTimeout(() => waitForSb(cb), 100); }
  }

  if (searchForm) {
    searchForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const q = searchInput.value.trim();
      if (q) { window.history.pushState({}, '', '?q=' + encodeURIComponent(q)); waitForSb(() => performSearch(q)); }
    });
  }

  const urlParams = new URLSearchParams(window.location.search);
  const initialQuery = urlParams.get('q') || (searchInput && searchInput.value.trim());
  if (initialQuery) { waitForSb(() => performSearch(initialQuery)); }
});
</script>
`;

html = html.replace(regex, replacement);
fs.writeFileSync('info.html', html, 'utf8');
console.log('Done!');
