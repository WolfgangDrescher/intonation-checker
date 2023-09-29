<script setup>
import { inject } from 'vue';
import { useI18n } from '../utils/i18n.js';

defineProps({
    license: String,
});

const { $t } = useI18n(inject('locale'));
</script>

<template>
    <div>
        <template v-if="license === 'cc-by-sa-4.0'">
            <p xmlns:cc="http://creativecommons.org/ns#">
                {{ $t('licensedUnder')}}
                <a href="http://creativecommons.org/licenses/by-sa/4.0/?ref=chooser-v1" target="_blank" rel="license noopener noreferrer" style="display:inline-block;">
                    CC BY-SA 4.0
                    <img style="height:1rem!important;margin-left:0.2rem;vertical-align:text-bottom;display:inline-block" src="https://mirrors.creativecommons.org/presskit/icons/cc.svg?ref=chooser-v1">
                    <img style="height:1rem!important;margin-left:0.2rem;vertical-align:text-bottom;display:inline-block" src="https://mirrors.creativecommons.org/presskit/icons/by.svg?ref=chooser-v1">
                    <img style="height:1rem!important;margin-left:0.2rem;vertical-align:text-bottom;display:inline-block" src="https://mirrors.creativecommons.org/presskit/icons/sa.svg?ref=chooser-v1">
                </a>
            </p>
        </template>
        <template v-else>
            {{ license }}
        </template>
    </div>
</template>
