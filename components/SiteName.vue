<script>
export default {
    name: 'SiteName'
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
const { siteName } = storeToRefs(uiStore);

const label = computed(() => {
    const name = siteName.value || '';
    return props.uppercase ? name.toUpperCase() : name;
});
</script>

<template>
    <span>{{ label }}</span>
</template>
