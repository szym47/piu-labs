import products from '../data/products.json' with { type: 'json' };
import './product-card.js';

export default class ProductList extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        .grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          gap: 2rem;
        }
      </style>
      <div class="grid"></div>
    `;

    const grid = this.shadowRoot.querySelector('.grid');

    products.forEach(p => {
      const card = document.createElement('product-card');
      card.product = p;
      grid.appendChild(card);
    });
  }
}

customElements.define('product-list', ProductList);
