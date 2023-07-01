<script>
export default {
    name: 'BrandName'
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

const brandName = computed(() => {
    const name = uiStore.brandName || '';
    return props.uppercase ? name.toUpperCase() : name;
});
</script>

<template>
    <span>{{ brandName }}<sup>&reg;</sup></span>
</template>
