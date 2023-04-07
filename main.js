import {Actor, ButtonActor, registry} from './actors.js';
import {Todos} from './todos/todos.js'

const app = document.getElementById('app');
const para = document.createElement('p');
const node = document.createTextNode(`This is JS Actors.`);
const messages = document.createElement('ul');

para.appendChild(node);
app.appendChild(para);
app.appendChild(messages);

const mainActor = new Actor((message => {
    const messageText = document.createTextNode(`Got message: ${JSON.stringify(message)}`);
    const messageElement = document.createElement('li');
    messageElement.appendChild(messageText);
    messages.appendChild(messageElement);
}));

new ButtonActor(document.getElementById('button'), () => {
    mainActor.send({type: 'click', data: 'Button clicked!'});
});

new Todos(app);

registry.broadcast({type: 'init'});
registry.lookup(mainActor.id).send({type: 'message', data: 'Message sent via lookup'});

