<script setup>
import 'vue-verovio-canvas/style.css';
import { VerovioCanvas } from 'vue-verovio-canvas';
import { ref, onMounted, nextTick, watch, inject } from 'vue';
import ScoreMarker from './ScoreMarker.vue';
import { createSelectedMarker, createSelectedSliceMarker, getSimultaneousNoteIds } from '../utils/marker.js';
import FormButton from './FormButton.vue';
import ButtonGroup from './ButtonGroup.vue';
import { Icon } from '@iconify/vue';
import { useDebounceFn } from '@vueuse/core';
import { useI18n } from '../utils/i18n.js';
import { getBBoxElem, selectBBoxElem } from '../utils/bbox.js';

const props = defineProps({
    toolkit: Object,
    url: String,
    showMarkers: Boolean,
});

const emit = defineEmits(['update:colMode']);

const {
    markers,
    mode: selectMarkerMode,
    getSelectedMarkerById,
    removeSelectedMarker,
    addSelectedSliceMarker,
    addSelectedMarker,
    updateMarkers,
    selectedSliceMarkers,
    selectedMarkers,
    missingMarkers,
    getNextMarkerIndex,
} = inject('markersStore');

const {
    isReady: scoreIsReady,
} = inject('scoreStore');

const { $t } = useI18n(inject('locale'));

let timemap = [];

function getTimeForElement(id) {
    return timemap.find((item) => item.on?.includes(id))?.tstamp;
}
function getDuration() {
    return timemap.at(-1)?.tstamp;
}

function getSeekFactor(id) {
    return getTimeForElement(id) / getDuration() || 0;
}

function getTimeForElementFromMarkers(id) {
    const foundMarker = markers.value.find((m) => m.noteIds.includes(id));
    if (foundMarker) {
        return foundMarker.time;
    }
}

async function onClickVerovioCanvas(event, noteElem) {
    if (timemap.length === 0) {
        timemap = await props.toolkit.renderToTimemap();
    }
    if (getSelectedMarkerById(noteElem.id)) {
        removeSelectedMarker(noteElem.id);
    } else {
        const index = getNextMarkerIndex();
        const readableId = String.fromCharCode((index < 26 ? 65 : 97 - 26) + index);
        if (selectMarkerMode.value === 'slice') {
            const simultaneousNoteIds = await getSimultaneousNoteIds(props.toolkit, scoreIsReady.promise, noteElem.id);
            addSelectedSliceMarker(
                createSelectedSliceMarker(
                    {
                        noteIds: [noteElem.id],
                        seekFactor: getSeekFactor(noteElem.id),
                        time: getTimeForElementFromMarkers(noteElem.id),
                    },
                    markers.value,
                    readableId,
                    simultaneousNoteIds
                )
            );
        } else {
            addSelectedMarker(
                createSelectedMarker(
                    {
                        noteIds: [noteElem.id],
                        seekFactor: getSeekFactor(noteElem.id),
                        time: getTimeForElementFromMarkers(noteElem.id),
                    },
                    markers.value,
                    readableId
                )
            );
        }
    }
}

function onTouchVerovioCanvas(event, target) {
    event.preventDefault();
    onClickVerovioCanvas(event, target);
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
    updateMarkers();
    markerContainer.value.querySelectorAll('.note-bounding-box').forEach((elem) => elem.remove());
    scoreContainer.value.querySelectorAll('g.note:not(.bounding-box), g.rest:not(.bounding-box), g.mRest:not(.bounding-box)').forEach((elem) => {
        const noteheadRect = getBBoxElem(elem)?.getBoundingClientRect();
        const stemRect = selectBBoxElem(elem, '.stem')?.getBoundingClientRect();
        const flagRect = selectBBoxElem(elem, '.flag')?.getBoundingClientRect();
        const dotsRect = selectBBoxElem(elem, '.dots')?.getBoundingClientRect();
        const accidRect = elem.querySelector('.accid use') && selectBBoxElem(elem, '.accid')?.getBoundingClientRect();
        const rect = elem.getBoundingClientRect();

        let left = Infinity;
        let right = -Infinity;
        let top = Infinity;
        let bottom = -Infinity;
        
        if (noteheadRect) {
            left = Math.min(left, noteheadRect.left);
            right = Math.max(right, noteheadRect.right);
            top = Math.min(top, noteheadRect.top);
            bottom = Math.max(bottom, noteheadRect.bottom);
        }
        if (stemRect) {
            left = Math.min(left, stemRect.left);
            right = Math.max(right, stemRect.right);
            top = Math.min(top, stemRect.top);
            bottom = Math.max(bottom, stemRect.bottom);
        }
        if (flagRect) {
            left = Math.min(left, flagRect.left);
            right = Math.max(right, flagRect.right);
            top = Math.min(top, flagRect.top);
            bottom = Math.max(bottom, flagRect.bottom);
        }
        if (accidRect) {
            left = Math.min(left, accidRect.left);
            right = Math.max(right, accidRect.right);
            top = Math.min(top, accidRect.top);
            bottom = Math.max(bottom, accidRect.bottom);
        }
        if (dotsRect) {
            left = Math.min(left, dotsRect.left);
            right = Math.max(right, dotsRect.right);
            top = Math.min(top, dotsRect.top);
            bottom = Math.max(bottom, dotsRect.bottom);
        }

        left = left === Infinity ? rect.left : left;
        right = right === -Infinity ? rect.right : right; 
        top = top === Infinity ? rect.top : top; 
        bottom = bottom === -Infinity ? rect.bottom : bottom; 

        const sizeExtender = 5;
        const width = right - left + sizeExtender;
        const height = bottom - top + sizeExtender;

        const parentRect = scoreContainer.value.getBoundingClientRect();
        const div = document.createElement('div');
        div.classList.add('note-bounding-box');
        div.style.position = 'absolute';
        div.style.width = `${width}px`;
        div.style.height = `${height}px`;
        div.style.left = `${left - parentRect.left - sizeExtender / 2}px`;
        div.style.top = `${top - parentRect.top - sizeExtender / 2}px`;
        div.style.cursor = 'pointer';
        div.style.pointerEvents = 'auto';
        div.style.zIndex = 1;
        div.addEventListener('mouseenter', () => elem.classList.add('hover'));
        div.addEventListener('mouseleave', () => elem.classList.remove('hover'));
        div.addEventListener('click', (event) => onClickVerovioCanvas(event, elem));
        div.addEventListener('touchend', (event) => onTouchVerovioCanvas(event, elem));
        markerContainer.value.appendChild(div);
    });
}

onMounted(() => {
    nextTick(() => {
        const mutationObserver = new MutationObserver(mutationObserverEvent);
        if (scoreContainer.value) {
            mutationObserver.observe(scoreContainer.value, {
                // attributes: true,
                childList: true,
                subtree: true,
            });
        }
    });
});

function getElementById(id) {
    return getBBoxElem(document.getElementById(id));
}

const debouncedIsLoading = useDebounceFn((value) => {
    verovioIsLoading.value = value;
}, 50);

watch(
    () => verovioElem.value?.isLoading,
    (value) => {
        debouncedIsLoading(value);
    }
);

function onScoreIsReady() {
    scoreIsReady.resolve();
}
</script>

<template>
    <div class="score-container">
        <div class="toolbar">
            <ButtonGroup class="button-group-icon-size">
                <FormButton @click="setScale(scale + 5)">
                    <Icon icon="bi:zoom-in" />
                </FormButton>
                <FormButton @click="setScale(scale - 5)">
                    <Icon icon="bi:zoom-out" />
                </FormButton>
            </ButtonGroup>
            <div>
                <Icon icon="bi:arrow-repeat" class="loading-icon spin" :class="{loading: verovioIsLoading}" />
            </div>
            <div class="marker-mode-controls">
                <ButtonGroup>
                    <FormButton @click="selectMarkerMode = 'slice'" :active="selectMarkerMode === 'slice'">
                        {{ $t('selectSlices') }}
                    </FormButton>
                    <FormButton @click="selectMarkerMode = 'note'" :active="selectMarkerMode === 'note'">
                        {{ $t('selectNotes') }}
                    </FormButton>
                </ButtonGroup>
            </div>
            <div class="col-mode-controls">
                <ButtonGroup class="button-group-icon-size">
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
        <div class="score-wrapper">
            <div class="score-inner-wrapper">
                <div ref="scoreContainer" class="score-inner-wrapper-container">
                    <VerovioCanvas
                        ref="verovioElem"
                        :toolkit="toolkit"
                        :url="url"
                        :scale="scale"
                        :pageMargin="50"
                        :options="{ mnumInterval: 1, spacingSystem: 15, svgBoundingBoxes: true, }"
                        @score-is-ready="onScoreIsReady"
                    />
                </div>
                <div class="marker-container" ref="markerContainer">
                    <template v-for="marker in selectedSliceMarkers" :key="marker.id">
                        <ScoreMarker
                            v-for="id in marker.noteIds"
                            :key="marker.timestamp"
                            :marker="marker"
                            :elem="getElementById(id)"
                            :parent="markerContainer"
                        />
                    </template>
                    <template v-for="marker in selectedMarkers" :key="marker.id">
                        <ScoreMarker
                            v-for="id in marker.noteIds"
                            :key="`${id}${marker.timestamp}`"
                            :marker="marker"
                            :elem="getElementById(id)"
                            :parent="markerContainer"
                        />
                    </template>
                    <template v-if="showMarkers">
                        <template v-for="marker in missingMarkers" :key="marker.id">
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
.score-container {
    @apply flex flex-col h-full;
}

.toolbar {
    @apply p-4 bg-gray-100 border-b flex items-center gap-4;
}

.button-group-icon-size {
    @apply text-2xl;
}

.marker-mode-controls {
    @apply my-auto flex-grow flex justify-center items-center;
}

.col-mode-controls {
    @apply ml-auto hidden;
}

.score-wrapper {
    @apply flex-grow lg:h-0;
}

.score-inner-wrapper {
    @apply relative h-full overflow-y-auto overflow-x-hidden;
}

.score-inner-wrapper-container {
    @apply min-h-full;
}

.marker-container {
    @apply absolute w-full h-full left-0 top-0 pointer-events-none;
}

@screen lg {
    .col-mode-controls {
        @apply block;
    }

    .score-wrapper {
        @apply h-0;
    }
}


:deep(g.note) {
    @apply cursor-pointer;
}

.loading-icon {
    @apply invisible;
}

.loading-icon.loading {
    @apply visible;
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
