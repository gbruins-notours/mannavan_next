<script>
export default {
    name: 'BrandName'
}
</script> 

<script setup>
import { computed } from 'vue';
import { storeToRefs } from 'pinia';
import { useUiStore } from '@/stores/ui';

const props = defineProps({
    uppercase: {
        type: Boolean,
        default: false
    }
});

const uiStore = useUiStore();
const { brandName } = storeToRefs(uiStore);

const label = computed(() => {
    const name = brandName.value || '';
    return props.uppercase ? name.toUpperCase() : name;
});
</script>

<template>
    <span>{{ label }}<sup>&reg;</sup></span>
</template>
