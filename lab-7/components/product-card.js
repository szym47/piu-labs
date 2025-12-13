const template = document.createElement('template');
template.innerHTML = `
  <style>
    :host {
     display: block;
     background: white;
     border-radius: 8px;
     box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
     overflow: hidden;
     display: flex;
     flex-direction: column;
     height: 100%;
    }

    .image ::slotted(img) {
     width: 100%;
     display: block;
     aspect-ratio: 3 / 4;
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
     color: #004b9bff;
     margin: 0.5rem 0 0.4rem;
    }

    .promo {
     color: red;
     font-weight: bold;
     margin-bottom: 0.8rem;
     min-height: 1.1em;
    }

    .colors{
     margin-bottom: 0.65rem;
     min-height: 1.1em;
    }

    ::slotted([slot="colors"]) {
     width: 95%;
     display: flex;
     gap: 0.55rem;
     list-style: none;
     flex-wrap: wrap;
    }

    .sizes{
     margin-bottom: 0.2rem;
     min-height: 1.1em;
     padding-bottom: 2rem
    }

    ::slotted([slot="sizes"]) {
      width: 95%;
      display: flex;
      gap: 0.45rem;
      list-style: none;
      flex-wrap: wrap;
    }


    button {
     margin: 0 auto;
     width: 70%;
     padding: 0.5rem;
     background: #1e5a9c;
     color: white;
     border: none;
     cursor: pointer;
     border-radius: 6px;
     margin-top: auto;
    }

    button:hover {
     background: #17457a;
    }
  </style>

  <div class="image">
   <slot name="image"></slot>
  </div>

  <div class="content">
   <div class="name">
    <slot name="name"></slot>
   </div>

    <div class="price">
      <slot name="price"></slot>
    </div>

    <div class="promo">
      <slot name="promo"></slot>
    </div>

    <div class="colors">
      <slot name="colors"></slot>
    </div>
    <div class="sizes">
      <slot name="sizes"></slot>
    </div>

    <button>Do koszyka</button>
  </div>
`;

export default class ProductCard extends HTMLElement {
    constructor() {
        super();
        const shadow = this.attachShadow({ mode: 'open' });
        shadow.appendChild(template.content.cloneNode(true));
    }
}

customElements.define('product-card', ProductCard);
