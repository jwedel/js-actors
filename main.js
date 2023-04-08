/*
 * Copyright (c) 2023. by Jan Wedel
 */

import {Actor, ButtonActor, registry} from './actors.js';
import {Todos, TodoService} from './todos/todos.js'
import {Paginator} from './paginator/paginator.js'

const app = document.getElementById('app');
const para = document.createElement('p');
const node = document.createTextNode(`This is JS Actors.`);
const messages = document.createElement('ul');

para.appendChild(node);
app.appendChild(para);
app.appendChild(messages);

class Main extends Actor {
    _button;
    _todos;
    _paginator;
    _limit = 10;
    _skip = 0;
    _total = 0;
    _todosService;

    constructor() {
        super((message => {
            this.receive(message);
        }));
        this._button = new ButtonActor(document.getElementById('button'), this, 'main-button');
        this._todos = new Todos(document.getElementById('todos'));
        this._paginator = new Paginator(document.getElementById('paginator'), this);
        this._todosService = new TodoService();

    }

    receive(message) {

        const messageText = document.createTextNode(`Got message: ${JSON.stringify(message)}`);
        const messageElement = document.createElement('li');
        messageElement.appendChild(messageText);
        messages.appendChild(messageElement);

        const {type} = message;
        switch (type) {
            case 'init': {
                this.send({type: 'fetch-todos'});
                break;
            }
            case 'fetch-todos': {
                this._todosService.getAll(this._skip, this._limit)
                    .then((response => {
                        this._total = response.total;
                        this._skip = response.skip;
                        this._limit = response.limit;

                        this._todos.send({type: 'todos', data: response});
                        this._paginator.send({
                            type: 'page', data: {
                                total: response.total,
                                skip: response.skip,
                                limit: response.limit
                            }
                        })
                    }));
                break;
            }
            case 'left-paginator-button-clicked': {
                if(this._skip > 0)
                {
                    const nextSkip = this._skip - this._limit;
                    this._skip = Math.max(0, nextSkip);
                    this.send({type: 'fetch-todos'});
                }
                break;
            }
            case 'right-paginator-button-clicked': {
                const nextSkip = this._skip + this._limit;
                if(nextSkip < this._total) {
                    this._skip = nextSkip;
                    this.send({type: 'fetch-todos'});
                }
                break;
            }
        }
    }
}

const mainActor = new Main();

registry.broadcast({type: 'init'});
registry.lookup(mainActor.id).send({type: 'message', data: 'Message sent via lookup'});

