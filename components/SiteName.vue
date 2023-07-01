<script>
export default {
    name: 'SiteName'
}
</script> 

<script setup>
import { computed } from 'vue';
import { useUiStore } from '@/stores/ui';

const props = defineProps({
    uppercase: {
        type: Boolean,
        default: false
    }
});

const uiStore = useUiStore();

const siteName = computed(() => {
    const name = uiStore.siteName || '';
    return props.uppercase ? name.toUpperCase() : name;
});
</script>

<template>
    <span>{{ siteName }}</span>
</template>
