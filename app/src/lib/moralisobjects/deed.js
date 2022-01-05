

export default class Deed extends window.Moralis.Object {
    constructor() {
        super('Deed');

        this.category = "";
        this.title = "";
        this.description = "";
        this.address = "";
        this.timeframe = {
            start: '',
            end: ''
        }
        this.steps = [];
        this.coordinates = new window.Moralis.GeoPoint();
        this.isActive = true;
        this.allowChat = false;
        this.participants = null;
    }

    get title() {
        return this.get('title');
    }

    set title(value) {
        this.set('title', value);
    }

    get pictures() {
        return this.get('pictures');
    }

    set pictures(value) {
        this.set('pictures', value);
    }

    get category() {
        return this.get('category');
    }

    set category(value) {
        this.set('category', value);
    }

    get description() {
        return this.get('description');
    }

    set description(value) {
        this.set('description', value);
    }

    get address() {
        return this.get('address');
    }

    set address(value) {
        this.set('address', value);
    }

    get coordinates() {
        return this.get('coordinates');
    }

    set coordinates(value) {
        this.set('coordinates', value);
    }

    get deliverables() {
        return this.get('deliverables');
    }

    set deliverables(value) {
        this.set('deliverables', value);
    }

    get timeframe() {
        return this.get('timeframe');
    }

    set timeframe(value) {
        this.set('timeframe', value)
    }

    get hasReward() {
        return this.get('hasReward');
    }

    set hasReward(value) {
        this.set('hasReward', value)
    }

    get creatorId() {
        return this.get('creatorId');
    }

    set creatorId(value) {
        this.set('creatorId', value)
    }

    get participants() {
        return this.get('participants');
    }

    set participants(value) {
        this.set('participants', value)
    }

    get maxParticipant() {
        return this.get('maxParticipant');
    }

    set maxParticipant(value) {
        this.set('maxParticipant', value)
    }

    get sponsors() {
        return this.get('sponsors');
    }

    set sponsors(value) {
        this.set('sponsors', value)
    }

    get criticality() {
        return this.get('criticality');
    }

    set criticality(value) {
        this.set('criticality', value)
    }

    get difficulty() {
        return this.get('difficulty');
    }

    set difficulty(value) {
        this.set('difficulty', value)
    }

    get steps() {
        return this.get('steps');
    }

    set steps(value) {
        this.set('steps', value)
    }

    get isActive() {
        return this.get('isActive');
    }

    set isActive(value) {
        this.set('isActive', value)
    }

    get allowChat() {
        return this.get('allowChat')
    }

    set allowChat(value) {
        this.set('allowChat', value)
    }
}

window.Moralis.Object.registerSubclass('Deed', Deed);
