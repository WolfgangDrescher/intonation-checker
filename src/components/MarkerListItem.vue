<script setup>
import FormButton from './FormButton.vue';
import ButtonGroup from './ButtonGroup.vue';
import { Icon } from '@iconify/vue';
import { inject } from 'vue';
import { SelectedMarker, SelectedSliceMarker } from '../utils/marker.js';
import { useI18n } from '../utils/i18n.js';

const props = defineProps({
    marker: Object,
});

const emit = defineEmits(['audioSeek', 'audioSeekFactor']);

const { removeSelectedMarker, removeSelectedSliceMarker } = inject('markersStore');

const { $t } = useI18n(inject('locale'));

function playAudioListener() {
    if (typeof props.marker.time !== 'undefined') {
        emit('audioSeek', Math.max(0, props.marker.time - 2));
    } else if (typeof props.marker.seekFactor !== 'undefined') {
        // 0.016 = 1% of 60s
        emit('audioSeekFactor', Math.max(0, props.marker.seekFactor - 0.016 * 2));
    }
}

function remove() {
    if (props.marker instanceof SelectedSliceMarker) {
        removeSelectedSliceMarker(props.marker.noteIds);
    } else if (props.marker instanceof SelectedMarker) {
        removeSelectedMarker(props.marker.noteIds);
    }
}

function startHighlight() {
    document.querySelectorAll(`.scoremarker-${props.marker.getId('')}`).forEach((elem) => elem.classList.add('highlight'));
}

function endHighlight() {
    document.querySelectorAll(`.scoremarker-${props.marker.getId('')}`).forEach((elem) => elem.classList.remove('highlight'));
}

function copyNoteId() {
    if (!navigator.clipboard) {
        return;
    }
    navigator.clipboard.writeText(props.marker.id).then(() => {
    }, function (err) {
        console.error(`Could not copy text: ${err}`);
    });
}
</script>

<template>
    <div
        class="marker-list-item"
        :class="marker.validated ? (marker.isCorrect ? 'is-correct' : 'is-not-correct') : ''"
        @mouseenter="startHighlight"
        @mouseleave="endHighlight"
    >
        <div class="marker-list-item-content">
            <div class="marker-list-item-content-container">
                <div class="marker-list-item-content-container-id">{{ marker.readableId }}</div>
                <div class="marker-list-item-content-container-comment">{{ marker.comment }}</div>
                <code class="marker-list-item-content-container-note-id" @click="copyNoteId">{{ `#${marker.id}` }}</code>
                <div class="marker-list-item-content-container-meta">
                    <div v-if="marker.measure">{{ $t('markerMeasure', [marker.measure]) }}</div>
                    <div v-if="marker.time || marker.time === 0">{{ $t('markerTime', [parseFloat(marker.time ?? 0).toFixed(1)]) }}</div>
                </div>
            </div>
        </div>
        <ButtonGroup class="marker-list-item-button-group">
            <FormButton @click="playAudioListener" v-if="typeof marker.seekFactor !== 'undefined' || typeof marker.time !== 'undefined'">
                <Icon icon="heroicons:play-solid" />
            </FormButton>
            <FormButton @click="remove" v-if="marker instanceof SelectedSliceMarker || marker instanceof SelectedMarker">
                <Icon icon="heroicons:x-mark-solid" />
            </FormButton>
        </ButtonGroup>
    </div>
</template>

<style scoped>
.marker-list-item {
    @apply p-3 border border-gray-100 shadow rounded flex items-center gap-2;
}

.marker-list-item.is-correct {
    @apply bg-green-100 border-green-200;
}

.marker-list-item.is-not-correct {
    @apply bg-red-100 border-red-200;
}

.marker-list-item-content {
    @apply flex-grow;
}

.marker-list-item-content-container {
    @apply flex gap-2 items-center;
}

.marker-list-item .marker-list-item-content-container-note-id {
    @apply cursor-pointer bg-[rgba(175,184,193,0.2)] rounded-md text-[80%] m-0 px-[.4em] py-[.2em] hidden max-w-[5.5rem] overflow-ellipsis overflow-hidden whitespace-nowrap;
}

.marker-list-item .marker-list-item-content-container-note-id:hover {
    @apply bg-[rgba(175,184,193,0.5)];
}

.marker-list-item-content-container-comment {
    @apply grow;
}

.marker-list-item-content-container-meta {
    @apply text-xs text-right;
}

.marker-list-item:hover .marker-list-item-content-container-note-id {
    @apply block;
}

.marker-list-item-content-container-id {
    @apply text-xl font-bold m-0 px-[.4em] py-[.2em];
}

.marker-list-item-button-group {
    @apply text-2xl;
}
</style>
