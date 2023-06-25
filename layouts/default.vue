<script>
export default {
    name: 'DefaultLayout'
}
</script>

<script setup>
import AppHeader from '@/components/AppHeader';
import AppFooter from '@/components/AppFooter';
import AppSlideover from '@/components/AppSlideover';
</script>

<template>
    <app-slideover />
    <app-header />

    <main class="flex-grow">
        <slot />
    </main>

    <app-footer />
</template>