

export default class Category extends window.Moralis.Object {
    constructor() {
        super('Category');

        this.title = 'New Title';
        this.value = 0.1;
        this.sortorder = 1;
    }

    get title() {
        return this.get('title');
    }

    set title(value) {
        this.set('title', value);
    }

    get value() {
        return this.get('value');
    }

    set value(value) {
        this.set('value', value);
    }

    get sortorder() {
        return this.get('sortorder');
    }

    set sortorder(value) {
        this.set('sortorder', value);
    }
}

window.Moralis.Object.registerSubclass('Category', Category);
