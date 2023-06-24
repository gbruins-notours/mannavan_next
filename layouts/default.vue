<script>
export default {
    name: 'DefaultLayout'
}
</script>

<script setup>
import { onMounted, watch, inject } from 'vue';
// import AppHeader from '@/components/AppHeader';
import AppFooter from '@/components/AppFooter';
import AppSlideover from '@/components/AppSlideover';
import {
    FigIconSprite,
    FigToaster
} from '@notoursllc/figleaf';

const route = useRoute();
// const clearToasts = inject('figClearToasts');

function closeSidebar() {
    $store.dispatch('ui/closeSidebar');
}

watch(route, () => {
    // clearToasts();
});

onMounted(() => {
    closeSidebar()
});
</script>


<template>
    <div class="min-h-screen flex flex-col h-screen text-gray-700">
        <fig-icon-sprite />
        <fig-toaster :max-toasts="10" />
        <app-slideover @nav="closeSidebar" />
        <app-header />

        <main class="flex-grow">
            DEFAULT LAYOUT
            <slot />
        </main>

        <!-- <app-footer /> -->
    </div>
</template>