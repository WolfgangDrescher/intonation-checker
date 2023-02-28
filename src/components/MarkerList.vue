<script setup>
import MarkerListItem from './MarkerListItem.vue';

defineProps({
    markers: Array,
});

const emit = defineEmits(['audioSeek', 'audioSeekFactor']);
</script>

<template>
    <div>
        <div class="mb-4">
            Total {{ markers?.length }}
        </div>
        <div class="flex flex-col gap-4">
            <MarkerListItem
                v-for="marker in markers"
                :key="marker.noteIds.join()"
                :marker="marker"
                @audioSeek="emit('audioSeek', $event)"
                @audioSeekFactor="emit('audioSeekFactor', $event)"
            />
        </div>
    </div>
</template>
