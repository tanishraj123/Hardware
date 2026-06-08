const fs = require('fs');

let html = fs.readFileSync('info.html', 'utf8');

const startStr = "  async function loadMore() {";
const endStr = "  async function performSearch(productName) {";

const startIndex = html.indexOf(startStr);
const endIndex = html.indexOf(endStr);

if (startIndex === -1 || endIndex === -1) {
  console.log("Could not find start or end index.");
  process.exit(1);
}

const replacement = `  async function loadMore() {
    if (isLoading || !hasMore || !currentProductName) return;
    isLoading = true;

    try {
      if (offset === 0) {
         materialList.innerHTML = '<div style="text-align:center; padding: 60px; color:#5f6368; font-size: 16px;">Finding materials near you...<div class="spinner"></div></div>';
         statsText.innerHTML = '<span class="sparkle-accent">✦</span> Querying database...';
      } else {
         const loadingEl = document.createElement('div');
         loadingEl.className = 'scroll-spinner';
         loadingEl.innerHTML = '<div class="spinner" style="width:24px; height:24px; border-width:3px; margin: 20px auto;"></div>';
         materialList.appendChild(loadingEl);
      }

      // Step 1: Find product
      const { data: products, error: prodErr } = await window.sb
        .from('products')
        .select('*')
        .ilike('name', \\\`%\\\${currentProductName}%\\\`)
        .limit(1);

      if (prodErr || !products || products.length === 0) {
         if (offset === 0) {
            materialList.innerHTML = '<div style="text-align:center; padding: 40px; color:#5f6368">No matching products found in database.</div>';
            statsText.innerHTML = '<span class="sparkle-accent">✦</span> 0 materials found';
         }
         hasMore = false;
         isLoading = false;
         return;
      }
      const productId = products[0].id;

      // Ensure total count is updated (once)
      if (offset === 0) {
         const { count, error: countErr } = await window.sb
           .from('product_components')
           .select('*', { count: 'exact', head: true })
           .eq('product_id', productId);
         currentTotalMatchCount = count || 0;
      }

      // Step 2: Query product_components WHERE product_id = that id
      const { data: prodComps, error: compErr } = await window.sb
        .from('product_components')
        .select('component_id')
        .eq('product_id', productId)
        .order('component_id')
        .range(offset, offset + limit - 1);

      if (compErr) throw new Error(compErr.message);

      if (offset === 0) {
         materialList.innerHTML = '';
      } else {
         const spinner = materialList.querySelector('.scroll-spinner');
         if (spinner) spinner.remove();
      }

      if (!prodComps || prodComps.length === 0) {
         hasMore = false;
         isLoading = false;
         if (offset === 0) {
            materialList.innerHTML = '<div style="text-align:center; padding: 40px; color:#5f6368">No components found for this product.</div>';
         }
         return;
      }

      // Step 3 & 4: Find component names and suppliers in parallel
      const formattedMaterials = await Promise.all(prodComps.map(async (pc) => {
        
        // Fetch component details
        const { data: compDef, error: cErr } = await window.sb
           .from('components')
           .select('name, category')
           .eq('id', pc.component_id)
           .single();

        // Fetch supplier details via component_suppliers
        const { data: compSupps, error: suppErr } = await window.sb
          .from('component_suppliers')
          .select(\\\`
            suppliers!inner (
              supplier_name,
              city,
              supplier_address,
              supplier_website,
              google_maps_link,
              stock_status,
              distance_km
            )
          \\\`)
          .eq('component_id', pc.component_id)
          .limit(1);
          
        let supplierData = { 
           stock_status: 'Unknown', 
           distance_km: '~10 km', 
           supplier_name: 'Unknown Supplier', 
           supplier_address: 'N/A', 
           supplier_website: '#', 
           google_maps_link: '#' 
        };

        if (compSupps && compSupps.length > 0) {
           let s = compSupps[0].suppliers;
           if (Array.isArray(s)) s = s[0];
           if (s) {
              supplierData = {
                stock_status: s.stock_status || 'In Stock',
                distance_km: s.distance_km || '~10 km',
                supplier_name: s.supplier_name || 'Generic Supplier',
                supplier_address: s.supplier_address || s.city || 'Local Market',
                supplier_website: s.supplier_website || '#',
                google_maps_link: s.google_maps_link || '#'
              };
           }
        }
        
        return {
           name: compDef ? (compDef.name || 'Unknown Item') : 'Unknown Item',
           category: compDef ? (compDef.category || 'Component') : 'Component',
           stock_status: supplierData.stock_status,
           distance_km: supplierData.distance_km,
           supplier_name: supplierData.supplier_name,
           supplier_address: supplierData.supplier_address,
           supplier_website: supplierData.supplier_website,
           google_maps_link: supplierData.google_maps_link
        };
      }));

      // Render items
      formattedMaterials.forEach((mat, index) => {
         const absoluteIndex = offset + index;
         const catClassRaw = getCatClass(mat.category || 'default');
         const knownCats = ['display', 'semiconductor', 'power', 'glass', 'metal', 'audio'];
         const catClass = knownCats.includes(catClassRaw) ? catClassRaw : 'default';
         const stockClass = (mat.stock_status || '').toLowerCase().includes('low') ? 'low-stock' : 'in-stock';

         const card = document.createElement('article');
         card.className = \\\`material-card cat-\\\${catClass}\\\`;
         
         card.innerHTML = \\\`
           <div class="material-info">
             <div class="material-meta-row">
               <h2 class="material-name">\\\${absoluteIndex + 1}. \\\${mat.name}</h2>
               <span class="pill-tag pill-\\\${catClass}" style="padding: 4px 10px; border-radius: 20px; font-size: 11px; font-weight: 600;">\\\${mat.category || 'Component'}</span>
               <span class="distance-badge">\\\${mat.distance_km || '~10 km away'}</span>
               <span class="stock-indicator \\\${stockClass}">
                 <span class="stock-dot"></span>
                 \\\${mat.stock_status || 'In Stock'}
               </span>
             </div>
             <div class="supplier-details">
               <span class="supplier-name">\\\${mat.supplier_name || 'Generic Supplier'}</span>
               <span class="supplier-address">\\\${mat.supplier_address || 'Local Market'}</span>
             </div>
           </div>
           <div class="row-actions">
             <a href="\\\${mat.supplier_website || '#'}" target="_blank" class="btn btn-row-action btn-supplier-web">
               <svg class="svg-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display: inline-block; vertical-align: text-bottom; margin-right: 4px;"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
               Supplier Website
             </a>
             <a href="\\\${mat.google_maps_link || '#'}" target="_blank" rel="noopener noreferrer" class="btn btn-row-action btn-supplier-maps">
               <svg class="svg-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display: inline-block; vertical-align: text-bottom; margin-right: 4px;"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
               Open in Google Maps
             </a>
           </div>
         \\\`;
         materialList.appendChild(card);
         if(window.setupCardActions) window.setupCardActions(card, absoluteIndex);
      });

      offset += prodComps.length;
      if (prodComps.length < limit) {
         hasMore = false;
      }
      
      statsText.innerHTML = \\\`<span class="sparkle-accent">✦</span> Sourced \\\${offset} of \\\${currentTotalMatchCount} materials • Click <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display: inline-block; vertical-align: text-bottom; margin: 0 2px;"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg> to open supplier location in Google Maps\\\`;

    } catch (err) {
      if (offset === 0) materialList.innerHTML = '';
      const errEl = document.createElement('div');
      errEl.style = 'text-align:center; padding: 40px; color:#c5221f; font-weight:500;';
      errEl.textContent = 'Failed to fetch BOM data: ' + err.message;
      materialList.appendChild(errEl);
      
      const spinner = materialList.querySelector('.scroll-spinner');
      if (spinner) spinner.remove();

      hasMore = false;
    } finally {
      isLoading = false;
    }
  }
`;

html = html.substring(0, startIndex) + replacement.replace(/\\\\\\`/g, '`').replace(/\\\\\\\${/g, '${') + '\n\n' + html.substring(endIndex);
fs.writeFileSync('info.html', html, 'utf8');
console.log('Update successful');
