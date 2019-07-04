const template = document.createElement('template');
template.innerHTML = `
    <style>
        :host {
            display: block;
        }
        li {
            padding: 2.5px;
        }
        button {
            border: none;
            cursor: pointer;
        }
        li {
            overflow-wrap: anywhere
        }
        .completed {
            text-decoration: line-through;
        }
    </style>
    <li>
        <button>✖️</button>
        <label></label>
        <input type="checkbox"></input>
    </li>`;

class TodoItem extends HTMLElement {
    constructor () {
        // attaching event listeners
        super();
        this._shadowRoot = this.attachShadow({ mode: 'open' });
        this._shadowRoot.appendChild(template.content.cloneNode(true));
        // select our buttons and checkboxes
        this.removeItemButtonNode = this._shadowRoot.querySelector('button');
        this.checkItemNode = this._shadowRoot.querySelector('input');
        this.textNode = this._shadowRoot.querySelector('label');
        // attaching events to said buttons and checkboxes
        this.removeItemButtonNode.addEventListener('click', e => {
            this.dispatchEvent(new CustomEvent('onRemove', { detail: this.index, bubbles: true }));
        });
        this.checkItemNode.addEventListener('click', e => {
            this.dispatchEvent(new CustomEvent('onCheck', { detail: this.index, bubbles: true }));
        });
    }
    _render () {
        this.textNode.innerHTML = this._text;
        if (this.hasAttribute('checked')) {
            this.checkItemNode.setAttribute('checked','');
            this.textNode.classList.add('completed');
        } else {
            this.textNode.classList.remove('completed');
            this.checkItemNode.removeAttribute('checked');
        }
    }
    connectedCallback () {
        // setting up shop with default attribute values
        if (!this.hasAttribute('text')) {
            this.setAttribute('text', 'This is a placeholder item.');
        }
        this._render();
    }
    static get observedAttributes () {
        return ['text', 'checked', 'index'];
    }
    attributeChangedCallback (name, oldVal, newVal) {
        switch (name) {
            case 'checked':
                this.textNode.classList.add('completed');
                break;
            case 'text':
                this._text = newVal;
                break;
            case 'index':
                this._index = newVal;
                break;
        }
    }
    get checked () {
        return this.hasAttribute('checked');
    }
    set checked (value) {
        if (value) {
            this.checkItemNode.setAttribute('checked','');
        } else this.checkItemNode.removeAttribute('checked');
    }
    get index () {
        return this._index;
    }
    set index (value) {
        let i = parseInt(value);
        this._index = i;
    }
}

self.customElements.define('todo-item', TodoItem);
