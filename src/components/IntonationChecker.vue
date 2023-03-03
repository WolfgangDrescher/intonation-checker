<script setup>
import AudioPlayer from './AudioPlayer.vue';
import MarkerList from './MarkerList.vue';
import ScoreContainer from './ScoreContainer.vue';
import ButtonGroup from './ButtonGroup.vue';
import FormButton from './FormButton.vue';
import { useMarkersStore } from '../stores/markers.js';
import { createPinia } from 'pinia';
import { ref } from 'vue';
import { Marker } from '../utils/marker.js';

const props = defineProps({
    toolkit: Object,
    scoreUrl: String,
    correctAudioUrl: String,
    wrongAudioUrl: String,
    title: String,
    description: String,
    markers: Array,
});

const pinia = createPinia();

const store = useMarkersStore(pinia);
store.setMarkers(props.markers.map((m) => new Marker(m)));

const correctAudioPlayerElem = ref();
const wrongAudioPlayerElem = ref();
const showMarkers = ref(false);
const displayShowMarkersButton = ref(false);

function checkSelectedMarkers() {
    store.validateSelectedMarkers();
    if (store.selectedMarkers.length) {
        displayShowMarkersButton.value = true;
    }
}
</script>

<template>
    <div class="intonation-checker lg:h-full">
        <div class="lg:h-full lg:flex overflow-hidden">
            <div class="flex-grow min-w-0">
                <ScoreContainer :toolkit="toolkit" :url="scoreUrl" :show-markers="showMarkers" />
            </div>
            <div class="flex-grow-0 flex-shrink-0 lg:w-[500px] border-l flex flex-col">
                <div class="p-4 bg-gray-100 border-b">
                    <div class="text-xl font-bold">
                        {{ title }}
                    </div>
                    <p v-if="description" class="mt-2 mb-0">
                        {{ description }}
                    </p>
                </div>
                <div class="p-2 bg-gray-50 border-b flex items-center gap-2">
                    <div class="w-12">Richtig</div>
                    <div class="flex-grow">
                        <AudioPlayer ref="correctAudioPlayerElem" :url="correctAudioUrl"></AudioPlayer>
                    </div>
                </div>
                <div class="p-2 bg-gray-50 border-b flex items-center gap-2">
                    <div class="w-12">Falsch</div>
                    <div class="flex-grow">
                        <AudioPlayer ref="wrongAudioPlayerElem" :url="wrongAudioUrl"></AudioPlayer>
                    </div>
                </div>
                <div class="p-4 min-h-0 flex-grew overflow-y-auto">
                    <MarkerList
                        :show-markers="showMarkers"
                        @audioSeek="$refs.wrongAudioPlayerElem.seekTo($event)"
                        @audioSeekFactor="$refs.wrongAudioPlayerElem.seekToFactor($event)"
                    />
                </div>
                <div class="p-4 mt-auto bg-gray-50 border-t">
                    <ButtonGroup>
                        <FormButton @click="checkSelectedMarkers">Prüfen</FormButton>
                        <FormButton v-if="displayShowMarkersButton" @click="store.validateSelectedMarkers(); showMarkers = !showMarkers">Fehlende Anzeigen</FormButton>
                    </ButtonGroup>
                </div>
            </div>
        </div>
    </div>
</template>
