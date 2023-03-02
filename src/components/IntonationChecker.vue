<script setup>
import AudioPlayer from './AudioPlayer.vue';
import MarkerList from './MarkerList.vue';
import ScoreContainer from './ScoreContainer.vue';
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

const audioPlayer = ref();
</script>

<template>
    <div class="intonation-checker lg:h-full">
        <div class="lg:h-full lg:flex overflow-hidden">
            <div class="flex-grow min-w-0">
                <ScoreContainer :toolkit="toolkit" :url="scoreUrl" />
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
                <div class="p-2 bg-gray-50 border-b">
                    <AudioPlayer ref="audioPlayer" :url="wrongAudioUrl"></AudioPlayer>
                </div>
                <div class="p-4 min-h-0 flex-grew overflow-y-auto">
                    <MarkerList
                        @audioSeek="$refs.audioPlayer.seekTo($event)"
                        @audioSeekFactor="$refs.audioPlayer.seekToFactor($event)"
                    />
                </div>
                <div class="p-4 mt-auto bg-gray-50 border-t">
                    <button @click="store.validateSelectedMarkers()">Validate</button>
                </div>
            </div>
        </div>
    </div>
</template>
