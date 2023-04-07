import {Actor} from "../actors.js";

export class TodoService {
    async getAll() {
        return await fetch('https://dummyjson.com/todos?limit=10').then(response => response.json());
    }
}

export class Todos extends Actor {
    constructor(parentElement) {
        super((message => {
            this.receive(message);
        }));
        this._todosList = document.createElement('ul');
        parentElement.appendChild(document.createElement('h2').appendChild(document.createTextNode('TODOS:')));
        parentElement.appendChild(this._todosList);
        this._todosService = new TodoService();
    }

    receive(message) {
        const {type, data} = message;
        console.log('Message received', type, data);
        switch (type) {
            case 'init': {
                this._todosService.getAll()
                    .then((response => this.send({type: 'todos', data: response})));
                break;
            }
            case 'todos': {
                console.log('todos:', data);
                if (data?.todos) {
                    for (let todo of data.todos) {
                        const todoListItem = document.createElement('li');
                        todoListItem.appendChild(document.createTextNode(todo.todo));
                        this._todosList.appendChild(todoListItem);

                    }
                }
            }
        }
    }
}