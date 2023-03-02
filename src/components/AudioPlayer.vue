<script setup>
import { computed, onUnmounted, ref } from 'vue';
import { Howl } from 'howler';
import { Icon } from '@iconify/vue';
import FormButton from './FormButton.vue';
import { onKeyStroke } from '@vueuse/core';

const props = defineProps({
    url: String,
});

const audio = new Howl({
    src: [props.url],
    html5: true, // allow playing audio on muted phones
});

const isReady = ref(false);
const isPlaying = ref(false);
const seek = ref(0);
const draggingSeek = ref(null);
const showRemainingTime = ref(false);
const progressBar = ref();

if (audio.state() === 'loaded') {
    isReady.value = true;
}

audio.on('load', () => {
    // isReady.value = true;
});

audio.on('play', () => {
    isPlaying.value = true;
    requestAnimationFrame(updateLoop);
});

audio.on('end', () => {
    isPlaying.value = false;
});

audio.on('pause', () => {
    isPlaying.value = false;
});

audio.on('stop', () => {
    isPlaying.value = false;
});

audio.on('seek', () => {
    updateLoop();
});

function updateLoop() {
    seek.value = audio.seek() || 0;
    if (audio.playing()) {
        requestAnimationFrame(updateLoop);
    }
}

function toggle() {
    if (audio.state() !== 'loaded') return;
    if (audio.playing()) {
        audio.pause();
    } else {
        audio.play();
    }
}

function seekHandler(e) {
    const rect = e.target.getBoundingClientRect();
    audio.seek(((e.clientX - rect.left) / rect.width) * audio.duration());
    if (!audio.playing()) {
        audio.play();
    }
}

function formatTime(secs) {
    secs = Math.round(secs);
    const minutes = Math.floor(secs / 60) || 0;
    const seconds = secs - minutes * 60 || 0;
    return minutes + ':' + (seconds < 10 ? '0' : '') + seconds;
}

const seeker = computed(() => {
    return draggingSeek.value ?? seek.value;
});

const formattedTime = computed(() => {
    return showRemainingTime.value ? `-${formatTime(audio.duration() - seeker.value)}` : formatTime(seeker.value);
});

const progress = computed(() => {
    return (seeker.value / audio.duration()) * 100 || 0;
});

function whileMove(e) {
    e.stopPropagation();
    const rect = progressBar.value.getBoundingClientRect();
    const x = Math.min(Math.max(e.clientX - rect.left, 0), rect.width);
    draggingSeek.value = (x / rect.width) * audio.duration();
}

function endMove(event) {
    event.stopPropagation();
    window.removeEventListener('mousemove', whileMove);
    window.removeEventListener('mouseup', endMove, true);
    window.removeEventListener('touchmove', whileMove);
    window.removeEventListener('touchend', endMove, true);
    audio.seek(draggingSeek.value);
    draggingSeek.value = null;
    if (!audio.playing()) {
        audio.play();
    }
}

function onMousedownEvent(event) {
    event.stopPropagation();
    window.addEventListener('mousemove', whileMove);
    window.addEventListener('mouseup', endMove, true);
    window.addEventListener('touchmove', whileMove);
    window.addEventListener('touchend', endMove, true);
    // audio.pause();
}

function seekTo(secs) {
    audio.seek(secs);
    if (!audio.playing()) {
        audio.play();
    }
}

function seekToFactor(factor) {
    audio.seek(audio.duration() * factor);
    if (!audio.playing()) {
        audio.play();
    }
}

onKeyStroke('ArrowLeft', (e) => {
    e.preventDefault();
    audio.seek(Math.max(0, audio.seek() - 5));
});

onKeyStroke('ArrowRight', (e) => {
    e.preventDefault();
    audio.seek(Math.min(audio.duration(), audio.seek() + 5));
});

onKeyStroke(' ', (e) => {
    e.preventDefault();
    if (audio.playing()) {
        audio.pause();
    } else {
        audio.play();
    }
});

onUnmounted(() => {
    audio.stop();
});

defineExpose({
    seekTo,
    seekToFactor,
});
</script>

<template>
    <div class="flex items-center gap-2">
        <FormButton @click="toggle" class="text-2xl">
            <Icon v-if="isPlaying" icon="heroicons-solid:pause" />
            <Icon v-else icon="heroicons-solid:play" />
        </FormButton>
        <div
            ref="progressBar"
            class="group relative flex-grow h-2 bg-gray-200 cursor-pointer"
            :style="`--progress: ${progress}%`"
            @mouseup="seekHandler"
        >
            <div class="progressbar-handle pointer-events-none bg-red-500 h-full" style="width: var(--progress)"></div>
            <div
                class="cursor-grab absolute invisible group-hover:visible top-1/2 -translate-y-1/2 -translate-x-1.5 w-3 h-3 rounded-full bg-red-500 shadow"
                style="left: var(--progress)"
                @mousedown="onMousedownEvent"
                @touchstart="onMousedownEvent"
            ></div>
        </div>
        <div class="font-mono cursor-pointer" @click="showRemainingTime = !showRemainingTime">
            {{ formattedTime }}
        </div>
    </div>
</template>
