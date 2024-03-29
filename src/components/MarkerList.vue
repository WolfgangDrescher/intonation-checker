<script setup>
import MarkerListItem from './MarkerListItem.vue';
import { useI18n } from '../utils/i18n.js';
import { inject } from 'vue';

const { $t } = useI18n(inject('locale'));

defineProps(['showMarkers']);

const emit = defineEmits(['audioSeek', 'audioSeekFactor']);

const {
    sortedSelectedSliceMarkers,
    sortedSelectedMarkers,
    countSelectedSliceMarkers,
    countSelectedMarkers,
    countSelectedMarkersForMode,
    countMarkers,
    countMissingMarkers,
    missingMarkers,
    mode,
} = inject('markersStore');
</script>

<template>
    <div>
        <div class="marker-list-counter">
            {{ $t('nOfm', [countSelectedMarkersForMode, countMarkers]) }}
        </div>
        <div class="marker-list-container">
            <template v-if="countSelectedSliceMarkers && mode === 'slice'">
                <MarkerListItem v-for="marker in sortedSelectedSliceMarkers" :key="marker.simultaneousNoteIds.join()" :marker="marker" @audioSeek="emit('audioSeek', $event)" @audioSeekFactor="emit('audioSeekFactor', $event)" />
            </template>
            <template v-if="countSelectedMarkers && mode === 'note'">
                <MarkerListItem v-for="marker in sortedSelectedMarkers" :key="marker.noteIds.join()" :marker="marker" @audioSeek="emit('audioSeek', $event)" @audioSeekFactor="emit('audioSeekFactor', $event)" />
            </template>
            <template v-if="showMarkers && countMissingMarkers">
                <MarkerListItem v-for="marker in missingMarkers" :key="marker.noteIds.join()" :marker="marker" @audioSeek="emit('audioSeek', $event)" @audioSeekFactor="emit('audioSeekFactor', $event)" />
            </template>
            <div class="marker-list-info-text" v-if="(!countSelectedMarkersForMode && !showMarkers) || (showMarkers && !countMissingMarkers)">
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
