<script setup>
import ErrorListItem from './ErrorListItem.vue';

defineProps({
    errors: Array,
});
</script>

<template>
    <div>
        <div class="mb-4">
            Total {{ errors?.length }}
        </div>
        <div class="flex flex-col gap-4">
            <ErrorListItem v-for="(error, index) in errors" :key="index" :error="error" />
        </div>
    </div>
</template>
