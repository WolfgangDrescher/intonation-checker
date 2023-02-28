<script setup>
import IntonationChecker from './components/IntonationChecker.vue';
import { createWorkerVerovioToolkit } from 'vue-verovio-canvas';
import createVerovioWorker from './verovio-worker.js?worker';
const toolkit = createWorkerVerovioToolkit(createVerovioWorker());
</script>

<template>
    <IntonationChecker
        :toolkit="toolkit"
        score-url="Beethoven op 74_2 T24-49.mei"
        title="Beethoven Op. 74, 2. Satz, Takt 24-49"
        description="Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua."
    />
</template>
