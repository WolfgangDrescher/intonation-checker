<script setup>
import IntonationChecker from './components/IntonationChecker.vue';
import { createWorkerVerovioToolkit } from 'vue-verovio-canvas';
import createVerovioWorker from './verovio-worker.js?worker';
const toolkit = createWorkerVerovioToolkit(createVerovioWorker());
</script>

<template>
    <IntonationChecker
        :toolkit="toolkit"
        url="/example.json"
        locale="de"
    />
</template>

<style>
body,
html,
#app {
    width: 100%;
    height: 100%;
}
</style>
