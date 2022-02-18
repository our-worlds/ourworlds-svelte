import { readable, writable } from 'svelte/store';

import Deed from "$lib/moralisobjects/deed.js";


export const isLocationAccessAllowed = readable(false, (set) => {
    let currentResult;

    const stateResult = (state) => state === 'granted';

    // NOTE: navigator.permissions is undefined on iOS
    if (navigator === undefined || navigator.permissions === undefined) {
        set(false);
    }

    navigator.permissions.query({name:'geolocation'})
        .then((result) => {
            currentResult = result;

            set(stateResult(result.state));
            result.onchange = () => set(stateResult(result.state));
        });

    return () => { if (currentResult) currentResult.onchange = undefined; }
});


export const currentPage = writable(1);
export const pageCount = writable(1);
export const tempDeed = writable(new Deed());
