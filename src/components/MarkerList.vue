<script setup>
import MarkerListItem from './MarkerListItem.vue';
import { useMarkersStore } from '../stores/markers.js';

const emit = defineEmits(['audioSeek', 'audioSeekFactor']);

const store = useMarkersStore();
</script>

<template>
    <div>
        <div class="mb-4 text-center text-sm text-gray-500">
            {{ store.selectedMarkers.length }} von {{ store.markers.length }}
        </div>
        <div class="flex flex-col gap-4">
            <MarkerListItem
                v-for="marker in store.selectedMarkers"
                :key="marker.noteIds.join()"
                :marker="marker"
                @audioSeek="emit('audioSeek', $event)"
                @audioSeekFactor="emit('audioSeekFactor', $event)"
            />
        </div>
    </div>
</template>
