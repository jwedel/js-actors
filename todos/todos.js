/*
 * Copyright (c) 2023. by Jan Wedel
 */

import {Actor} from "../actors.js";

export class TodoService {
    async getAll(skip, limit) {
        skip = skip || 0;
        limit = limit || 10;
        return await fetch(`https://dummyjson.com/todos?limit=${limit}&skip=${skip}`).then(response => response.json());
    }
}

export class Todos extends Actor {
    constructor(parentElement, parent) {
        super((message => {
            this.receive(message);
        }), parent);
        this._todosList = document.createElement('ul');
        parentElement.appendChild(this._todosList);
    }

    receive(message) {
        const {type, data} = message;
        console.log('Message received', type, data);
        switch (type) {
            case 'init': {
                break;
            }
            case 'todos': {
                this._todosList.innerHTML = '';
                if (data?.todos) {
                    for (let todo of data.todos) {
                        const todoListItem = document.createElement('li');
                        todoListItem.appendChild(document.createTextNode(`[${todo.completed ? 'X' : ' '}] ${todo.todo}`));
                        this._todosList.appendChild(todoListItem);

                    }
                }
            }
        }
    }
}