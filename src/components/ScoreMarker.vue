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
        class="rounded-full bg-opacity-50 absolute -translate-x-1/2 -translate-y-1/2"
        :class="marker.validated ? (marker.isCorrect ? 'bg-green-500' : 'bg-red-500') : 'bg-yellow-500'"
    ></div>
</template>
