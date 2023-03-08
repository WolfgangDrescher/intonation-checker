<script setup>
import AudioPlayer from './AudioPlayer.vue';
import MarkerList from './MarkerList.vue';
import ScoreContainer from './ScoreContainer.vue';
import ButtonGroup from './ButtonGroup.vue';
import FormButton from './FormButton.vue';
import { useMarkersStore } from '../stores/markers.js';
import { ref, provide } from 'vue';
import { Marker } from '../utils/marker.js';
import { useI18n } from '../utils/i18n.js';
import { onKeyStroke } from '@vueuse/core';

const props = defineProps({
    toolkit: Object,
    scoreUrl: String,
    correctAudioUrl: String,
    wrongAudioUrl: String,
    title: String,
    description: String,
    markers: Array,
    locale: String,
});

const { $t } = useI18n(props.locale);

const store = useMarkersStore();
store.setMarkers(props.markers.map((m) => new Marker(m)));

const correctAudioPlayerElem = ref();
const wrongAudioPlayerElem = ref();
const showMarkers = ref(false);
const displayShowMarkersButton = ref(false);
const colMode = ref('right');

function checkSelectedMarkers() {
    store.validateSelectedMarkers();
    if (store.selectedMarkers.value.length >= store.markers.value.length) {
        displayShowMarkersButton.value = true;
    }
}

function showMissingMarkers() {
    store.validateSelectedMarkers();
    showMarkers.value = !showMarkers.value;
}

onKeyStroke('.', (e) => {
    e.preventDefault();
    store.validateSelectedMarkers();
    showMarkers.value = !showMarkers.value;
    displayShowMarkersButton.value = true;
});

provide('locale', props.locale);
provide('markersStore', store);
</script>

<template>
    <div class="intonation-checker" :class="`col-mode-${colMode}`">
        <div class="wrapper">
            <div class="score-col">
                <ScoreContainer
                    :toolkit="toolkit"
                    :url="scoreUrl"
                    :show-markers="showMarkers"
                    @update:col-mode="colMode = $event"
                />
            </div>
            <div class="sidebar-col">
                <div class="header-section">
                    <div class="title">
                        {{ title }}
                    </div>
                    <p v-if="description" class="description">
                        {{ description }}
                    </p>
                </div>
                <div class="audio-player-container">
                    <div class="audio-player-label">{{ $t('correct') }}</div>
                    <div class="audio-player-wrapper">
                        <AudioPlayer ref="correctAudioPlayerElem" :url="correctAudioUrl"></AudioPlayer>
                    </div>
                </div>
                <div class="audio-player-container">
                    <div class="audio-player-label">{{ $t('wrong') }}</div>
                    <div class="audio-player-wrapper">
                        <AudioPlayer ref="wrongAudioPlayerElem" :url="wrongAudioUrl"></AudioPlayer>
                    </div>
                </div>
                <div class="marker-list">
                    <MarkerList
                        :show-markers="showMarkers"
                        @audioSeek="$refs.wrongAudioPlayerElem.seekTo($event)"
                        @audioSeekFactor="$refs.wrongAudioPlayerElem.seekToFactor($event)"
                    />
                </div>
                <div class="footer-section">
                    <ButtonGroup>
                        <FormButton @click="checkSelectedMarkers">{{ $t('check') }}</FormButton>
                        <FormButton
                            v-if="displayShowMarkersButton"
                            @click="showMissingMarkers"
                            >{{ $t('showMissingMarkers') }}</FormButton
                        >
                    </ButtonGroup>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.intonation-checker {
    @apply border;
}

.wrapper {
    @apply overflow-hidden;
}

.score-col {
    @apply flex-grow min-w-0;
}

.intonation-checker.col-mode-left .score-col {
    @apply flex-grow-0 flex-shrink-0;
}

.sidebar-col {
    @apply flex flex-col;
}

.intonation-checker.col-mode-center .sidebar-col,
.intonation-checker.col-mode-right .sidebar-col {
    @apply flex-grow-0 flex-shrink-0;
}

.header-section {
    @apply p-4 bg-gray-100 border-b;
}

.title {
    @apply text-xl font-bold;
}

.description {
    @apply mt-2 mb-0;
}

.audio-player-container {
    @apply p-2 bg-gray-50 border-b flex items-center gap-2;
}

.audio-player-label {
    @apply w-12;
}

.audio-player-wrapper {
    @apply flex-grow;
}

.marker-list {
    @apply p-4 min-h-0 overflow-y-auto;
}

.footer-section {
    @apply p-4 mt-auto bg-gray-50 border-t;
}

@screen lg {
    .intonation-checker {
        @apply  h-full;
    }

    .wrapper {
        @apply h-full flex;
    }

    .sidebar-col {
        @apply border-l;
    }

    .intonation-checker.col-mode-left .score-col {
        @apply w-[500px];
    }

    .intonation-checker.col-mode-left .sidebar-col {
        @apply flex-grow;
    }

    .intonation-checker.col-mode-center .sidebar-col {
        @apply w-1/2;
    }

    .intonation-checker.col-mode-right .sidebar-col {
        @apply w-[500px];
    }
}
</style>
