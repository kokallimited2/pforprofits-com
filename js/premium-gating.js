/**
 * Premium gating for pforprofits.com
 * Controls visibility of Pro features based on subscription status
 */

// Show premium-only elements
async function showPremiumContent() {
  const state = await getAuthState();
  const isPro = state.loggedIn && state.isPro;
  
  // Find all premium elements and toggle visibility
  document.querySelectorAll('.premium-only').forEach(el => {
    el.style.display = isPro ? '' : 'none';
  });
  
  document.querySelectorAll('.pro-badge').forEach(el => {
    el.style.display = isPro ? '' : 'none';
  });
  
  // Show upgrade prompt to free users
  document.querySelectorAll('.upgrade-prompt').forEach(el => {
    el.style.display = (!isPro && state.loggedIn) ? '' : 'none';
  });
  
  // Show signup prompt to non-logged-in users
  document.querySelectorAll('.signup-prompt').forEach(el => {
    el.style.display = !state.loggedIn ? '' : 'none';
  });
  
  // Update premium buttons
  document.querySelectorAll('.premium-feature-btn').forEach(btn => {
    if (isPro) {
      btn.disabled = false;
      btn.title = '';
    } else if (state.loggedIn) {
      btn.disabled = true;
      btn.title = 'Upgrade to Pro to unlock this feature';
    } else {
      btn.disabled = true;
      btn.title = 'Sign in to access this feature';
    }
  });
}

// Premium calculator enhancements
function enhanceDealAnalyser() {
  // Add pro-only metrics to deal analysis (called after calculation)
  const isPro = getAuthState().then(s => s.isPro);
  
  // Pro features to add:
  // 1. Cash-on-cash return
  // 2. IRR estimate
  // 3. 5-year projection
  // 4. Tax impact estimate
  // 5. Compare to benchmark
}

// Run on page load
document.addEventListener('DOMContentLoaded', () => {
  showPremiumContent();
});
