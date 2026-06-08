const fs = require('fs');

let html = fs.readFileSync('info.html', 'utf8');

const regex = /\/\/ Step 3: Find suppliers for these components in parallel[\s\S]*?(?=\/\/ Render items)/;
const replacement = `// Step 3: Find suppliers for these components in parallel
      const formattedMaterials = await Promise.all(components.map(async (comp) => {
        const { data: compSupps, error: suppErr } = await window.sb
          .from('component_suppliers')
          .select(\`
            distance_km,
            stock_status,
            google_maps_link,
            supplier_product_link,
            suppliers (
              supplier_name,
              city
            )
          \`)
          .eq('component_id', comp.id)
          .limit(1);
          
        let sd = { 
           distance_km: 'N/A',
           stock_status: 'N/A',
           google_maps_link: null,
           supplier_product_link: null,
           suppliers: { supplier_name: 'N/A', city: 'N/A' }
        };
        
        if (compSupps && compSupps.length > 0) {
           sd.distance_km = compSupps[0].distance_km || 'N/A';
           sd.stock_status = compSupps[0].stock_status || 'N/A';
           sd.google_maps_link = compSupps[0].google_maps_link || null;
           sd.supplier_product_link = compSupps[0].supplier_product_link || null;
           if (compSupps[0].suppliers) {
              sd.suppliers.supplier_name = compSupps[0].suppliers.supplier_name || 'N/A';
              sd.suppliers.city = compSupps[0].suppliers.city || 'N/A';
           }
        }
        
        return {
           name: comp.component_name || 'N/A',
           category: comp.component_category || 'N/A',
           stock_status: sd.stock_status,
           distance_km: sd.distance_km,
           supplier_name: sd.suppliers.supplier_name,
           supplier_address: sd.suppliers.city,
           supplier_website: sd.supplier_product_link,
           google_maps_link: sd.google_maps_link
        };
      }));

      `;

html = html.replace(regex, replacement);

const cardRegex = /const card = document\.createElement\('article'\);[\s\S]*?(?=materialList\.appendChild\(card\);)/;

const cardReplacement = `const card = document.createElement('article');
         card.className = \`material-card cat-\${catClass}\`;
         
         card.innerHTML = \`
           <div class="material-info">
             <div class="material-meta-row">
               <h2 class="material-name">\${absoluteIndex + 1}. \${mat.name}</h2>
               <span class="pill-tag pill-\${catClass}" style="padding: 4px 10px; border-radius: 20px; font-size: 11px; font-weight: 600;">\${mat.category}</span>
               <span class="distance-badge">\${mat.distance_km}</span>
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
             <a href="\${mat.supplier_website || '#'}" target="_blank" class="btn btn-row-action btn-supplier-web" \${mat.supplier_website ? '' : 'style="display:none;"'}>
               <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display: inline-block; vertical-align: text-bottom; margin-right: 4px;"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
               Supplier Website
             </a>
             <a href="\${mat.google_maps_link || '#'}" target="_blank" rel="noopener noreferrer" class="btn btn-row-action btn-supplier-maps" \${mat.google_maps_link ? '' : 'style="display:none;"'}>
               <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display: inline-block; vertical-align: text-bottom; margin-right: 4px;"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
               Open in Google Maps
             </a>
           </div>
         \`;
         `;

html = html.replace(cardRegex, cardReplacement);

fs.writeFileSync('info.html', html, 'utf8');
