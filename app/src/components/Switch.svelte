<script>
    import { onMount, onDestroy} from "svelte";

    export let label;
    export let value = false;

    let isDragging = false;
    let recentlyDragged = false;
    let thumbsize = 0;
    let padding = 0;
    let bounds = {
        lower: 0,
        middle: 0,
        upper: 0,
    };

    let switchElement;

    const getStyle = (element, prop) => parseInt(window.getComputedStyle(element).getPropertyValue(prop));
    const getPseudoStyle = (element, prop) => parseInt(window.getComputedStyle(element, ':before').getPropertyValue(prop))


    onMount(() => {
        // There is some racing condition, no clue as to what, this delay seems to circumvent it for now
        thumbsize = getPseudoStyle(switchElement, 'width');
        padding = getStyle(switchElement, 'padding-left') + getStyle(switchElement, 'padding-right');

        bounds = {
            lower: 0,
            middle: (switchElement.clientWidth - padding) / 4,
            upper: switchElement.clientWidth - thumbsize - padding,
        };

        switchElement.addEventListener('pointerdown', dragInit.bind(this));
        switchElement.addEventListener('pointerup', dragEnd.bind(this));
        switchElement.addEventListener('click', preventBlubbling.bind(this));

        window.addEventListener('pointerup', dragEnd.bind(this));
    })

    onDestroy(() => {
        switchElement.removeEventListener('pointerdown', dragInit.bind(this));
        switchElement.removeEventListener('pointerup', dragEnd.bind(this));
        switchElement.removeEventListener('click', preventBlubbling.bind(this));

        window.removeEventListener('pointerup', dragEnd.bind(this));
    })

    function dragInit() {
            if (switchElement.disabled) return;

            isDragging = true;

            switchElement.addEventListener('pointermove', dragging.bind(this));
            switchElement.style.setProperty('--thumb-transition-duration', '0s');
        }

    function dragEnd() {
            if (isDragging !== true) return;

            switchElement.checked = determineChecked();

            if (switchElement.indeterminate) {
                switchElement.indeterminate = false;
            }

            switchElement.style.removeProperty('--thumb-transition-duration');
            switchElement.style.removeProperty('--thumb-position');
            switchElement.removeEventListener('pointermove', dragging.bind(this));

            isDragging = false;

            padRelease();
        }

    function dragging(event) {
            if (isDragging !== true) return;

            const directionality = getStyle(switchElement, '--isLTR');
            const track = (directionality === -1) ? (switchElement.clientWidth * -1) + thumbsize + padding : 0;

            let pos = Math.round(event.offsetX - thumbsize / 2);
            if (pos < bounds.lower) pos = 0;
            if (pos > bounds.upper) pos = bounds.upper;

            switchElement.style.setProperty('--thumb-position', `${track + pos}px`);
        }

    function determineChecked() {
            let curpos = Math.abs( Number.parseInt( switchElement.style.getPropertyValue('--thumb-position')));

            if (!curpos) {
                curpos = switchElement.checked ? bounds.lower : bounds.upper;
            }

            return curpos >= bounds.middle;
        }

    function padRelease() {
            recentlyDragged = true;

            setTimeout(() => recentlyDragged = false, 300);
        }

    function preventBlubbling(event) {
        if (recentlyDragged) {
            event.preventDefault() && event.stopPropagation();
        }
    }
</script>


<style>
    :root {
        --brand-hue: 200;
        --brand-saturation: 100%;
        --brand-lightness: 50%;
        --brand-light: hsl(var(--brand-hue) var(--brand-saturation) var(--brand-lightness));
        --text1-light: hsl(var(--brand-hue) var(--brand-saturation) 10%);
        --surface1-light: hsl(var(--brand-hue) 25% 100%);
        --brand-dark: hsl(var(--brand-hue) calc(var(--brand-saturation) / 2) calc(var(--brand-lightness) / 1.5));
        --text1-dark: hsl(var(--brand-hue) 15% 85%);
        --surface1-dark: hsl(var(--brand-hue) 10% 10%);

        --brand: var(--brand-light);
        --text1: var(--text1-light);
        --surface1: var(--surface1-light)
    }

    .gui-switch {
        --thumb-size: 2rem;
        --thumb: hsl(0, 0%, 100%);
        --thumb-highlight: hsla(0, 0%, 0%, 0.25);
        --track-size: calc(var(--thumb-size) * 2);
        --track-padding: 2px;
        --track-inactive: hsl(80, 0%, 80%);
        --track-active: hsl(80, 60%, 45%);
        --thumb-color: var(--thumb);
        --thumb-color-highlight: var(--thumb-highlight);
        --track-color-inactive: var(--track-inactive);
        --track-color-active: var(--track-active);
        --isLTR: 1;

        display: flex;
        align-items: center;
        gap: 2ch;
        justify-content: space-between;
        cursor: pointer;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
        -webkit-tap-highlight-color: transparent
    }

    .gui-switch {
        font-weight: 700;
        border: 0;
    }

    .gui-switch span {
        width: fit-content;

        margin-inline-start: 10px;
        margin-block-end: -12px;
        padding-inline: 2px;

        background-color: white;
        z-index: 5;
    }

    .gui-switch:dir(rtl) {
        --isLTR: -1
    }

    .gui-switch.-vertical {
        min-block-size: calc(var(--track-size) + calc(var(--track-padding) * 2))
    }

    .gui-switch.-vertical > input {
        transform: rotate(calc(90deg * var(--isLTR) * -1));
        touch-action: pan-x
    }

    .gui-switch > input {
        --thumb-position: 0%;
        --thumb-transition-duration: .25s;
        padding: var(--track-padding);
        background: var(--track-color-inactive);
        inline-size: var(--track-size);
        block-size: var(--thumb-size);
        border-radius: var(--track-size);
        -webkit-appearance: none;
        -moz-appearance: none;
        appearance: none;
        pointer-events: none;
        touch-action: pan-y;
        border: none;
        outline-offset: 5px;
        box-sizing: content-box;
        flex-shrink: 0;
        display: grid;
        align-items: center;
        grid:[track] 1fr/[track] 1fr;
        transition: background-color .25s ease
    }

    .gui-switch > input::before {
        --highlight-size: 0;
        content: "";
        cursor: pointer;
        pointer-events: auto;
        grid-area: track;
        inline-size: var(--thumb-size);
        block-size: var(--thumb-size);
        background: var(--thumb-color);
        box-shadow: 0 0 0 var(--highlight-size) var(--thumb-color-highlight);
        border-radius: 50%;
        transform: translateX(var(--thumb-position))
    }

    .gui-switch > input:not(:disabled):hover::before {
        --highlight-size: .5rem
    }

    .gui-switch > input:checked {
        background: var(--track-color-active);
        --thumb-position: calc((var(--track-size) - 100%) * var(--isLTR))
    }

    .gui-switch > input:indeterminate {
        --thumb-position: calc(
                calc(calc(var(--track-size) / 2) - calc(var(--thumb-size) / 2))
                * var(--isLTR)
        )
    }

    .gui-switch > input:disabled {
        cursor: not-allowed;
        --thumb-color: transparent
    }

    .gui-switch > input:disabled::before {
        cursor: not-allowed;
        box-shadow: inset 0 0 0 2px hsla(0, 0%, 100%, .5)
    }

    @-webkit-keyframes octocat-wave {
        0%, 100% {
            transform: rotate(0)
        }
        20%, 60% {
            transform: rotate(-25deg)
        }
        40%, 80% {
            transform: rotate(10deg)
        }
    }

    @keyframes octocat-wave {
        0%, 100% {
            transform: rotate(0)
        }
        20%, 60% {
            transform: rotate(-25deg)
        }
        40%, 80% {
            transform: rotate(10deg)
        }
    }
</style>


<label for="{label}" class="gui-switch">
    <span>{label}</span>
    <input is="gui-switch" type="checkbox" role="switch" id="{label}"
           bind:this={switchElement} bind:checked={value}>
</label>
