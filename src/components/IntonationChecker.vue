
<script setup>
import { provide } from 'vue';
import AsyncCheckerContent from './AsyncCheckerContent.vue';
import { Icon } from '@iconify/vue';
import { useI18n } from '../utils/i18n.js';

const props = defineProps({
    toolkit: Object,
    url: String,
    data: Object,
    locale: String,
    primaryColor: {
        type: String,
        default: '#E2007D',
    },
});

defineOptions({
    inheritAttrs: false,
});

const { $t } = useI18n(props.locale);

provide('locale', props.locale);
</script>

<template>
    <Suspense>
        <AsyncCheckerContent :toolkit="toolkit" :url="url" :data="data" :locale="locale" :primaryColor="primaryColor" />
        <template #fallback>
            <div class="loading">
                <div classs="loading-content">
                    {{ $t('loading') }}
                    <div class="icon-wrapper">
                        <Icon icon="bi:arrow-repeat" :inline="true" class="loading-icon spin" />
                    </div>
                </div>
            </div>
        </template>
    </Suspense>
</template>

<style scoped>
.loading {
    @apply h-full w-full flex items-center justify-center text-center;
}

.loading-icon {
    @apply inline-block;
}

.icon-wrapper {
    @apply text-2xl mt-1;
}

.spin {
    animation-name: spin;
    animation-duration: 2000ms;
    animation-iteration-count: infinite;
    animation-timing-function: linear;
}
@keyframes spin {
    from {
        transform: rotate(0deg);
    }
    to {
        transform: rotate(360deg);
    }
}
</style>
