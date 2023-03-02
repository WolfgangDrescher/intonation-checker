<script setup>
import { useMarkersStore } from '../stores/markers.js';
import FormButton from './FormButton.vue';
import ButtonGroup from './ButtonGroup.vue';
import { Icon } from '@iconify/vue';
import { SelectedMarker } from '../utils/marker';

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
        class="p-3 border shadow rounded flex items-center"
        :class="marker.validated ? (marker.isCorrect ? 'bg-green-100' : 'bg-red-100') : ''"
    >
        <div class="flex-grow">
            <div class="flex">
                <code
                    class="cursor-pointer bg-[rgba(175,184,193,0.2)] rounded-md text-[80%] m-0 px-[.4em] py-[.2em]"
                    @mouseenter="startHighlight"
                    @mouseleave="endHighlight"
                    >{{ `#${marker.id}` }}</code
                >
                <div>{{ marker.comment }}</div>
            </div>
        </div>
        <ButtonGroup>
            <FormButton @click="playAudioListener">
                <Icon icon="heroicons-solid:play" width="1.5rem" />
            </FormButton>
            <FormButton v-if="marker instanceof SelectedMarker && (marker.validated && !marker.isCorrect || !marker.validated)" @click="remove">
                <Icon icon="heroicons-solid:x-mark" width="1.5rem" />
            </FormButton>
        </ButtonGroup>
    </div>
</template>
