<script setup>
defineProps({
    marker: Object,
});
</script>

<template>
    <div class="p-3 border shadow rounded">
        {{ marker }}
    </div>
</template>
