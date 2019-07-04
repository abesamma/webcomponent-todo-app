const template = document.createElement('template');
template.innerHTML = `
    <style>
        :host {
            display: block;
            text-align: center;
        }
        ul {
            padding: 20px;
            margin: auto;
            width: 50%;
            height: 100%;
        }
        button {
            border: none;
            cursor: pointer;
        }
    </style>
    <input type="text" placeholder="Add new todo item..."></input>
    <button title="Add todo">➕</button>
    <ul id="todos"></ul>`;

class TodoApp extends HTMLElement {
    constructor () {
        super();
        this._shadowRoot = this.attachShadow({ mode: 'open' });
        this._shadowRoot.appendChild(template.content.cloneNode(true));
        this.todoListNode = this._shadowRoot.querySelector('ul');
        this.addTodoButtonNode = this._shadowRoot.querySelector('button');
        this.inputNode = this._shadowRoot.querySelector('input');
        this._todos = [];
    }
    _render() {
        this.todoListNode.innerHTML = '';
        this._todos.forEach((item, index) => {
            let todoItemNode = document.createElement('todo-item');
            todoItemNode.setAttribute('text', item.text);
            todoItemNode.setAttribute('index', index);
            if (item.checked) todoItemNode.setAttribute('checked','');
            todoItemNode.addEventListener('onRemove', this._removeTodo.bind(this));
            todoItemNode.addEventListener('onCheck', this._checkTodo.bind(this));
            this.todoListNode.appendChild(todoItemNode);
        });
    }
    connectedCallback () {
        this.addTodoButtonNode.addEventListener('click', this._addTodo.bind(this));
    }
    _addTodo () {
        if (this.inputNode.value.length > 0) this._todos.push({ text: this.inputNode.value });
        this.inputNode.value = '';
        this._render();
    }
    _removeTodo (e) {
        this._todos.splice(e.detail, 1);
        this._render(); // then render
    }
    _checkTodo (e) {
        let todo = this._todos[e.detail];
        this._todos[e.detail] = Object.assign({}, todo, {
            checked: !this._todos[e.detail].checked
        });
        this._render();
    }
    set todos (value) {
        this._todos.push(value);
        this._render();
    }
    get todos () {
        return this._todos;
    }
}

self.customElements.define('todo-app', TodoApp);