
function initSubscriptionModal() {
  const modalHTML = `
    <div id="subModalOverlay" class="sub-modal-overlay" style="display: none; position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0,0,0,0.5); align-items: center; justify-content: center; z-index: 100000; opacity: 0; transition: opacity 0.2s ease;">
      <div class="sub-modal-content" style="background: #ffffff; width: 100%; max-width: 400px; border-radius: 16px; padding: 32px; box-shadow: 0 10px 40px rgba(0,0,0,0.2); transform: translateY(20px); transition: transform 0.2s ease; position: relative;">
        <button id="closeSubModalBtn" style="position: absolute; top: 16px; right: 16px; background: none; border: none; cursor: pointer; color: #5f6368;" aria-label="Close">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
        </button>
        <h2 style="color: #1a1a1a; font-size: 20px; font-weight: 700; margin-bottom: 24px; text-align: center;">Your GrabRaw+ Subscription</h2>
        
        <div id="subModalLoading" style="text-align: center; color: #5f6368; padding: 20px 0;">
          <div style="width:24px;height:24px;border:3px solid #e0e0e0;border-top-color:#4285F4;border-radius:50%;animation:spin 1s linear infinite; margin: 0 auto 12px auto;"></div>
          Checking status...
        </div>

        <div id="subModalActive" style="display: none; text-align: center;">
          <div style="display:inline-flex; align-items:center; justify-content:center; background:#e6f4ea; color:#137333; padding: 6px 12px; border-radius: 100px; font-size: 14px; font-weight: 600; margin-bottom: 16px; gap: 6px;">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6L9 17l-5-5"/></svg>
            Active Member
          </div>
          <div style="font-size: 14px; color: #5f6368; margin-bottom: 8px;">Your subscription expires in</div>
          <div id="subDaysRemaining" style="font-size: 48px; font-weight: 800; color: #4285F4; margin-bottom: 8px; line-height: 1;">X</div>
          <div style="font-size: 14px; font-weight: 600; color: #1a1a1a; margin-bottom: 24px;">Days</div>
          <div id="subExpiryDate" style="font-size: 13px; color: #70757a; margin-bottom: 24px;">Expires on: ...</div>
          
          <a href="/plus.html" style="display: block; width: 100%; background-color: #4285F4; color: #ffffff; text-align: center; padding: 12px; border-radius: 100px; font-weight: 600; text-decoration: none; margin-bottom: 12px; transition: background-color 0.2s;">Renew Now</a>
          <a href="#" style="display: block; width: 100%; border: 1px solid #dadce0; background-color: #ffffff; color: #3c4043; text-align: center; padding: 12px; border-radius: 100px; font-weight: 600; text-decoration: none; transition: background-color 0.2s;" onclick="alert('Billing portal integration pending.'); return false;">Manage Billing</a>
        </div>

        <div id="subModalInactive" style="display: none; text-align: center;">
          <div style="display:inline-flex; align-items:center; justify-content:center; background:#f1f3f4; color:#5f6368; padding: 6px 12px; border-radius: 100px; font-size: 14px; font-weight: 600; margin-bottom: 16px; gap: 6px;">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M15 9l-6 6M9 9l6 6"/></svg>
            Not a Member
          </div>
          <div style="font-size: 16px; font-weight: 600; color: #1a1a1a; margin-bottom: 16px;">Join GrabRaw+ for unlimited sourcing</div>
          
          <ul style="text-align: left; font-size: 14px; color: #5f6368; margin-bottom: 24px; padding: 0; list-style: none;">
            <li style="margin-bottom: 8px; display: flex; align-items: center; gap: 8px;"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#4285F4" stroke-width="2"><path d="M20 6L9 17l-5-5"/></svg> Priority support</li>
            <li style="margin-bottom: 8px; display: flex; align-items: center; gap: 8px;"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#4285F4" stroke-width="2"><path d="M20 6L9 17l-5-5"/></svg> Unlimited searches</li>
            <li style="display: flex; align-items: center; gap: 8px;"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#4285F4" stroke-width="2"><path d="M20 6L9 17l-5-5"/></svg> Export to PDF</li>
          </ul>

          <a href="/plus.html" style="display: block; width: 100%; background-color: #4285F4; color: #ffffff; text-align: center; padding: 12px; border-radius: 100px; font-weight: 600; text-decoration: none; transition: background-color 0.2s;">Upgrade to GrabRaw+</a>
        </div>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML('beforeend', modalHTML);

  const style = document.createElement('style');
  style.textContent = \`
    @keyframes spin { 100% { transform: rotate(360deg); } }
    @media (max-width: 480px) {
      .sub-modal-content { max-width: 90vw !important; padding: 24px !important; }
    }
  \`;
  document.head.appendChild(style);

  const overlay = document.getElementById('subModalOverlay');
  const closeBtn = document.getElementById('closeSubModalBtn');
  const loading = document.getElementById('subModalLoading');
  const activeView = document.getElementById('subModalActive');
  const inactiveView = document.getElementById('subModalInactive');
  const card = overlay.querySelector('.sub-modal-content');

  function closeModal() {
    overlay.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    setTimeout(() => { overlay.style.display = 'none'; }, 200);
  }

  function openModal() {
    overlay.style.display = 'flex';
    // Small delay to allow display flex to apply before opacity transition
    setTimeout(() => {
      overlay.style.opacity = '1';
      card.style.transform = 'translateY(0)';
    }, 10);
    fetchData();
  }

  async function fetchData() {
    loading.style.display = 'block';
    activeView.style.display = 'none';
    inactiveView.style.display = 'none';

    try {
      const { data: { session } } = await window.sb.auth.getSession();
      if (!session) {
        inactiveView.style.display = 'block';
        loading.style.display = 'none';
        return;
      }
      
      const { data: profile } = await window.sb.from('profiles').select('subscription_active, subscription_expiry, subscription_plan').eq('id', session.user.id).single();
      
      if (profile && profile.subscription_active && profile.subscription_expiry) {
        const expiryDate = new Date(profile.subscription_expiry);
        const today = new Date();
        const diffMs = expiryDate - today;
        const days = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
        
        if (days > 0) {
          document.getElementById('subDaysRemaining').textContent = days;
          
          const options = { year: 'numeric', month: 'long', day: 'numeric' };
          document.getElementById('subExpiryDate').textContent = "Expires on: " + expiryDate.toLocaleDateString(undefined, options);
          
          activeView.style.display = 'block';
        } else {
          // expired
          inactiveView.style.display = 'block';
        }
      } else {
        inactiveView.style.display = 'block';
      }
    } catch(e) {
      console.error(e);
      inactiveView.style.display = 'block'; // fallback
    } finally {
      loading.style.display = 'none';
    }
  }

  closeBtn.addEventListener('click', closeModal);
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeModal();
  });

  document.addEventListener('click', (e) => {
    if (e.target.closest('.open-subscription-modal')) {
      e.preventDefault();
      openModal();
      
      // Close mobile dropdown if it is open
      const accountDropdown = document.getElementById('accountDropdown');
      if (accountDropdown) {
        accountDropdown.style.opacity = '0';
        setTimeout(() => { accountDropdown.style.display = 'none'; }, 150);
      }
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initSubscriptionModal();
});
