<script setup>
import IntonationChecker from './components/IntonationChecker.vue';
import { createWorkerVerovioToolkit } from 'vue-verovio-canvas';
import createVerovioWorker from './verovio-worker.js?worker';
const toolkit = createWorkerVerovioToolkit(createVerovioWorker());

const errors = [
    {
        noteIds: ['n14yce2d'],
        measure: 30,
        comment: 'Vl1 ces3 hoch',
        time: 10.1,
    },
    {
        noteIds: ['n15iyvoi', 'n4z873f'],
        measure: 34,
        comment: 'Vc Ges tief',
        time: 28,
    },
    {
        noteIds: ['nlctiz8'],
        measure: 35,
        comment: 'Va es hoch',
        time: 30,
    },
    {
        noteIds: ['n1nahl3k', 'nwv84ud', 'ni3uoqs'],
        measure: 37,
        comment: 'Va es + ges tief',
        time: 37,
    },
    {
        noteIds: ['n1g5wcqm'],
        measure: 41,
        comment: 'Vl2 as tief',
        time: 50,
    },
    {
        noteIds: ['n1h2e61q', 'n5zf451'],
        measure: 45,
        comment: 'Vl1 hes1 + b1 tief',
        time: 59,
    },
];
</script>

<template>
    <IntonationChecker
        :toolkit="toolkit"
        score-url="score.mei"
        correct-audio-url="correct.mp3"
        wrong-audio-url="wrong.mp3"
        :errors="errors"
        title="Beethoven Op. 74, 2. Satz, Takt 24-49"
        description="Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua."
    />
</template>

<style>
body, html, #app {
    width: 100%;
    height: 100%;
}
</style>
