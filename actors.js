class Registry {
    _registry = new Map();

    register(id, actor) {
        this._registry.set(id, actor);
    }

    lookup(id) {
        return this._registry.get(id);
    }

    broadcast(message) {
        for (let actor of this._registry.values()) {
            actor.send(message);
        }
    }
}

export const registry = new Registry();

export class Actor {
    _receiveFunction;
    _id;
    _parent;
    constructor(receiveFunction, parent) {
        this._receiveFunction = receiveFunction;
        this._id = Object.freeze({});
        this._parent = parent;
        registry.register(this._id, this);
    }

    get id() {
        return this._id;
    }

    get parent() {
        return this._parent;
    }

    send(message) {
        if(this._receiveFunction) {
            this._receiveFunction(message);
        }
    }
}

export class ButtonActor extends Actor {
    _messageType;
    constructor(buttonElement, parent, messageType) {
        super(((() => {})), parent);
        this._messageType = messageType ? messageType : 'click';
        buttonElement.addEventListener('click', (event) => {
            parent.send({type : this._messageType, data: event});
        })
    }
}