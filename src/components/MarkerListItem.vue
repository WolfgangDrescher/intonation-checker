<script setup>
import { useMarkersStore } from '../stores/markers.js';
import { storeToRefs } from 'pinia';
import { computed } from 'vue';
import Button from './Button.vue';
import { Icon } from '@iconify/vue';

const props = defineProps({
    marker: Object,
});

const emit = defineEmits(['audioSeek', 'audioSeekFactor']);

const store = useMarkersStore();
const { markers } = storeToRefs(store);

const isCorrect = computed(() => {
    return markers.value.reduce((accumulator, item) => {
        accumulator.push(...item.noteIds);
        return accumulator;
    }, []).some(id => props.marker.noteIds.includes(id));
});

function playAudioListener()  {
    if (props.marker.time) {
        emit('audioSeek', props.marker.time);
    } else if (props.marker.seekFactor) {
        emit('audioSeekFactor', props.marker.seekFactor);
    }
}
</script>

<template>
    <div class="p-3 border shadow rounded" :class="isCorrect ? 'bg-green-300' : 'bg-red-300'">
        {{ marker }}
        <Button @click="playAudioListener">
            <Icon icon="heroicons-solid:play" width="1.5rem" />
        </Button>
    </div>
</template>
