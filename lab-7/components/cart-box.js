const STORAGE_KEY = 'lab7-cart';

export default class CartBox extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.items = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    }

    #handleAddToCart = (e) => {
        this.items.push(e.detail);
        this.save();
        this.render();
    };

    connectedCallback() {
        if (this._initialized) return;
        this._initialized = true;

        this.render();

        document.addEventListener('add-to-cart', this.#handleAddToCart, true);
    }

    disconnectedCallback() {
        document.removeEventListener(
            'add-to-cart',
            this.#handleAddToCart,
            true
        );
    }

    save() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.items));
    }

    remove(index) {
        this.items.splice(index, index >= 0 ? 1 : 0);
        this.save();
        this.render();
    }

    clearCart() {
        this.items = [];
        localStorage.removeItem(STORAGE_KEY);
        this.render();
    }

    render() {
        const sum = this.items.reduce((s, p) => s + p.price, 0);

        this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          background: white;
          padding: 1rem;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.15);
        }

        ul {
          list-style: none;
          padding: 0;
          margin: 0.5rem 0;
        }

        li {
          display: flex;
          justify-content: space-between;
          margin-bottom: 0.4rem;
        }

        button {
          border: none;
          background: transparent;
          cursor: pointer;
        }

        .clear {
          margin-top: 0.5rem;
          width: 100%;
          padding: 0.4rem;
          background: #eee;
          border-radius: 4px;
        }
      </style>

      <h2>Koszyk</h2>

      <ul>
        ${this.items
            .map(
                (p, i) => `
          <li>
            ${p.name} - ${p.price.toFixed(2)} zł
            <button data-i="${i}">❌</button>
          </li>
        `
            )
            .join('')}
      </ul>

      <strong>Suma: ${sum.toFixed(2)} zł</strong>
      <button class="clear">Wyczyść koszyk</button>
    `;

        // usuwanie pojedynczych produktów
        this.shadowRoot
            .querySelectorAll('li button')
            .forEach(
                (btn) =>
                    (btn.onclick = () => this.remove(Number(btn.dataset.i)))
            );

        // czyszczenie koszyka
        this.shadowRoot.querySelector('.clear').onclick = () =>
            this.clearCart();
    }
}

customElements.define('cart-box', CartBox);
