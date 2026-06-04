function loadNavbar() {
  const navHTML = `
  <nav class="navbar">
    <div class="nav-container">
      <a href="/index.html" class="nav-logo">
        <img src="https://res.cloudinary.com/duh9wvgzu/image/upload/q_auto/f_auto/v1780501537/IMG_5442_r9v9ez.jpg" 
             alt="GrabRaw" style="height:40px">
        <span>GrabRaw</span>
      </a>
      <div class="nav-links">
        <a href="#">Material</a>
        <a href="#">Suppliers</a>
        <a href="/plus.html">GrabRaw +</a>
        <a href="#">Ask AI</a>
      </div>
      <div class="nav-auth">
        <div id="loggedOutNav">
          <a href="/signin.html" class="btn-signin">Sign In</a>
          <a href="/signin.html" class="btn-getstarted">Get Started</a>
        </div>
        <div id="loggedInNav" style="display:none">
          <button id="myAccountBtn">
            My Account
            <div class="avatar-wrapper">
              <div id="avatarCircle"></div>
              <div id="plusBadge" class="plus-badge" 
                   style="display:none">✦</div>
            </div>
          </button>
          <div id="accountDropdown" style="display:none">
            <div class="dropdown-header">
              <small>SIGNED IN AS</small>
              <div id="dropdownEmail"></div>
              <div id="dropdownPlusBadge" style="display:none">
                ⭐ GrabRaw+ Member
              </div>
            </div>
            <hr>
            <a href="/profile.html">Profile</a>
            <a href="/location.html">My Location</a>
            <a href="/my-partners.html">My Partner</a>
            <a href="/register-company.html">Register Company</a>
            <hr>
            <a id="signOutBtn" style="color:red;cursor:pointer">
              Sign Out
            </a>
          </div>
        </div>
      </div>
    </div>
  </nav>`;

  document.getElementById('navbar-placeholder')
    .innerHTML = navHTML;
  initAuth();
}

async function initAuth() {
  const { data: { session } } = 
    await supabase.auth.getSession();
  if (session) await updateNavbar(session.user);

  supabase.auth.onAuthStateChange(async (e, session) => {
    if (session) await updateNavbar(session.user);
    else showLoggedOut();
  });

  document.addEventListener('click', (e) => {
    if (!e.target.closest('#myAccountBtn')) {
      document.getElementById('accountDropdown')
        .style.display = 'none';
    }
  });

  document.getElementById('myAccountBtn')
    ?.addEventListener('click', (e) => {
      e.stopPropagation();
      const d = document.getElementById('accountDropdown');
      d.style.display = 
        d.style.display === 'none' ? 'block' : 'none';
    });

  document.getElementById('signOutBtn')
    ?.addEventListener('click', async () => {
      await supabase.auth.signOut();
      window.location.href = '/index.html';
    });
}

async function updateNavbar(user) {
  const { data } = await supabase
    .from('profiles')
    .select('plan, full_name, avatar_url')
    .eq('id', user.id).single();

  const plan = data?.plan || 'free';
  const avatar = data?.avatar_url || 
    user.user_metadata?.avatar_url;
  const name = data?.full_name || user.email;

  document.getElementById('loggedOutNav')
    .style.display = 'none';
  document.getElementById('loggedInNav')
    .style.display = 'flex';
  document.getElementById('dropdownEmail')
    .textContent = user.email;

  const circle = document.getElementById('avatarCircle');
  if (avatar) {
    circle.innerHTML = 
      `<img src="${avatar}" style="width:36px;
       height:36px;border-radius:50%;object-fit:cover">`;
  } else {
    circle.textContent = name.charAt(0).toUpperCase();
  }

  if (plan === 'plus') {
    document.getElementById('plusBadge')
      .style.display = 'block';
    document.getElementById('dropdownPlusBadge')
      .style.display = 'block';
  }

  window.userPlan = plan;
}

function showLoggedOut() {
  document.getElementById('loggedOutNav')
    .style.display = 'flex';
  document.getElementById('loggedInNav')
    .style.display = 'none';
  window.userPlan = 'free';
}
