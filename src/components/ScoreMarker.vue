<script setup>
import { reactive } from 'vue';

const props = defineProps({
    marker: Object,
    elem: SVGGElement,
    parent: HTMLElement,
});

const elemmRect = props.elem.getBoundingClientRect();
const parentRect = props.parent.getBoundingClientRect();

const markerSize = 50;

const position = reactive({
    width: `${markerSize}px`,
    height: `${markerSize}px`,
    left: `${elemmRect.x + elemmRect.width / 2 - parentRect.x}px`,
    top: `${elemmRect.y + elemmRect.height / 2 - parentRect.y}px`,
});
</script>

<template>
    <div
        :style="position"
        class="score-marker"
        :class="[
            `scoremarker-${marker.id}`,
            marker.validated ? (marker.isCorrect ? 'is-correct' : 'is-not-correct') : '',
        ]"
    ></div>
</template>

<style scoped>
.score-marker {
    @apply rounded-full bg-opacity-50 absolute -translate-x-1/2 -translate-y-1/2 bg-yellow-500;
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
