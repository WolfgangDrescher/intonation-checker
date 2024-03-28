<script setup>
defineProps({
    active: Boolean,
});
</script>

<template>
    <button class="form-group" :class="{active}">
        <slot></slot>
    </button>
</template>

<style scoped>
.form-group {
    @apply p-1 bg-gray-200 rounded;
}

.form-group.active {
    @apply text-white;
    background-color: var(--primary-color);
}
</style>
