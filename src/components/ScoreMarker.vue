<script setup>
import { reactive } from 'vue';
import { SelectedSliceMarker } from '../utils/marker.js';

const props = defineProps({
    marker: Object,
    elem: SVGGElement,
    parent: HTMLElement,
});

const markerType = props.marker instanceof SelectedSliceMarker ? 'slice' : 'note';

const elemRect = props.elem.getBoundingClientRect();
const parentRect = props.parent.getBoundingClientRect();

const markerSize = 50;

const position = reactive({
    width: `${markerSize}px`,
    height: `${markerSize}px`,
    left: `${elemRect.x + elemRect.width / 2 - parentRect.x}px`,
    top: `${elemRect.y + elemRect.height / 2 - parentRect.y}px`,
});

if (props.marker instanceof SelectedSliceMarker) {
    const measureRect = props.elem.closest('g.measure').getBoundingClientRect();
    const heightExtender = 10;
    const yOffset = 10;
    const height = measureRect.height + heightExtender;
    position.height = `${height}px`;
    position.top = `${measureRect.y + (height) / 2  - parentRect.y - heightExtender / 2 + yOffset}px`;
}
</script>

<template>
    <div
        :style="position"
        class="score-marker"
        :class="[
            markerType,
            `scoremarker-${marker.id}`,
            marker.validated ? (marker.isCorrect ? 'is-correct' : 'is-not-correct') : '',
        ]"
    ></div>
</template>

<style scoped>
.score-marker {
    @apply rounded-full bg-opacity-50 absolute -translate-x-1/2 -translate-y-1/2 bg-yellow-500;
}

.score-marker.slice {
    @apply bg-opacity-25 rounded-md;
}

.score-marker.is-correct {
    @apply bg-green-500 bg-opacity-50;
}

.score-marker.is-not-correct {
    @apply bg-red-500 bg-opacity-50;
}

.highlight {
    animation: pulse 1s ease-in-out infinite;
}

@keyframes pulse {
    0% {
        --tw-sccale-x: 1;
        --tw-sccale-y: 1;
        transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate))
            skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(1) scaleY(1);
    }
    50% {
        --tw-sccale-x: 1.5;
        --tw-sccale-y: 1.5;
        transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate))
            skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(1.5) scaleY(1.5);
    }
    100% {
        --tw-sccale-x: 1;
        --tw-sccale-y: 1;
        transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate))
            skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(1) scaleY(1);
    }
}
</style>
