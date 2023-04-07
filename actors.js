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
    constructor(receiveFunction) {
        this._receiveFunction = receiveFunction;
        this._id = Object.freeze({});
        registry.register(this._id, this);
    }

    get id() {
        return this._id;
    }

    send(message) {
        this._receiveFunction(message);
    }
}

export class ButtonActor extends Actor {
    constructor(buttonElement, receiveFunction) {
        super(receiveFunction);
        buttonElement.addEventListener('click', (event) => {
            this._receiveFunction({type : 'click', data: event});
        })
    }
}