<script setup>
import 'vue-verovio-canvas/style.css';
import { VerovioCanvas } from 'vue-verovio-canvas';
import AudioPlayer from './AudioPlayer.vue';
import ErrorList from './ErrorList.vue';

defineProps({
    toolkit: Object,
    scoreUrl: String,
    correctAudioUrl: String,
    wrongAudioUrl: String,
    title: String,
    description: String,
    errors: Array,
});

function scoreClickHandler(event) {
    console.log(event);
}
</script>

<template>
    <div class="lg:w-full lg:h-full lg:flex overflow-hidden">
        <div class="flex-grow" @click="scoreClickHandler">
            <VerovioCanvas :toolkit="toolkit" :url="scoreUrl" :pageMargin="50" />
        </div>
        <div class="flex-grow-0 flex-shrink-0 lg:w-[500px] border-l">
            <div class="p-4 bg-gray-100 border-b">
                <div class="text-xl font-bold">
                    {{ title }}
                </div>
                <p v-if="description" class="mt-2 mb-0">
                    {{ description }}
                </p>
            </div>
            <div class="p-2 bg-gray-50 border-b">
                <AudioPlayer :url="wrongAudioUrl"></AudioPlayer>
            </div>
            <div class="p-4">
                <ErrorList :errors="errors" />
            </div>
        </div>
    </div>
</template>
