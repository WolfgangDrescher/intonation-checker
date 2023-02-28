<script setup>
import Button from './Button.vue';
import { Icon } from '@iconify/vue';

defineProps({
    marker: Object,
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
    <div class="p-3 border shadow rounded">
        {{ marker }}
        <Button @click="playAudioListener">
            <Icon icon="heroicons-solid:play" width="1.5rem" />
        </Button>
    </div>
</template>
