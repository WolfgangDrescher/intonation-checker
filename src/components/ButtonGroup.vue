<template>
    <div class="button-group">
        <slot></slot>
    </div>
</template>

<style scoped>
.button-group {
    @apply inline-flex flex-wrap gap-2 items-center;
}
</style>
