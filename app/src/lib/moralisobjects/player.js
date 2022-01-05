

export default class Player extends window.Moralis.User {
    constructor() {
        super({
            firstName: '',
            lastName: '',
            email: '',
            phone: '',
            interests: [],
            deeds: [{
                previousDeeds: [],
                currentDeeds: [],
                futureDeeds: [],
            }],
            yourWorld: {},
            xp: 0,
            maxXp: 100,
            affiliation: [],
            socialMediaProfiles: {
                twitter: '',
                facebook: '',
                instagram: '',
                snapChat: ''
            },
            isMember: false,
            isRequestingCompletion: '',
        });
    }

    get firstName() {
        return this.get('firstName');
    }

    set firstName(value) {
        this.set('firstName', value);
    }

    get lastName() {
        return this.get('lastName');
    }

    set lastName(value) {
        this.set('lastName', value);
    }

    get email() {
        return this.get('email');
    }

    set email(value) {
        this.set('email', value);
    }

    get phone() {
        return this.get('phone');
    }

    set phone(value) {
        this.set('phone', value);
    }

    get socialMediaProfiles() {
        return this.get('socialMediaProfiles');
    }

    set socialMediaProfiles(value) {
        this.set('socialMediaProfiles', value);
    }

    get affiliation() {
        return this.get('affiliation');
    }

    set affiliation(value) {
        this.set('affiliation', value);
    }

    get xp() {
        return this.get('xp');
    }

    set xp(value) {
        this.set('xp', value);
    }

    
    get maxXp() {
        return this.get('maxXp');
    }

    set maxXp(value) {
        this.set('maxXp', value);
    }

    get yourWorld() {
        return this.get('yourWorld');
    }

    set yourWorld(value) {
        this.set('yourWorld', value);
    }

    get deeds() {
        return this.get('deeds');
    }

    set deeds(value) {
        this.set('deeds', value);
    }

    get interests() {
        return this.get('interests');
    }

    set interests(value) {
        this.set('interests', value);
    }

    get isMember() {
        return this.get('isMember');
    }

    set isMember(value) {
        this.set('isMember', value);
    }

    get createdDeeds() {
        return this.get('createdDeeds');
    }

    set createdDeeds(value) {
        this.set('createdDeeds', value);
    }

    get participatingDeed() {
        return this.get('participatingDeed');
    }

    set participatingDeed(value) {
        this.set('participatingDeed', value);
    }

    get isRequestingCompletion() {
        return this.get('isRequestingCompletion');
    }

    set isRequestingCompletion(value) {
        this.set('isRequestingCompletion', value);
    }
};

window.Moralis.Object.registerSubclass('_User', Player);
