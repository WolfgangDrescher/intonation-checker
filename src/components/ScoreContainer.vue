<script setup>
import 'vue-verovio-canvas/style.css';
import { VerovioCanvas } from 'vue-verovio-canvas';
import { useMarkersStore } from '../stores/markers.js';
import { storeToRefs } from 'pinia';

const props = defineProps({
    toolkit: Object,
    url: String,
});

const store = useMarkersStore();

const { markers } = storeToRefs(store);

function getParents(node) {
    return (node.parentElement ? getParents(node.parentElement) : []).concat([node]);
}

let timemap = [];

function getTimeForElement(id) {
    return timemap.find(item => item.on.includes(id)).tstamp;
}
function getDuration() {
    return timemap.at(-1)?.tstamp;
}

function getSeekFactor(id) {
    return (getTimeForElement(id) / getDuration()) || 0;
}

function getTimeForElementFromMarkers(id) {
    const foundMarker = markers.value.find(m => m.noteIds.includes(id))
    if (foundMarker)  {
        return foundMarker.time;
    }
}

async function scoreClickHandler(event) {
    const nodes = getParents(event.target).reverse();
    const noteElem = nodes.find(node => node.nodeName === 'g' && [...node.classList].some(className => className === 'note'));
    if (noteElem) {
        if (timemap.length === 0) {
            timemap = await props.toolkit.renderToTimemap();
        }
        store.addSelectedMarker({
            noteIds: [noteElem.id],
            seekFactor: getSeekFactor(noteElem.id),
            time: getTimeForElementFromMarkers(noteElem.id),
        });
    }
}
</script>

<template>
    <div @click="scoreClickHandler">
        <VerovioCanvas :toolkit="toolkit" :url="url" :pageMargin="50" />
    </div>
</template>
