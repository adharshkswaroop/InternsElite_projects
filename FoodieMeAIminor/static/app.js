const form = document.querySelector('#recommendation-form');
const budget = document.querySelector('#budget');
const budgetRange = document.querySelector('#budget-range');
const budgetOutput = document.querySelector('#budget-output');
const grid = document.querySelector('#results-grid');
const emptyState = document.querySelector('#empty-state');
const resultCount = document.querySelector('#result-count');

function formatBudget(value) {
  return `₹${Number(value).toLocaleString('en-IN')}`;
}

function syncBudget(value) {
  budget.value = value;
  budgetRange.value = value;
  budgetOutput.value = formatBudget(value);
  budgetOutput.textContent = formatBudget(value);
}

budget.addEventListener('input', () => syncBudget(budget.value));
budgetRange.addEventListener('input', () => syncBudget(budgetRange.value));

function cardTemplate(restaurant) {
  const tags = [restaurant.delivery && 'Delivery', restaurant.takeaway && 'Takeaway', restaurant.indoor && 'Dine-in']
    .filter(Boolean).map((tag) => `<span>${tag}</span>`).join('');
  return `<article class="restaurant-card"><div class="card-top"><span class="match-tag">TOP MATCH</span><a class="external-link" href="${restaurant.url}" target="_blank" rel="noreferrer" aria-label="Open ${restaurant.name} on Zomato">↗</a></div><h3>${restaurant.name}</h3><p class="card-area">⌖ ${restaurant.area}</p><p class="card-cuisines">${restaurant.cuisines}</p><div class="card-divider"></div><div class="card-meta"><span class="rating"><b>★</b> ${restaurant.rating.toFixed(1)} <small>${restaurant.rating_label}</small></span><span class="cost">₹${restaurant.cost} <small>for two</small></span></div><div class="card-tags">${tags}</div></article>`;
}

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  const button = form.querySelector('button');
  button.disabled = true;
  button.querySelector('span:first-child').textContent = 'Finding your shortlist...';
  try {
    const response = await fetch('/api/recommend', { method: 'POST', body: new FormData(form) });
    const payload = await response.json();
    grid.innerHTML = payload.results.map(cardTemplate).join('');
    emptyState.classList.toggle('hidden', payload.results.length > 0);
    resultCount.textContent = `${payload.results.length} matches`;
    document.querySelector('#results-title').textContent = payload.results.length ? 'Worth a closer look' : 'No close matches';
    document.querySelector('.results-panel').scrollIntoView({ behavior: 'smooth', block: 'start' });
  } catch (error) {
    resultCount.textContent = 'Try again';
  } finally {
    button.disabled = false;
    button.querySelector('span:first-child').textContent = 'Explore recommendations';
  }
});