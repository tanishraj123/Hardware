const fs = require('fs');

let index = fs.readFileSync('/app/applet/index.html', 'utf8');

const target = `      // Dynamic auth-check navigation method
      async function checkAuthThenNavigate(destination) {
        initializeGlobalAuth();
      });
    </script>`;

const replacement = `      // Dynamic auth-check navigation method
      async function checkAuthThenNavigate(destination) {
        try {
          const { data: { session } } = await sb.auth.getSession();
          const user = session ? session.user : null;
          if (user) {
            window.location.href = destination;
          } else {
            window.location.href = \`signin.html?redirect=\${encodeURIComponent(destination)}\`;
          }
        } catch (err) {
          console.error("Auth verification flow exception:", err);
          window.location.href = \`signin.html?redirect=\${encodeURIComponent(destination)}\`;
        }
      }
      window.checkAuthThenNavigate = checkAuthThenNavigate;

      document.addEventListener("DOMContentLoaded", async () => {
        // Dynamic suggestion ticker initialization
        const tickerContainer = document.getElementById("suggestion-ticker-container");
        if (tickerContainer) {
          const allSuggestions = [
            "iPhone 15",
            "Herbal Shampoo",
            "Smartwatch",
            "Solar Panel",
            "Laptop",
            "Arduino Uno",
            "Raspberry Pi",
            "Drone",
            "Wireless Earbuds",
            "Electric Scooter",
            "3D Printer",
            "Smart Home Hub",
            "Bluetooth Speaker",
            "Action Camera",
            "LED Strip Lights",
            "Solar Inverter"
          ];
          
          let nextItemIndex = 5;

          function createChip(text) {
            const chip = document.createElement("div");
            chip.className = "suggestion-chip";
            chip.textContent = text;
            chip.addEventListener("click", () => {
              const searchInput = document.querySelector('.search-box input[name="q"]');
              if (searchInput) {
                searchInput.value = text;
                searchInput.focus();
              }
            });
            return chip;
          }

          // Initialize first 5 chips
          allSuggestions.slice(0, 5).forEach((text) => {
            tickerContainer.appendChild(createChip(text));
          });

          // Auto rotation every 2.5s
          setInterval(() => {
            const chips = tickerContainer.querySelectorAll(".suggestion-chip");
            if (chips.length < 5) return;

            const oldFirstChip = chips[0];
            const nextText = allSuggestions[nextItemIndex];
            nextItemIndex = (nextItemIndex + 1) % allSuggestions.length;

            const newChip = createChip(nextText);
            newChip.classList.add("entering");
            tickerContainer.appendChild(newChip);

            // Stagger the animation
            oldFirstChip.classList.add("leaving");

            setTimeout(() => {
              newChip.classList.remove("entering");
            }, 50);

            setTimeout(() => {
              oldFirstChip.remove();
            }, 350);
          }, 2500);
        }
        
      });
    </script>`;

if (index.includes(target)) {
    index = index.replace(target, replacement);
    fs.writeFileSync('/app/applet/index.html', index);
    console.log("Restored checkAuthThenNavigate and ticker in index.html");
} else {
    console.error("Target string not found in index.html");
}
