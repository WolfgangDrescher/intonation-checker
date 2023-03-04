<script setup>
import 'vue-verovio-canvas/style.css';
import { VerovioCanvas } from 'vue-verovio-canvas';
import { useMarkersStore } from '../stores/markers.js';
import { ref, onMounted, onUnmounted, watch } from 'vue';
import ScoreMarker from './ScoreMarker.vue';
import { createSelectedMarker } from '../utils/marker.js';
import FormButton from './FormButton.vue';
import ButtonGroup from './ButtonGroup.vue';
import { Icon } from '@iconify/vue';
import { useDebounceFn } from '@vueuse/core';

const props = defineProps({
    toolkit: Object,
    url: String,
    showMarkers: Boolean,
});

const emit = defineEmits(['update:colMode']);

const store = useMarkersStore();

function getParents(node) {
    return (node.parentElement ? getParents(node.parentElement) : []).concat([node]);
}

let timemap = [];

function getTimeForElement(id) {
    return timemap.find((item) => item.on.includes(id)).tstamp;
}
function getDuration() {
    return timemap.at(-1)?.tstamp;
}

function getSeekFactor(id) {
    return getTimeForElement(id) / getDuration() || 0;
}

function getTimeForElementFromMarkers(id) {
    const foundMarker = store.markers.find((m) => m.noteIds.includes(id));
    if (foundMarker) {
        return foundMarker.time;
    }
}

async function scoreClickHandler(event) {
    const nodes = getParents(event.target).reverse();
    const noteElem = nodes.find(
        (node) => node.nodeName === 'g' && [...node.classList].some((className) => className === 'note')
    );
    if (noteElem) {
        if (timemap.length === 0) {
            timemap = await props.toolkit.renderToTimemap();
        }
        if (store.getSelectedMarkerById(noteElem.id)) {
            store.removeSelectedMarker(noteElem.id);
        } else {
            store.addSelectedMarker(
                createSelectedMarker(
                    {
                        noteIds: [noteElem.id],
                        seekFactor: getSeekFactor(noteElem.id),
                        time: getTimeForElementFromMarkers(noteElem.id),
                    },
                    store.markers
                )
            );
        }
    }
}

const scoreContainer = ref(null);
const markerContainer = ref(null);
const verovioElem = ref();
const scale = ref(40);
const verovioIsLoading = ref(true);

function setScale(value) {
    scale.value = Math.max(Math.min(60, value), 20);
}

function mutationObserverEvent() {
    store.updateMarkers();
}

const mutationObserver = new MutationObserver(mutationObserverEvent);

onMounted(() => {
    mutationObserver.observe(scoreContainer.value, {
        attributes: true,
        childList: true,
        subtree: true,
    });
});

onUnmounted(() => {
    mutationObserver.disconnect();
});

function getElementById(id) {
    const elem = document.getElementById(id);
    return elem.querySelector('.notehead') || elem;
}

const debouncedIsLoading = useDebounceFn((value) => {
    verovioIsLoading.value = value;
}, 50);


watch(() => verovioElem.value?.isLoading, (value) => {
    debouncedIsLoading(value);
});
</script>

<template>
    <div class="flex flex-col h-full">
        <div class="p-4 bg-gray-100 border-b flex items-center gap-4">
            <ButtonGroup class="text-2xl">
                <FormButton @click="setScale(scale + 5)">
                    <Icon icon="bi:zoom-in" />
                </FormButton>
                <FormButton @click="setScale(scale - 5)">
                    <Icon icon="bi:zoom-out" />
                </FormButton>
            </ButtonGroup>
            <div>
                <Icon v-if="verovioIsLoading" icon="bi:arrow-repeat" class="spin" />
            </div>
            <div class="ml-auto hidden lg:block">
                <ButtonGroup class="text-2xl">
                    <FormButton @click="emit('update:colMode', 'left')">
                        <Icon icon="bi:layout-sidebar-inset" />
                    </FormButton>
                    <FormButton @click="emit('update:colMode', 'center')">
                        <Icon icon="bi:square-half" />
                    </FormButton>
                    <FormButton @click="emit('update:colMode', 'right')">
                        <Icon icon="bi:layout-sidebar-inset-reverse" />
                    </FormButton>
                </ButtonGroup>
            </div>
        </div>
        <div class="flex-grow lg:h-0">
            <div class="relative h-full overflow-y-auto">
                <div ref="scoreContainer" class="min-h-full" @click="scoreClickHandler">
                    <VerovioCanvas ref="verovioElem" :toolkit="toolkit" :url="url" :scale="scale" :pageMargin="50" :options="{mnumInterval: 1}" />
                </div>
                <div class="absolute w-full h-full left-0 top-0 pointer-events-none" ref="markerContainer">
                    <template v-for="marker in store.selectedMarkers" :key="marker.id">
                        <ScoreMarker
                            v-for="id in marker.noteIds"
                            :key="`${id}${marker.timestamp}`"
                            :marker="marker"
                            :elem="getElementById(id)"
                            :parent="markerContainer"
                        />
                    </template>
                    <template v-if="showMarkers">
                        <template v-for="marker in store.missingMarkers" :key="marker.id">
                            <ScoreMarker
                                v-for="id in marker.noteIds"
                                :key="`${id}${marker.timestamp}`"
                                :marker="marker"
                                :elem="getElementById(id)"
                                :parent="markerContainer"
                            />
                        </template>
                    </template>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
:deep(g.note) {
    @apply cursor-pointer;
}

.spin {
    animation-name: spin;
    animation-duration: 2000ms;
    animation-iteration-count: infinite;
    animation-timing-function: linear;
}
@keyframes spin {
    from {
        transform: rotate(0deg);
    }
    to {
        transform: rotate(360deg);
    }
}
</style>
