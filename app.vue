<script setup>
import { watch, inject } from 'vue';
import {
    FigIconSprite,
    FigToaster
} from '@notoursllc/figleaf';

const route = useRoute();
const { $figClearToasts } = useNuxtApp();

watch(route, () => {
    $figClearToasts();
});
</script>

<template>
    <VitePwaManifest />
    <NuxtLoadingIndicator />
    <fig-icon-sprite />
    <fig-toaster :max-toasts="10" />
    
    <NuxtLayout>
        <NuxtPage />
    </NuxtLayout>
</template>

<style>
body,
#__nuxt {
    @apply min-h-screen flex flex-col h-screen text-gray-700;
}
</style>