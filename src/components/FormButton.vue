<template>
    <button class="form-group">
        <slot></slot>
    </button>
</template>

<style scoped>
.form-group {
    @apply p-1 bg-gray-200 rounded;
}
</style>
