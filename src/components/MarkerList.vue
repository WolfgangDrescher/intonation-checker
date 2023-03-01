<script setup>
import MarkerListItem from './MarkerListItem.vue';
import { useMarkersStore } from '../stores/markers.js';

const emit = defineEmits(['audioSeek', 'audioSeekFactor']);

const store = useMarkersStore();
</script>

<template>
    <div>
        <div class="mb-4 text-center text-sm text-gray-500">
            {{ store.selectedMarkers.length }} von {{ store.markersNoteCount }}
        </div>
        <div class="flex flex-col gap-4">
            <template v-if="store.selectedMarkers.length">
                <MarkerListItem
                    v-for="marker in store.selectedMarkers"
                    :key="marker.noteIds.join()"
                    :marker="marker"
                    @audioSeek="emit('audioSeek', $event)"
                    @audioSeekFactor="emit('audioSeekFactor', $event)"
                />
            </template>
            <div v-else class="text-center text-sm text-gray-500 px-8">
                Klicken Sie in der Partitur auf der linken Seite auf die Notenköpfe der Töne die falsch intoniert sind.
            </div>
        </div>
    </div>
</template>
