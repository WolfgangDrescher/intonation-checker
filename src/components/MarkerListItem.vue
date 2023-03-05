<script setup>
import { useMarkersStore } from '../stores/markers.js';
import FormButton from './FormButton.vue';
import ButtonGroup from './ButtonGroup.vue';
import { Icon } from '@iconify/vue';

const props = defineProps({
    marker: Object,
});

const emit = defineEmits(['audioSeek', 'audioSeekFactor']);

const store = useMarkersStore();

function playAudioListener() {
    if (props.marker.time) {
        emit('audioSeek', props.marker.time);
    } else if (props.marker.seekFactor) {
        emit('audioSeekFactor', props.marker.seekFactor);
    }
}

function remove() {
    store.removeSelectedMarker(props.marker.noteIds);
}

function startHighlight() {
    document.querySelectorAll(`.scoremarker-${props.marker.id}`).forEach((elem) => elem.classList.add('highlight'));
}

function endHighlight() {
    document.querySelectorAll(`.scoremarker-${props.marker.id}`).forEach((elem) => elem.classList.remove('highlight'));
}
</script>

<template>
    <div
        class="marker-list-item"
        :class="marker.validated ? (marker.isCorrect ? 'is-correct' : 'is-not-correct') : ''"
    >
        <div class="marker-list-item-content">
            <div class="marker-list-item-content-container">
                <code
                    class="marker-list-item-content-container-id"
                    @mouseenter="startHighlight"
                    @mouseleave="endHighlight"
                    >{{ `#${marker.id}` }}</code
                >
                <div>{{ marker.comment }}</div>
            </div>
        </div>
        <ButtonGroup class="marker-list-item-button-group">
            <FormButton @click="playAudioListener">
                <Icon icon="heroicons-solid:play" />
            </FormButton>
            <FormButton @click="remove">
                <Icon icon="heroicons-solid:x-mark" />
            </FormButton>
        </ButtonGroup>
    </div>
</template>

<style scoped>
.marker-list-item {
    @apply p-3 border border-gray-100 shadow rounded flex items-center;
}

.marker-list-item.is-correct {
    @apply bg-green-100;
}

.marker-list-item.is-not-correct {
    @apply bg-red-100;
}

.marker-list-item-content {
    @apply flex-grow;
}

.marker-list-item-content-container {
    @apply flex gap-2;
}

.marker-list-item-content-container-id {
    @apply cursor-pointer bg-[rgba(175,184,193,0.2)] rounded-md text-[80%] m-0 px-[.4em] py-[.2em];
}

.marker-list-item-button-group {
    @apply text-2xl;
}
</style>
