<script setup>
import MarkerListItem from './MarkerListItem.vue';
import { useMarkersStore } from '../stores/markers.js';
import { storeToRefs } from 'pinia';

const emit = defineEmits(['audioSeek', 'audioSeekFactor']);

const store = useMarkersStore();
const { selectedMarkers, markers } = storeToRefs(store);
</script>

<template>
    <div>
        <div class="mb-4">
            {{ selectedMarkers.length }} von {{ markers.length }}
        </div>
        <div class="flex flex-col gap-4">
            <MarkerListItem
                v-for="marker in selectedMarkers"
                :key="marker.noteIds.join()"
                :marker="marker"
                @audioSeek="emit('audioSeek', $event)"
                @audioSeekFactor="emit('audioSeekFactor', $event)"
            />
        </div>
    </div>
</template>
