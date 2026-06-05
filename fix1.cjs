const fs = require('fs');
let html = fs.readFileSync('my-partners.html', 'utf8');

html = html.replace(/<div id="partners-container">\s*<!-- Will be populated dynamically via JavaScript -->\s*<div style="text-align: center; padding: 40px;">\s*<p style="color: #5f6368; font-style: italic;">Loading saved suppliers...<\/p>\s*<\/div>\s*<\/div>/g, 
`<div id="partners-container">
        <!-- Will be populated dynamically via JavaScript -->
      </div>`);

const oldRender = /function renderSavedSuppliers\(\)\s*\{[\s\S]*?(?=exportContainer\.style\.display = 'block';)/;
const newRender = `function renderSavedSuppliers() {
      const partnersContainer = document.getElementById('partners-container');
      const exportContainer = document.getElementById('export-container');
      
      if (window.userSession === undefined) {
         return;
      }

      if (!window.userSession) {
        exportContainer.style.display = 'none';
        partnersContainer.innerHTML = \`
          <div class="empty-state">
            <h3 class="empty-title">Sign in to view saved suppliers</h3>
            <a href="/signin.html" class="btn btn-primary" style="border-radius: 100px; margin-top: 8px;">Sign In</a>
          </div>
        \`;
        return;
      }

      const saved = JSON.parse(localStorage.getItem('saved_suppliers') || '[]');
      
      if (saved.length === 0) {
        exportContainer.style.display = 'none';
        partnersContainer.innerHTML = \`
          <div class="empty-state">
            <div class="empty-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
            </div>
            <h3 class="empty-title">No Saved Suppliers Yet</h3>
            <p class="empty-text">No suppliers saved yet. Click the + icon on any supplier to add them here.</p>
            <a href="/info" class="btn btn-primary" style="border-radius: 100px; margin-top: 8px;">Explore Supplier BOMs</a>
          </div>
        \`;
        return;
      }
      
      // `;

html = html.replace(oldRender, newRender);

html = html.replace('window.userSession = user;', 'window.userSession = user;\n        renderSavedSuppliers();');
html = html.replace("window.userSession = null;", "window.userSession = null;\n        renderSavedSuppliers();");
// Wait, is there a window.userSession = undefined initially? Yes. It's undefined by default. 
// And the DOMContentLoaded has a renderSavedSuppliers() call... I should remove it or let it test undefined.

fs.writeFileSync('my-partners.html', html);
