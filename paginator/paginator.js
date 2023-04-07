import {Actor, ButtonActor} from "../actors.js";

export class Paginator extends Actor {
    _parent;
    constructor(parentElement, parent) {
        super((message => {
            this.receive(message);
        }));
        this._parent = parent;
        this._left = document.createElement('button');
        this._left.appendChild(document.createTextNode('<'));
        this._pageLegend = document.createTextNode(this.buildPaginatorLegend());
        document.createElement('span').appendChild(this._pageLegend);
        this._right = document.createElement('button');
        this._right.appendChild(document.createTextNode('>'));

        new ButtonActor(this._left, parent, 'left-paginator-button-clicked');
        new ButtonActor(this._right, parent, 'right-paginator-button-clicked');

        parentElement.appendChild(this._left);
        parentElement.appendChild(this._pageLegend);
        parentElement.appendChild(this._right);
    }

    buildPaginatorLegend(total, skip, limit) {
        let totalPages = 0;
        let currentPage = 0;
        if(limit > 0) {
            totalPages = Math.ceil(total / limit);
            currentPage = Math.floor(skip / limit) + 1;
        }
        return `${currentPage} of ${totalPages}`;
    }

    receive(message) {
        console.log('Message', message);
        const {type, data} = message;
        switch (type) {
            case 'page': {
                this._pageLegend.textContent = this.buildPaginatorLegend(data.total, data.skip, data.limit);
                break;
            }
        }
    }
}