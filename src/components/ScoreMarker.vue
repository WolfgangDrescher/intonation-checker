<script setup>
import { reactive, inject } from 'vue';
import { SelectedSliceMarker } from '../utils/marker.js';
import { getBBoxElem } from '../utils/bbox.js';

const props = defineProps({
    marker: Object,
    elem: SVGGElement | SVGRectElement,
    parent: HTMLElement,
});

const { mode } = inject('markersStore');

const markerType = props.marker instanceof SelectedSliceMarker ? 'slice' : 'note';

const elemRect = props.elem?.getBoundingClientRect() ?? {x: 0, y: 0, width: 0, height: 0};
const parentRect = getBBoxElem(props.parent).getBoundingClientRect();

const markerSize = props.marker instanceof SelectedSliceMarker ? 30 : 32;

const position = reactive({
    width: `${markerSize}px`,
    height: `${markerSize}px`,
    left: `${elemRect.x + elemRect.width / 2 - parentRect.x}px`,
    top: `${elemRect.y + elemRect.height / 2 - parentRect.y}px`,
});

if (props.marker instanceof SelectedSliceMarker) {
    const heightExtender = 15;
    const yOffset = 0;
    const measureElem = props.elem?.closest('g.measure');
    if (measureElem) {
        const staves = Array.from(measureElem.querySelectorAll('g.staff'));
        const firstStaff = staves[0];
        const lastStaff = staves[staves.length - 1];
        if (firstStaff && lastStaff) {
            const firstStaffRect = getBBoxElem(firstStaff).getBoundingClientRect();
            const lastStaffRect = getBBoxElem(lastStaff).getBoundingClientRect();
            const height = lastStaffRect.bottom - firstStaffRect.top + heightExtender;
            position.height = `${height}px`;
            position.top = `${firstStaffRect.top + (height) / 2  - parentRect.y - heightExtender / 2 + yOffset}px`;
        }
    }
}
</script>

<template>
    <div
        :style="position"
        class="score-marker"
        :class="[
            mode === markerType ? 'is-active' : '',
            markerType,
            `scoremarker-${marker.getId('')}`,
            marker.validated ? (marker.isCorrect ? 'is-correct' : 'is-not-correct') : '',
        ]"
    >
        <div class="score-marker-bg"></div>
        <div v-if="marker.readableId" v-text="marker.readableId" class="score-marker-id"></div>
    </div>
</template>

<style scoped>
.score-marker {
    @apply absolute -translate-x-1/2 -translate-y-1/2 opacity-40;
}

.score-marker.is-active {
    @apply opacity-100;
}

.score-marker .score-marker-bg {
    @apply rounded-full bg-opacity-50 bg-yellow-500;
}

.score-marker.slice .score-marker-bg {
    @apply rounded-md;
}

.score-marker.is-correct .score-marker-bg {
    @apply bg-green-500 bg-opacity-50;
}

.score-marker.is-not-correct .score-marker-bg {
    @apply bg-red-500 bg-opacity-50;
}

.highlight .score-marker-bg {
    animation: pulse 1s ease-in-out infinite;
}

.score-marker-id {
    @apply flex justify-center items-center bg-gray-200 border border-gray-300 w-6 h-6 shadow rounded-full text-center text-xl font-bold absolute left-0 top-0 -translate-x-1/2 -translate-y-1/2;
}

.score-marker-bg {
    @apply absolute top-0 left-0 w-full h-full;
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
