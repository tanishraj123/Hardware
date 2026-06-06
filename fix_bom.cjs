const fs = require('fs');

let html = fs.readFileSync('info.html', 'utf8');

// 1. Move the card action setup to a reusable function
const initialScriptRegex = /document\.addEventListener\('DOMContentLoaded', \(\) => \{\s*\/\/\s*We define the data[\s\S]*?(const cards = document\.querySelectorAll\('\.material-card'\);[\s\S]*?\}\)[\s\S]*?\}\);)/;

const match = html.match(initialScriptRegex);
if (match) {
  let insideSetup = match[1];
  
  // Replace the `cards.forEach(card => ... )` with a function setupCardActions(card, index)
  let newSetup = `
        window.setupCardActions = function(card, index) {
          const rowNum = index + 1;
          const id = \`bom-row-\${rowNum}\`;
          card.id = id;
          const materialName = card.querySelector('.material-name')?.textContent.replace(/^\\d+\\.\\s*/, '').trim();
          const supplierName = card.querySelector('.supplier-name')?.textContent.trim();
          const address = card.querySelector('.supplier-address')?.textContent.trim();
          const distanceText = card.querySelector('.distance-badge')?.textContent.replace('~', '').trim();
          const stockText = card.querySelector('.stock-indicator')?.textContent.trim();
          const mapsLink = card.querySelector('.btn-supplier-maps')?.href;

          const alts = window.ALTERNATIVES_DATA ? (window.ALTERNATIVES_DATA[materialName] || []) : [];
          const hasAlternatives = alts.length > 0;
          const isSaved = typeof isSupplierSaved === 'function' ? isSupplierSaved(id) : false;

          const actionContainer = document.createElement('div');
          actionContainer.className = 'card-actions-top-right';
          actionContainer.innerHTML = \`
            <button class="btn-save-supplier \${isSaved ? 'saved' : ''}" data-id="\${id}">
              \${isSaved ? '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>' : '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>'}
            </button>
            <button class="btn-expand-alternatives \${!hasAlternatives ? 'disabled' : ''}" data-id="\${id}" style="\${!hasAlternatives ? 'opacity: 0.3; cursor: default;' : ''}">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
            </button>
          \`;
          card.appendChild(actionContainer);
          
          const panel = document.createElement('div');
          panel.className = 'alternatives-dropdown-panel';
          card.appendChild(panel);

          actionContainer.querySelector('.btn-save-supplier').addEventListener('click', (e) => {
            e.stopPropagation();
            if(typeof toggleSaveSupplier === 'function') {
               const nowSaved = toggleSaveSupplier({ id, component: materialName, supplier_name: supplierName, address, distance: distanceText, stock: stockText, maps_link: mapsLink });
               if (nowSaved === null) return;
               if (typeof updateMainCardStats === 'function') updateMainCardStats();
            }
          });

          actionContainer.querySelector('.btn-expand-alternatives').addEventListener('click', (e) => {
             e.stopPropagation();
             if (!hasAlternatives) return;
             const isShown = panel.style.display === 'block';
             document.querySelectorAll('.alternatives-dropdown-panel').forEach(p => p.style.display = 'none');
             if (!isShown) {
               if(typeof renderAlternatives === 'function') renderAlternatives(panel, alts);
               panel.style.display = 'block';
             }
          });
        };

        const cards = document.querySelectorAll('.material-card');
        cards.forEach((card, index) => {
           window.setupCardActions(card, index);
        });
`;
  html = html.replace(insideSetup, newSetup);
}

// 2. Add API fetching script
const apiScript = `
<!-- BOM Worker Integration Script -->
<script>
document.addEventListener('DOMContentLoaded', () => {
  const searchForm = document.querySelector('.search-box-container');
  const searchInput = document.querySelector('.search-input');
  const materialList = document.querySelector('.material-list');
  const statsText = document.querySelector('.search-stats-text');
  const bomTitle = document.querySelector('.bom-title');

  // Utility to convert category to a valid css class like cat-display
  const getCatClass = (cat) => cat.toLowerCase().replace(/[^a-z0-9]/g, '');

  const styleTag = document.createElement('style');
  styleTag.innerHTML = \`
    .spinner {
      border: 4px solid rgba(0, 0, 0, 0.1);
      width: 36px;
      height: 36px;
      border-radius: 50%;
      border-left-color: #2563eb;
      animation: spin 1s linear infinite;
      margin: 16px auto;
    }
    @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
    
    .pill-display { background-color: #e8f0fe; color: #1967d2; border: 1px solid #d2e3fc; }
    .cat-display { border-left: 4px solid #1967d2; }
    
    .pill-semiconductor { background-color: #fce8e6; color: #c5221f; border: 1px solid #fad2cf; }
    .cat-semiconductor { border-left: 4px solid #c5221f; }
    
    .pill-power { background-color: #e6f4ea; color: #137333; border: 1px solid #ceead6; }
    .cat-power { border-left: 4px solid #137333; }
    
    .pill-glass { background-color: #e4f7fb; color: #129eaf; border: 1px solid #cbf0f8; }
    .cat-glass { border-left: 4px solid #129eaf; }
    
    .pill-metal { background-color: #f1f3f4; color: #5f6368; border: 1px solid #dadce0; }
    .cat-metal { border-left: 4px solid #5f6368; }
    
    .pill-audio { background-color: #f3e8fd; color: #9334e6; border: 1px solid #e9d2fd; }
    .cat-audio { border-left: 4px solid #9334e6; }
    
    .pill-default { background-color: #feefc3; color: #b06000; border: 1px solid #fde293; }
    .cat-default { border-left: 4px solid #b06000; }
  \`;
  document.head.appendChild(styleTag);

  async function performSearch(productName) {
    if (!productName) return;

    // Loading State
    materialList.innerHTML = '<div style="text-align:center; padding: 60px; color:#5f6368; font-size: 16px;">Finding materials near you...<div class="spinner"></div></div>';
    statsText.innerHTML = '<span class="sparkle-accent">✦</span> AI is analyzing the product...';
    bomTitle.textContent = "Bill of Materials — " + productName;

    try {
      const response = await fetch('https://grabraw-bom.tanishraj0620.workers.dev/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ product_name: productName })
      });

      if (!response.ok) {
        throw new Error('Failed to fetch data from Worker');
      }

      const data = await response.json();
      
      const materials = data.materials || [];
      const total = data.total_materials || materials.length;

      statsText.innerHTML = \`<span class="sparkle-accent">✦</span> AI analyzed \${total} materials • \${materials.length} local sources found • Click <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display: inline-block; vertical-align: text-bottom; margin: 0 2px;"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg> to open supplier location in Google Maps\`;

      materialList.innerHTML = ''; // clear old cards

      if(materials.length === 0) {
         materialList.innerHTML = '<div style="text-align:center; padding: 40px; color:#5f6368">No materials found.</div>';
         return;
      }

      materials.forEach((mat, index) => {
        const catClassRaw = getCatClass(mat.category);
        const knownCats = ['display', 'semiconductor', 'power', 'glass', 'metal', 'audio'];
        const catClass = knownCats.includes(catClassRaw) ? catClassRaw : 'default';
        const stockClass = (mat.stock_status || '').toLowerCase().includes('low') ? 'low-stock' : 'in-stock';
        
        const card = document.createElement('article');
        card.className = \`material-card cat-\${catClass}\`;
        
        card.innerHTML = \`
          <div class="material-info">
            <div class="material-meta-row">
              <h2 class="material-name">\${index + 1}. \${mat.name}</h2>
              <span class="pill-tag pill-\${catClass}" style="padding: 4px 10px; border-radius: 20px; font-size: 11px; font-weight: 600;">\${mat.category}</span>
              <span class="distance-badge">\${mat.distance_km || '~10 km away'}</span>
              <span class="stock-indicator \${stockClass}">
                <span class="stock-dot"></span>
                \${mat.stock_status}
              </span>
            </div>
            <div class="supplier-details">
              <span class="supplier-name">\${mat.supplier_name}</span>
              <span class="supplier-address">\${mat.supplier_address}</span>
            </div>
          </div>
          <div class="row-actions">
            <a href="\${mat.supplier_website}" target="_blank" class="btn btn-row-action btn-supplier-web">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display: inline-block; vertical-align: text-bottom; margin-right: 4px;"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
              Supplier Website
            </a>
            <a href="\${mat.google_maps_link}" target="_blank" rel="noopener noreferrer" class="btn btn-row-action btn-supplier-maps">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display: inline-block; vertical-align: text-bottom; margin-right: 4px;"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
              Open in Google Maps
            </a>
          </div>
        \`;

        materialList.appendChild(card);
        if(window.setupCardActions) window.setupCardActions(card, index);
      });
    } catch (err) {
      materialList.innerHTML = '<div style="text-align:center; padding: 40px; color:#c5221f; font-weight:500;">Failed to fetch BOM data: ' + err.message + '</div>';
    }
  }

  // Handle form submit
  if (searchForm) {
    searchForm.addEventListener('submit', (e) => {
      e.preventDefault();
      performSearch(searchInput.value.trim());
      // update URL without reload
      const url = new URL(window.location);
      url.searchParams.set('q', searchInput.value.trim());
      window.history.pushState({}, '', url);
    });
  }

  // Check URL param on load
  const urlParams = new URLSearchParams(window.location.search);
  const initialQuery = urlParams.get('q');
  if (initialQuery && initialQuery.toLowerCase() !== 'iphone 15') { // wait, even if it is iPhone 15 we should fetch real data
    searchInput.value = initialQuery;
    performSearch(initialQuery);
  } else {
    // Also run for default iPhone 15
    const q = searchInput.value.trim();
    if(q) {
       performSearch(q);
    }
  }
});
</script>
`;

html = html.replace('</body>', apiScript + '\n</body>');

fs.writeFileSync('info.html', html, 'utf8');
console.log("Processed info.html");
