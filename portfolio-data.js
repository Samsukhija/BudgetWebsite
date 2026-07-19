// Real client work. Order matters: Samar's client sites lead, Lekhraj's
// platform builds follow. To add a new site, put it at the top of the
// right group.
const PORTFOLIO_ENTRIES = [
  // Samar's client builds first.
  {
    name: 'Bhagyashree Car Rentals',
    category: 'Car Rental Service',
    url: 'https://bhagyashree-car-rentals.vercel.app/',
    image: '/portfolio-img/bhagyashree-car.jpg',
  },
  {
    name: 'Coco Palms',
    category: 'Resort / Hospitality · Nashik',
    url: 'https://cocopalmsnashik.in',
    image: '/portfolio-img/coco-palms.jpeg',
  },
  {
    name: 'G7 Gaming',
    category: 'Gaming Parlour · Andheri West',
    url: 'https://g7gaming.co.in',
    image: '/portfolio-img/g7-gaming.jpg',
  },
  // Lekhraj's platform builds after.
  {
    name: 'NJ Mart',
    category: 'Ayurveda & Wellness E-Commerce',
    url: 'https://njmarrt.com',
    image: '/portfolio-img/njmart.png',
  },
  {
    name: 'NutriCart',
    category: 'AI Meal Planning & Grocery Platform',
    url: 'https://nutricart.dev',
    image: '/portfolio-img/nutricart.png',
  },
  {
    name: 'India Import Atlas',
    category: 'Data & Research Platform',
    url: 'https://indiaimport.org',
    image: '/portfolio-img/india-import-atlas.png',
  },
  {
    name: 'Budget Website',
    category: 'This Very Site',
    url: 'https://www.budgetwebsite.store',
    image: '/portfolio-img/budgetwebsite-laptop.png',
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
