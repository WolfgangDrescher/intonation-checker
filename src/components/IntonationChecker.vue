<script setup>
import AudioPlayer from './AudioPlayer.vue';
import MarkerList from './MarkerList.vue';
import ScoreContainer from './ScoreContainer.vue';
import ButtonGroup from './ButtonGroup.vue';
import FormButton from './FormButton.vue';
import { useMarkersStore } from '../stores/markers.js';
import { createPinia } from 'pinia';
import { ref, provide } from 'vue';
import { Marker } from '../utils/marker.js';
import { useI18n } from '../utils/i18n.js';

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

const pinia = createPinia();

const store = useMarkersStore(pinia);
store.setMarkers(props.markers.map((m) => new Marker(m)));

const correctAudioPlayerElem = ref();
const wrongAudioPlayerElem = ref();
const showMarkers = ref(false);
const displayShowMarkersButton = ref(false);
const colMode = ref('right');

function checkSelectedMarkers() {
    store.validateSelectedMarkers();
    if (store.selectedMarkers.length) {
        displayShowMarkersButton.value = true;
    }
}

provide('locale', props.locale);
</script>

<template>
    <div class="intonation-checker lg:h-full">
        <div class="lg:h-full lg:flex overflow-hidden">
            <div class="flex-grow min-w-0" :class="{ 'flex-grow-0 flex-shrink-0 lg:w-[500px]': colMode === 'left' }">
                <ScoreContainer
                    :toolkit="toolkit"
                    :url="scoreUrl"
                    :show-markers="showMarkers"
                    @update:col-mode="colMode = $event"
                />
            </div>
            <div
                class="border-l flex flex-col"
                :class="{
                    'flex-grow-0 flex-shrink-0 lg:w-[500px]': colMode === 'right',
                    'flex-grow-0 flex-shrink-0 lg:w-1/2': colMode === 'center',
                }"
            >
                <div class="p-4 bg-gray-100 border-b">
                    <div class="text-xl font-bold">
                        {{ title }}
                    </div>
                    <p v-if="description" class="mt-2 mb-0">
                        {{ description }}
                    </p>
                </div>
                <div class="p-2 bg-gray-50 border-b flex items-center gap-2">
                    <div class="w-12">{{ $t('correct') }}</div>
                    <div class="flex-grow">
                        <AudioPlayer ref="correctAudioPlayerElem" :url="correctAudioUrl"></AudioPlayer>
                    </div>
                </div>
                <div class="p-2 bg-gray-50 border-b flex items-center gap-2">
                    <div class="w-12">{{ $t('wrong') }}</div>
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
                        <FormButton @click="checkSelectedMarkers">{{ $t('check') }}</FormButton>
                        <FormButton
                            v-if="displayShowMarkersButton"
                            @click="
                                store.validateSelectedMarkers();
                                showMarkers = !showMarkers;
                            "
                            >{{ $t('showMissingMarkers') }}</FormButton
                        >
                    </ButtonGroup>
                </div>
            </div>
        </div>
    </div>
</template>
