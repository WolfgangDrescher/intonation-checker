<script setup>
import MarkerListItem from './MarkerListItem.vue';
import { useMarkersStore } from '../stores/markers.js';
import { useI18n } from '../utils/i18n.js';
import { inject } from 'vue';

const { $t } = useI18n(inject('locale'));

defineProps(['showMarkers']);

const emit = defineEmits(['audioSeek', 'audioSeekFactor']);

const store = useMarkersStore();
</script>

<template>
    <div>
        <div class="marker-list-counter">
            {{ $t('nOfm', [store.selectedMarkers.length, store.markers.length]) }}
        </div>
        <div class="marker-list-container">
            <template v-if="store.selectedMarkers.length">
                <MarkerListItem v-for="marker in store.sortedSelectedMarkers" :key="marker.noteIds.join()" :marker="marker" @audioSeek="emit('audioSeek', $event)" @audioSeekFactor="emit('audioSeekFactor', $event)" />
            </template>
            <template v-if="showMarkers && store.missingMarkers.length">
                <MarkerListItem v-for="marker in store.missingMarkers" :key="marker.noteIds.join()" :marker="marker" @audioSeek="emit('audioSeek', $event)" @audioSeekFactor="emit('audioSeekFactor', $event)" />
            </template>
            <div class="marker-list-info-text" v-if="(!store.selectedMarkers.length && !showMarkers) || (showMarkers && !store.missingMarkers.length)">
                {{ $t('noMarkersSelectedText') }}
            </div>
        </div>
    </div>
</template>

<style scoped>
.marker-list-counter {
    @apply mb-4 text-center text-sm text-gray-500;
}

.marker-list-container {
    @apply flex flex-col gap-4;
}

.marker-list-info-text {
    @apply text-center text-sm text-gray-500 px-8;
}
</style>
