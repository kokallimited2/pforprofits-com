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

// === STAMP DUTY CALCULATOR ===
function calcSDLT() {
  const price = parseFloat(document.getElementById('sdlt-price').value) || 0;
  const isSurcharge = document.getElementById('sdlt-surcharge').value === 'yes';
  const isFTB = document.getElementById('sdlt-ftb').value === 'yes';

  // SDLT bands for residential properties (England & NI, 2026)
  const bands = [
    { from: 0,     to: 250000,   rate: 0 },
    { from: 250001, to: 925000,  rate: 5 },
    { from: 925001, to: 1500000, rate: 10 },
    { from: 1500001, to: Infinity, rate: 12 }
  ];

  // First-time buyer relief: 0% on first £425k if price ≤ £625k
  let ftbRelief = false;
  let ftbSaving = 0;
  if (isFTB && !isSurcharge && price <= 625000) {
    ftbRelief = true;
    // FTB relief: 0% on first £425k, then standard rates on remainder up to £625k
    // If price ≤ 425k: 0% total (bands below 425k apply 0% anyway)
    // If price 425k-625k: standard 5% on amount between 425k and 625k
  }

  let totalTax = 0;
  let breakdown = [];

  for (const band of bands) {
    if (price <= band.from) break;
    const taxable = Math.min(price, band.to) - band.from + (band.from === 0 ? 0 : 1);
    const adjustedTaxable = Math.min(price, band.to) - Math.max(band.from, 0);
    let layer = Math.max(0, Math.min(price, band.to) - band.from);
    if (band.from === 0) layer = Math.min(price, 250000);
    
    let bandStart = band.from;
    if (band.from > 0) bandStart = band.from - 1; // because the band starts at £1 over the threshold
    const bandAmount = Math.max(0, Math.min(price, band.to) - bandStart);
    
    let rate = band.rate;
    if (isSurcharge) rate += 3;
    
    // FTB relief: first £425k at 0%
    if (ftbRelief && band.from < 425000 && price >= band.from) {
      const ftbPortionEnd = Math.min(price, band.to, 425000);
      const ftbPortion = ftbPortionEnd - (band.from > 0 ? band.from - 1 : 0);
      const ftbPortion2 = Math.max(0, Math.min(price, 425000) - bandStart);
      const normalPortion = Math.max(0, Math.min(price, band.to) - Math.max(bandStart, 425000));
      totalTax += normalPortion * rate / 100;
    } else {
      totalTax += bandAmount * rate / 100;
    }
  }

  // Recalculate cleanly
  totalTax = 0;
  let remainingPrice = price;
  let prevThreshold = 0;

  const thresholdMap = [
    { threshold: 250000, rate: 0 },
    { threshold: 925000, rate: 5 },
    { threshold: 1500000, rate: 10 },
    { threshold: Infinity, rate: 12 }
  ];

  for (const tier of thresholdMap) {
    if (remainingPrice <= 0) break;
    const tierAmount = Math.min(remainingPrice, tier.threshold - prevThreshold);
    if (tierAmount > 0) {
      let rate = tier.rate;
      if (isSurcharge) rate += 3;

      // FTB relief: 0% on first £425k
      let taxableAmount = tierAmount;
      if (ftbRelief) {
        const ftbPortion = Math.max(0, Math.min(prevThreshold + tierAmount, 425000) - prevThreshold);
        taxableAmount = tierAmount - ftbPortion;
      }

      totalTax += taxableAmount * rate / 100;
    }
    remainingPrice -= tierAmount;
    prevThreshold += tierAmount;
    if (prevThreshold >= price) break;
  }

  // Simple non-FTB calculation (clean approach)
  if (!ftbRelief) {
    totalTax = 0;
    remainingPrice = price;
    prevThreshold = 0;
    for (const tier of thresholdMap) {
      if (remainingPrice <= 0) break;
      const tierAmount = Math.min(remainingPrice, tier.threshold - prevThreshold);
      if (tierAmount > 0) {
        let rate = tier.rate;
        if (isSurcharge) rate += 3;
        totalTax += tierAmount * rate / 100;
      }
      remainingPrice -= tierAmount;
      prevThreshold += tierAmount;
    }
  }

  // FTB calculation (separate, cleaner)
  if (ftbRelief && price <= 625000) {
    totalTax = 0;
    if (price > 425000) {
      const excess = price - 425000;
      // Standard rate on excess up to 625k
      if (excess > 0) {
        if (excess <= 500000) {
          totalTax = excess * 0.05; // 5% on £425k-£925k band
        } else {
          // Price between 425k and 925k, excess is 5% band
          totalTax = excess * 0.05;
        }
      }
      // If surcharge applies, add 3% on top of standard rates
      if (isSurcharge) {
        // Surcharge adds 3% to ALL bands including the 0% band
        totalTax += price * 0.03;
      }
    }
  }

  // Most robust simple approach:
  totalTax = 0;
  if (ftbRelief && price <= 425000 && !isSurcharge) {
    totalTax = 0;
  } else if (ftbRelief && price > 425000 && price <= 625000 && !isSurcharge) {
    // Standard rate on amount above £425k
    const excess = price - 425000;
    totalTax = excess * 0.05;
  } else {
    // Standard SDLT calculation
    if (price > 0) {
      const p = price;
      // 0% on first £250k
      let tax = 0;
      // 5% on £250k-£925k
      if (p > 250000) tax += Math.min(p, 925000) - 250000;
      // 10% on £925k-£1.5M
      if (p > 925000) tax += Math.min(p, 1500000) - 925000;
      // 12% above £1.5M
      if (p > 1500000) tax += p - 1500000;

      totalTax = 0;
      if (p > 250000) totalTax += (Math.min(p, 925000) - 250000) * 0.05;
      if (p > 925000) totalTax += (Math.min(p, 1500000) - 925000) * 0.10;
      if (p > 1500000) totalTax += (p - 1500000) * 0.12;

      if (isSurcharge) totalTax += p * 0.03;
    }
  }

  const effectiveRate = price > 0 ? (totalTax / price) * 100 : 0;

  document.getElementById('sdlt-total').textContent = fmtPound(totalTax);
  document.getElementById('sdlt-rate').textContent = fmtPercent(effectiveRate);
  document.getElementById('sdlt-purchase').textContent = fmtPound(price + totalTax);

  // Breakdown
  let breakdownHTML = '';
  if (price <= 250000) {
    breakdownHTML = '<div class="sdlt-band"><span>£0 – £250,000</span><span class="band-rate">0%</span><span class="band-amount">£0</span></div>';
  } else {
    const bands_data = [
      {label: '£0 – £250,000', amount: Math.min(price, 250000) - 0, baseRate: 0},
    ];
    if (price > 250000) {
      bands_data.push({label: '£250,001 – £925,000', amount: Math.min(price, 925000) - 250000, baseRate: 5});
    }
    if (price > 925000) {
      bands_data.push({label: '£925,001 – £1,500,000', amount: Math.min(price, 1500000) - 925000, baseRate: 10});
    }
    if (price > 1500000) {
      bands_data.push({label: '£1,500,001+', amount: price - 1500000, baseRate: 12});
    }

    for (const b of bands_data) {
      let rate = b.baseRate + (isSurcharge ? 3 : 0);
      let bandTax = b.amount * rate / 100;

      // FTB relief: 0% on first £425k
      if (ftbRelief && !isSurcharge) {
        if (b.label.includes('£0 –') || b.label.includes('£250,000') && price <= 425000) {
          // Check if this band overlaps with FTB relief
          const labelLower = parseInt(b.label.replace(/[^0-9]/g, '')) || 0;
          if (labelLower < 425000 && price <= 425000) {
            rate = 0;
            bandTax = 0;
          } else if (b.label.includes('£250,001') && price > 425000) {
            // Partial FTB relief - amount in this band up to £425k is exempt
            const excess = price - 425000;
            const ftbExempt = 925000 - 425000; // 500k
            const taxable = Math.min(b.amount, excess);
            bandTax = taxable * rate / 100;
          }
        }
        if (b.label.includes('£250,001') && price <= 425000) {
          rate = 0;
          bandTax = 0;
        }
      }

      breakdownHTML += '<div class="sdlt-band"><span>' + b.label + '</span><span class="band-rate">' + rate + '%</span><span class="band-amount">' + fmtPound(bandTax) + '</span></div>';
    }
    
    // For FTB relief where price ≤ 425k
    if (ftbRelief && price <= 425000 && !isSurcharge) {
      breakdownHTML = '<div class="sdlt-band"><span>£0 – £' + price.toLocaleString() + '</span><span class="band-rate">0%</span><span class="band-amount" style="color:var(--green);">£0 (FTB relief)</span></div>';
    }
    
    // For FTB where price > 425k and ≤ 625k
    if (ftbRelief && price > 425000 && price <= 625000 && !isSurcharge) {
      breakdownHTML = '<div class="sdlt-band"><span>£0 – £425,000</span><span class="band-rate">0%</span><span class="band-amount" style="color:var(--green);">£0 (FTB relief)</span></div>' +
        '<div class="sdlt-band"><span>£425,001 – £' + price.toLocaleString() + '</span><span class="band-rate">5%</span><span class="band-amount">' + fmtPound(totalTax) + '</span></div>';
    }
  }

  if (isSurcharge) {
    breakdownHTML += '<div class="sdlt-band sdlt-surcharge-line"><span>3% surcharge (additional property)</span><span class="band-rate">+3%</span><span class="band-amount">' + fmtPound(price * 0.03) + '</span></div>';
  }

  document.getElementById('sdlt-breakdown').innerHTML = breakdownHTML;

  const tag = document.getElementById('sdlt-tag');
  tag.textContent = isSurcharge ? 'Buy-to-Let / Second Home' : (ftbRelief ? 'First-Time Buyer' : 'Standard Residential');
  tag.className = 'tag ' + (isSurcharge ? 'tag-warning' : (ftbRelief ? 'tag-success' : 'tag-default'));
}
