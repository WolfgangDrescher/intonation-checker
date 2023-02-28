<script setup>
defineProps({
    error: Object,
});
</script>

<template>
    <div class="p-3 border shadow rounded">
        {{ error }}
    </div>
</template>
