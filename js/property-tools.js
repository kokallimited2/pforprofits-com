// === Property Investment Calculators ===

// Format currency
function fmtPound(n) { return '£' + Number(n).toLocaleString('en-GB', {minimumFractionDigits: 0, maximumFractionDigits: 0}); }
function fmtPercent(n) { return Number(n).toFixed(2) + '%'; }

// === BRRR CALCULATOR ===
function calcBRRR() {
  const purchase = parseFloat(document.getElementById('brrr-purchase').value) || 0;
  const refurb = parseFloat(document.getElementById('brrr-refurb').value) || 0;
  const costs = parseFloat(document.getElementById('brrr-costs').value) || 0;
  const postValue = parseFloat(document.getElementById('brrr-value').value) || 0;
  const ltv = parseFloat(document.getElementById('brrr-ltv').value) || 0;
  const rent = parseFloat(document.getElementById('brrr-rent').value) || 0;

  const totalInvest = purchase + refurb + costs;
  const refiAmount = postValue * (ltv / 100);
  const cashLeftIn = totalInvest - refiAmount;
  const cashOut = refiAmount > totalInvest ? '£' + Number(refiAmount - totalInvest).toLocaleString('en-GB') : 'None — cash in';
  const roi = cashLeftIn > 0 ? ((postValue - totalInvest) / totalInvest) * 100 : 0;

  document.getElementById('brrr-investment').textContent = fmtPound(totalInvest);
  document.getElementById('brrr-refinance').textContent = fmtPound(refiAmount);
  document.getElementById('brrr-cash-in').textContent = fmtPound(Math.max(0, cashLeftIn));
  document.getElementById('brrr-cash-out').textContent = cashOut;
  document.getElementById('brrr-roi').textContent = fmtPercent(roi);

  const cfEl = document.getElementById('brrr-cashflow');
  cfEl.textContent = fmtPound(rent);
  cfEl.className = 'result-value ' + (rent >= 0 ? 'positive' : 'negative');
}

// === RENTAL YIELD CALCULATOR ===
function calcYield() {
  const price = parseFloat(document.getElementById('yield-price').value) || 0;
  const rent = parseFloat(document.getElementById('yield-rent').value) || 0;
  const costs = parseFloat(document.getElementById('yield-costs').value) || 0;
  const mortgage = parseFloat(document.getElementById('yield-mortgage').value) || 0;

  const grossAnnual = rent * 12;
  const grossYield = price > 0 ? (grossAnnual / price) * 100 : 0;
  const netAnnual = grossAnnual - costs - mortgage;
  const netYield = price > 0 ? (netAnnual / price) * 100 : 0;
  const monthly = netAnnual / 12;

  document.getElementById('yield-gross').textContent = fmtPercent(grossYield);
  document.getElementById('yield-net').textContent = fmtPercent(netYield);
  document.getElementById('yield-gross-income').textContent = fmtPound(grossAnnual);
  document.getElementById('yield-net-income').textContent = fmtPound(netAnnual);
  const mEl = document.getElementById('yield-monthly');
  mEl.textContent = fmtPound(monthly);
  mEl.className = 'result-value ' + (monthly >= 0 ? 'positive' : 'negative');
}

// === DEAL ANALYSER ===
function calcDeal() {
  const price = parseFloat(document.getElementById('deal-price').value) || 0;
  const deposit = parseFloat(document.getElementById('deal-deposit').value) || 0;
  const costs = parseFloat(document.getElementById('deal-costs').value) || 0;
  const refurb = parseFloat(document.getElementById('deal-refurb').value) || 0;
  const rent = parseFloat(document.getElementById('deal-rent').value) || 0;
  const mortgage = parseFloat(document.getElementById('deal-mortgage').value) || 0;
  const expenses = parseFloat(document.getElementById('deal-expenses').value) || 0;

  const totalInvest = deposit + costs + refurb;
  const monthlyFlow = rent - mortgage - expenses;
  const annualFlow = monthlyFlow * 12;
  const roi = totalInvest > 0 ? (annualFlow / totalInvest) * 100 : 0;
  const breakeven = annualFlow > 0 ? Math.round(totalInvest / annualFlow * 12) : '—';

  document.getElementById('deal-investment').textContent = fmtPound(totalInvest);
  const cfEl = document.getElementById('deal-cashflow');
  cfEl.textContent = fmtPound(monthlyFlow);
  cfEl.className = 'result-value ' + (monthlyFlow >= 0 ? 'positive' : 'negative');

  const afEl = document.getElementById('deal-annual');
  afEl.textContent = fmtPound(annualFlow);
  afEl.className = 'result-value ' + (annualFlow >= 0 ? 'positive' : 'negative');

  document.getElementById('deal-roi').textContent = fmtPercent(roi);
  document.getElementById('deal-breakeven').textContent = breakeven;
}
