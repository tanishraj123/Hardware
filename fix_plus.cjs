const fs = require('fs');

let html = fs.readFileSync('plus.html', 'utf8');

// Replace Hero CTA
html = html.replace(
  /<button class="btn btn-primary" style="border-radius: 100px; padding: 14px 28px; font-size: 16px;">Join GrabRaw\+ — ₹199\/month<\/button>/,
  `<button class="btn btn-primary rzp-checkout-btn-full" style="border-radius: 100px; padding: 14px 28px; font-size: 16px; display:inline-flex; align-items:center; gap:8px;">Join GrabRaw+<div class="spinner" style="display:none;width:16px;height:16px;border:2px solid #fff;border-top-color:transparent;border-radius:50%;animation:spin 1s linear infinite;"></div></button>`
);

// Replace Bottom CTA
html = html.replace(
  /<button class="btn btn-primary" style="border-radius: 100px; padding: 14px 32px; font-size: 16px; margin-bottom: 16px;">Join GrabRaw\+ — ₹199\/month<\/button>/,
  `<button class="btn btn-primary rzp-checkout-btn-full" style="border-radius: 100px; padding: 14px 32px; font-size: 16px; margin-bottom: 16px; display:inline-flex; align-items:center; justify-content:center; gap:8px;">Join GrabRaw+<div class="spinner" style="display:none;width:16px;height:16px;border:2px solid #fff;border-top-color:transparent;border-radius:50%;animation:spin 1s linear infinite;"></div></button>`
);

// Replace Card CTA
html = html.replace(
  /<button class="btn btn-primary" style="width: 100%; border-radius: 100px; font-weight: 600; padding: 12px;">Join GrabRaw\+<\/button>\n\s*<div style="font-size: 13px; color: #5f6368; text-align: center; margin-top: 12px;">Payment coming soon — join waitlist<\/div>/,
  `<button class="btn btn-primary rzp-checkout-btn-short" style="width: 100%; border-radius: 100px; font-weight: 600; padding: 12px; display:inline-flex; align-items:center; justify-content:center; gap:8px;">Join GrabRaw+<div class="spinner" style="display:none;width:16px;height:16px;border:2px solid #fff;border-top-color:transparent;border-radius:50%;animation:spin 1s linear infinite;"></div></button>`
);

// Replace Card Price
html = html.replace(
  /<div style="font-size: 40px; font-weight: 800; color: #1a1a1a; margin-bottom: 24px;">₹199 <span style="font-size: 16px; font-weight: 500; color: #5f6368;">\/ month<\/span><\/div>/,
  `<div id="plus-price-card" style="font-size: 40px; font-weight: 800; color: #1a1a1a; margin-bottom: 24px;">₹199 <span style="font-size: 16px; font-weight: 500; color: #5f6368;">/ month</span></div>`
);

const scriptToAdd = `
<!-- Razorpay Checkout -->
<script src="https://checkout.razorpay.com/v1/checkout.js"></script>
<style>
@keyframes spin { 100% { transform: rotate(360deg); } }
.plus-toast { position: fixed; top: 20px; right: 20px; padding: 16px 24px; border-radius: 8px; font-size: 14px; font-weight: 600; color: white; display: none; z-index: 10000; box-shadow: 0 4px 12px rgba(0,0,0,0.15); animation: toastFade 0.3s ease; }
@keyframes toastFade { from { opacity: 0; transform: translateY(-20px); } to { opacity: 1; transform: translateY(0); } }
.plus-toast.success { background-color: #34A853; }
.plus-toast.error { background-color: #EA4335; }
</style>
<script>
document.addEventListener("DOMContentLoaded", async () => {
    const toastContainer = document.createElement('div');
    document.body.appendChild(toastContainer);
    function showToast(message, type) {
        const toast = document.createElement('div');
        toast.className = 'plus-toast ' + type;
        toast.innerText = message;
        toast.style.display = 'block';
        toastContainer.appendChild(toast);
        setTimeout(() => { toast.style.opacity = '0'; setTimeout(() => toast.remove(), 300); }, 3000);
    }

    const btnsFull = document.querySelectorAll('.rzp-checkout-btn-full');
    const btnsShort = document.querySelectorAll('.rzp-checkout-btn-short');
    const priceCard = document.getElementById('plus-price-card');
    
    let isIndia = true;
    let paymentAmountPaise = 19900;
    let paymentAmountCents = 250;
    
    // IP Detection
    try {
        const resp = await fetch('https://ipapi.co/json/');
        const data = await resp.json();
        if (data && data.country_code) {
           isIndia = data.country_code === 'IN';
        }
    } catch(e) { console.error('IP fetch error:', e); }

    const amount = isIndia ? paymentAmountPaise : paymentAmountCents;
    const currency = isIndia ? "INR" : "USD";
    const textFull = isIndia ? "Join GrabRaw+ — ₹199/month" : "Join GrabRaw+ — $2.50 USD";
    
    btnsFull.forEach(b => b.childNodes[0].nodeValue = textFull);
    // btnsShort stays "Join GrabRaw+" or similar, but without price
    
    if (priceCard) {
        priceCard.innerHTML = isIndia ? '₹199 <span style="font-size: 16px; font-weight: 500; color: #5f6368;">/ month</span>' : '$2.50 <span style="font-size: 16px; font-weight: 500; color: #5f6368;">/ month</span>';
    }

    const setBtnsLoading = (loading) => {
        document.querySelectorAll('.rzp-checkout-btn-full, .rzp-checkout-btn-short').forEach(b => {
            b.disabled = loading;
            const spinner = b.querySelector('.spinner');
            if(spinner) spinner.style.display = loading ? 'block' : 'none';
        });
    }

    const startCheckout = async () => {
        setBtnsLoading(true);
        try {
            const { data: { session } } = await window.sb.auth.getSession();
            if (!session) {
                window.location.href = 'signin.html?redirect=plus.html';
                return;
            }
            
            const user = session.user;
            const email = user.email || '';
            const name = user.user_metadata?.full_name || user.user_metadata?.name || email || '';

            const options = {
                key: 'rzp_test_T0zm2z3mxQjYTL',
                amount: amount,
                currency: currency,
                name: 'GrabRaw',
                description: 'GrabRaw+ Monthly Subscription',
                image: 'https://grabraw.com/logo.png', // Optional
                handler: async function (response) {
                    showToast('Processing your subscription...', 'success');
                    try {
                        const expiryDate = new Date();
                        expiryDate.setDate(expiryDate.getDate() + 30);
                        
                        const payload = {
                            plan: 'plus',
                            subscription_active: true,
                            subscription_expiry: expiryDate.toISOString(),
                            subscription_plan: 'monthly'
                        };
                        const { error } = await window.sb.from('profiles').update(payload).eq('id', user.id);
                        if (error) throw error;
                        
                        showToast('Welcome to GrabRaw+! 🎉', 'success');
                        setTimeout(() => {
                            window.location.href = 'index.html';
                        }, 2000);
                    } catch(err) {
                        showToast('Error updating profile. Contact support.', 'error');
                        console.error('Update error:', err);
                    }
                },
                prefill: {
                    name: name,
                    email: email,
                    contact: ''
                },
                theme: {
                    color: '#4285F4'
                },
                modal: {
                    ondismiss: function() {
                        setBtnsLoading(false);
                    }
                },
                config: {
                    display: {
                        hide: []
                    }
                }
            };
            
            if (isIndia) {
                options.config.display.sequence = ['block.upi', 'block.cards', 'block.wallets', 'block.netbanking'];
                options.config.display.preferences = { show_default_blocks: true };
            } else {
                options.config.display.sequence = ['block.cards'];
                options.config.display.preferences = { show_default_blocks: true };
            }

            const rzp = new Razorpay(options);
            rzp.on('payment.failed', function (response){
                showToast(response.error.description || 'Payment failed', 'error');
                setBtnsLoading(false);
            });
            
            rzp.open();
        } catch (err) {
            console.error('Checkout err:', err);
            showToast('Something went wrong.', 'error');
            setBtnsLoading(false);
        }
    };

    document.querySelectorAll('.rzp-checkout-btn-full, .rzp-checkout-btn-short').forEach(b => {
        b.addEventListener('click', startCheckout);
    });
});
</script>
`;

if (!html.includes('checkout.razorpay.com')) {
    html = html.replace('</body>', scriptToAdd + '\n</body>');
}

fs.writeFileSync('plus.html', html, 'utf8');
