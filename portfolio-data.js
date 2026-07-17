// Real client work, newest first.
// To add a new site: add a new object to the TOP of this array. Do not reorder existing entries.
const PORTFOLIO_ENTRIES = [
  {
    name: 'Budget Website',
    category: 'This Very Site',
    url: 'https://www.budgetwebsite.store',
    image: 'portfolio-img/budgetwebsite-laptop.png',
  },
  {
    name: 'Bhagyashree Car Rentals',
    category: 'Car Rental Service',
    url: 'https://bhagyashree-car-rentals.vercel.app/',
    image: 'portfolio-img/bhagyashree-car.jpg',
  },
  {
    name: 'Coco Palms',
    category: 'Resort / Hospitality · Nashik',
    url: 'https://cocopalmsnashik.in',
    image: 'portfolio-img/coco-palms.jpeg',
  },
  {
    name: 'G7 Gaming',
    category: 'Gaming Parlour · Andheri West',
    url: 'https://g7gaming.co.in',
    image: 'portfolio-img/g7-gaming.jpg',
  },
];

function renderPortfolioCards(entries) {
  return entries.map(e => `
    <a href="${e.url}" target="_blank" rel="noopener" class="portfolio-card">
      <div class="portfolio-thumb">
        <img src="${e.image}" alt="${e.name}" loading="lazy">
      </div>
      <div class="portfolio-info">
        <div class="portfolio-name">${e.name}</div>
        <div class="portfolio-cat">${e.category}</div>
      </div>
    </a>
  `).join('');
}
