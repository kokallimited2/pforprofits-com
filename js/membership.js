/**
 * Supabase client for pforprofits.com
 * Shared across all membership pages
 */

const SUPABASE_URL = 'https://qknuholrnhfeduvjhssf.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_V1euUYcZKfbITjF3H34l1g_UCGzL1OL';

// Initialize Supabase client
const { createClient } = window.supabase;
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Check if user is logged in and their subscription status
async function getAuthState() {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return { loggedIn: false, user: null, isPro: false, session: null };
  
  const meta = session.user.user_metadata || {};
  const isPro = meta.subscription === 'pro';
  const subStatus = meta.subscription_status; // 'active', 'past_due', 'canceled'
  const stripePortal = meta.stripe_portal_url;
  
  return {
    loggedIn: true,
    user: session.user,
    isPro: isPro && subStatus === 'active',
    subscriptionStatus: subStatus,
    stripePortalUrl: stripePortal,
    session
  };
}

// Redirect if not logged in
async function requireAuth(redirectTo = '/login.html') {
  const state = await getAuthState();
  if (!state.loggedIn) {
    window.location.href = redirectTo + '?redirect=' + encodeURIComponent(window.location.pathname);
    return null;
  }
  return state;
}

// Redirect if not pro
async function requirePro(redirectTo = '/pricing.html') {
  const state = await requireAuth();
  if (!state) return null;
  if (!state.isPro) {
    window.location.href = redirectTo + '?redirect=' + encodeURIComponent(window.location.pathname);
    return null;
  }
  return state;
}

// Sign out
async function signOut() {
  await supabase.auth.signOut();
  window.location.href = '/';
}

// Format price
function formatPrice(amount, currency = 'GBP') {
  return new Intl.NumberFormat('en-GB', { style: 'currency', currency }).format(amount);
}

// Show/hide loading state
function showLoading(containerId) {
  const el = document.getElementById(containerId);
  if (el) el.innerHTML = '<div class="spinner"><div class="spinner-ring"></div><p>Loading...</p></div>';
}

// On-page init - listen for auth changes
supabase.auth.onAuthStateChange((event, session) => {
  if (event === 'SIGNED_IN') {
    // Refresh page state if needed
    document.dispatchEvent(new CustomEvent('auth-change', { detail: { loggedIn: true } }));
  } else if (event === 'SIGNED_OUT') {
    document.dispatchEvent(new CustomEvent('auth-change', { detail: { loggedIn: false } }));
  }
});

// Update navigation bar auth state (call on every page)
async function updateNavAuth() {
  const state = await getAuthState();
  const navRight = document.getElementById('nav-right');
  if (!navRight) return;
  
  if (state.loggedIn) {
    navRight.innerHTML = `
      <a href="/account.html" class="nav-link">My Account</a>
      ${state.isPro ? '<span class="pro-badge">PRO</span>' : '<a href="/pricing.html" class="btn-primary">Upgrade</a>'}
      <button onclick="signOut()" class="btn-secondary">Sign Out</button>
    `;
  } else {
    navRight.innerHTML = `
      <a href="/login.html" class="nav-link">Sign In</a>
      <a href="/signup.html" class="btn-primary">Get Started Free</a>
    `;
  }
}
