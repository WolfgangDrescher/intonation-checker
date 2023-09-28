<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue';
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
const touchDevice = ref(false);
const exactSeeker = ref(false);

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
    if (exactSeeker.value) {
        return showRemainingTime.value ? `-${(audio.duration() - seeker.value).toFixed(2)}` : seeker.value.toFixed(2);
    }
    return showRemainingTime.value ? `-${formatTime(audio.duration() - seeker.value)}` : formatTime(seeker.value);
});

const progress = computed(() => {
    return (seeker.value / audio.duration()) * 100 || 0;
});

function whileMoveMouse(e) {
    e.stopPropagation();
    setSeekFromClientX(e.clientX);
}

function whileMoveTouch(e) {
    e.stopPropagation();
    setSeekFromClientX(e.touches[0].clientX);
}

function setSeekFromClientX(clientX) {
    const rect = progressBar.value.getBoundingClientRect();
    const x = Math.min(Math.max(clientX - rect.left, 0), rect.width);
    draggingSeek.value = (x / rect.width) * audio.duration();
}

function endMove(event) {
    event.stopPropagation();
    window.removeEventListener('mousemove', whileMoveMouse);
    window.removeEventListener('mouseup', endMove, true);
    window.removeEventListener('touchmove', whileMoveTouch);
    window.removeEventListener('touchend', endMove, true);
    audio.seek(draggingSeek.value);
    draggingSeek.value = null;
}

function onMousedownEvent(event) {
    event.stopPropagation();
    window.addEventListener('mousemove', whileMoveMouse);
    window.addEventListener('mouseup', endMove, true);
    window.addEventListener('touchmove', whileMoveTouch);
    window.addEventListener('touchend', endMove, true);
    // audio.pause();
}

function getSeek() {
    return audio.seek();
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

onMounted(() => {
    if (isTouchDevice()) {
        touchDevice.value = true;
    }
});

function isTouchDevice() {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;
}

defineExpose({
    seekTo,
    seekToFactor,
    getSeek,
});
</script>

<template>
    <div class="audio-player">
        <FormButton @click="toggle" class="form-button">
            <Icon v-if="isPlaying" icon="heroicons-solid:pause" />
            <Icon v-else icon="heroicons-solid:play" />
        </FormButton>
        <div
            ref="progressBar"
            class="progress-bar"
            :style="`--progress: ${progress}%`"
            @mouseup="seekHandler"
        >
            <div class="progress-bar-handle" style="width: var(--progress)"></div>
            <div
                class="progress-bar-progress"
                :class="touchDevice ? 'touch-device' : 'no-touch-device'"
                style="left: var(--progress)"
                @mousedown="onMousedownEvent"
                @touchstart="onMousedownEvent"
            ></div>
        </div>
        <div class="font-mono cursor-pointer" @click="showRemainingTime = !showRemainingTime" @dblclick="exactSeeker = !exactSeeker">
            {{ formattedTime }}
        </div>
    </div>
</template>

<style scoped>
.audio-player {
    @apply flex items-center gap-2;
}

.form-button {
    @apply text-2xl;
}

.progress-bar {
    @apply relative flex-grow h-2 bg-gray-200 cursor-pointer;
}

.progress-bar-handle {
    @apply pointer-events-none bg-red-500 h-full;
}

.progress-bar-progress {
    @apply cursor-grab absolute top-1/2 -translate-y-1/2 -translate-x-1.5 w-3 h-3 rounded-full bg-red-500 shadow;
}

.progress-bar .progress-bar-progress.touch-device {
    @apply w-5 h-5;
}


.progress-bar .progress-bar-progress.no-touch-device {
    @apply invisible;
}

.progress-bar:hover .progress-bar-progress.no-touch-device {
    @apply visible;
}
</style>
