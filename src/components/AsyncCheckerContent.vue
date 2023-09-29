<script setup>
import { ofetch } from 'ofetch';
import AudioPlayer from './AudioPlayer.vue';
import MarkerList from './MarkerList.vue';
import ScoreContainer from './ScoreContainer.vue';
import ButtonGroup from './ButtonGroup.vue';
import FormButton from './FormButton.vue';
import LicenseText from './LicenseText.vue';
import { useMarkersStore } from '../stores/markers.js';
import { useScoreStore } from '../stores/score.js';
import { ref, provide, inject } from 'vue';
import { Marker } from '../utils/marker.js';
import { useI18n } from '../utils/i18n.js';
import { onKeyStroke } from '@vueuse/core';
import { getSimultaneousNoteIds } from '../utils/marker.js';

const props = defineProps({
    toolkit: Object,
    url: String,
    data: Object,
});

const data = (typeof props.data === 'string' ? JSON.parse(props.data) : props.data) ?? await ofetch(props.url);

const { $t } = useI18n(inject('locale'));

const scoreStore = useScoreStore();
const markersStore = useMarkersStore();

(async () => {
    const markers = [];
    for (let i = 0; i < data.markers.length; i++) {
        const marker = data.markers[i];
        const elems = [];
        for (let j = 0; j < marker.noteIds.length; j++) {
            const id = marker.noteIds[j];
            const noteIds = await getSimultaneousNoteIds(props.toolkit, scoreStore.isReady.promise, id);
            elems.push(...noteIds);
        }
        markers.push(new Marker(marker, [...new Set(elems)]));
    }
    markersStore.setMarkers(markers);
})();

const correctAudioPlayerElem = ref();
const wrongAudioPlayerElem = ref();
const showMarkers = ref(false);
const displayShowMarkersButton = ref(false);
const colMode = ref('right');

function checkSelectedMarkers() {
    markersStore.validateSelectedMarkersForMode();
    if (markersStore.selectedMarkers.value.length >= markersStore.markers.value.length) {
        displayShowMarkersButton.value = true;
    }
}

function showMissingMarkers() {
    markersStore.validateSelectedMarkersForMode();
    showMarkers.value = !showMarkers.value;
}

onKeyStroke('.', (e) => {
    e.preventDefault();
    markersStore.validateSelectedMarkersForMode();
    showMarkers.value = !showMarkers.value;
    displayShowMarkersButton.value = true;
});

provide('markersStore', markersStore);
provide('scoreStore', scoreStore);
</script>

<template>
    <div class="intonation-checker" :class="`col-mode-${colMode}`">
        <div class="wrapper">
            <div class="score-col">
                <ScoreContainer
                    :toolkit="toolkit"
                    :url="data.scoreUrl"
                    :show-markers="showMarkers"
                    @update:col-mode="colMode = $event"
                />
            </div>
            <div class="sidebar-col">
                <div class="header-section">
                    <div v-if="data.composer" class="composer">
                        {{ data.composer }}
                    </div>
                    <div v-if="data.title" class="title">
                        {{ data.title }}
                    </div>
                    <p v-if="data.description" class="description">
                        {{ data.description }}
                    </p>
                    <div v-if="data.instrumentation" class="instrumentation">
                        {{ $t('instrumentation', [data.instrumentation]) }}
                    </div>
                    <div v-if="data.performers" class="performers">
                        {{ data.performers }}
                    </div>
                    <LicenseText v-if="data.license" :license="data.license" class="license" />
                </div>
                <div class="audio-player-container">
                    <div class="audio-player-label">{{ $t('correct') }}</div>
                    <div class="audio-player-wrapper">
                        <AudioPlayer ref="correctAudioPlayerElem" :url="data.correctAudioUrl" />
                    </div>
                </div>
                <div class="audio-player-container">
                    <div class="audio-player-label">{{ $t('wrong') }}</div>
                    <div class="audio-player-wrapper">
                        <AudioPlayer ref="wrongAudioPlayerElem" :url="data.wrongAudioUrl" keyboard-shortcuts />
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
    @apply p-4 bg-gray-100 border-b flex flex-col gap-2;
}

.composer {
    @apply text-lg;
}

.title {
    @apply text-xl font-bold;
}

.description {
    @apply mt-2 mb-0;
}

.license {
    @apply text-xs;
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
