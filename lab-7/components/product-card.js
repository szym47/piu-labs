const template = document.createElement('template');
template.innerHTML = `
<style>
  :host {
    display: flex;
    flex-direction: column;
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.15);
    overflow: hidden;
    height: 100%;
  }

  img {
    width: 100%;
    aspect-ratio: 3 / 4;
    object-fit: cover;
  }

  .content {
    padding: 1rem;
    display: flex;
    flex-direction: column;
    flex: 1;
  }

  .name {
    font-weight: bold;
    font-size: 1.2rem;
  }

  .price {
    color: #004b9b;
    margin: 0.4rem 0;
  }

  .promo {
    color: red;
    font-weight: bold;
    min-height: 1.1em;
    margin-bottom: 0.5rem;
  }

  .list {
    display: flex;
    gap: 0.4rem;
    flex-wrap: wrap;
    margin-bottom: 0.5rem;
  }

  .tag {
    font-size: 0.8rem;
    padding: 0.2rem 0.5rem;
    border-radius: 4px;
    background: #eee;
  }

  .size {
    border: 1px solid #004b9b;
    color: #004b9b;
    background: white;
  }

  button {
    margin-top: auto;
    padding: 0.5rem;
    border: none;
    border-radius: 6px;
    background: #004b9b;
    color: white;
    cursor: pointer;
  }

  button:hover {
    background: #003a7a;
  }
</style>

<img>
<div class="content">
  <div class="name"></div>
  <div class="price"></div>
  <div class="promo"></div>
  <div class="colors list"></div>
  <div class="sizes list"></div>
  <button>Do koszyka</button>
</div>
`;

export default class ProductCard extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.appendChild(template.content.cloneNode(true));
    }

    set product(value) {
        this._product = value;
        this.render();
    }

    get product() {
        return this._product;
    }

    connectedCallback() {
        if (this._listenerAdded) return;
        this._listenerAdded = true;
        this.shadowRoot
            .querySelector('button')
            .addEventListener('click', () => {
                this.dispatchEvent(
                    new CustomEvent('add-to-cart', {
                        detail: this.product,
                        bubbles: true,
                        composed: true,
                    })
                );
            });
    }

    render() {
        const p = this.product;
        if (!p) return;

        this.shadowRoot.querySelector('img').src = p.image;
        this.shadowRoot.querySelector('.name').textContent = p.name;
        this.shadowRoot.querySelector(
            '.price'
        ).textContent = `${p.price.toFixed(2)} zł`;
        this.shadowRoot.querySelector('.promo').textContent = p.promo || '';

        const colors = this.shadowRoot.querySelector('.colors');
        colors.innerHTML = '';
        p.colors?.forEach(
            (c) => (colors.innerHTML += `<span class="tag">${c}</span>`)
        );

        const sizes = this.shadowRoot.querySelector('.sizes');
        sizes.innerHTML = '';
        p.sizes?.forEach(
            (s) => (sizes.innerHTML += `<span class="tag size">${s}</span>`)
        );
    }
}

customElements.define('product-card', ProductCard);
