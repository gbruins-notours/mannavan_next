<script>
export default {
    name: 'AppSlideover'
}
</script> 

<script setup>
import { computed } from 'vue';
import { useUiStore } from '@/stores/ui';
import { useProductStore } from '@/stores/product';
import { FigSlideover } from '@notoursllc/figleaf';

const emit = defineEmits(['nav']);

const uiStore = useUiStore();
const productStore = useProductStore();

const productSubTypes = computed(() => {
    return productStore.subTypes;
});

function onLinkClick(e) {
    e.preventDefault;
    emit('nav', e)
}

function onClose() {
    console.log('onClose')
    uiStore.$patch({
        sidebarOpened: false
    });
}
</script>


<template>
    <fig-slideover
        :opened="uiStore.sidebarOpened"
        @close="onClose"
        class="bg-gray-800">

        <a class="text-white" @click="onClose">uiStore.sidebarOpened {{  uiStore.sidebarOpened }}</a>

        <nav class="px-10 w-full block">
            <div v-for="(obj, type) in productSubTypes" :key="obj.id" class="my-4">
                <nuxt-link
                    :to="{ name: 'productSubType', params: { productSubType: obj.slug } }"
                    class="slideover-link"
                    active-class="active"
                    @click.native="onLinkClick">{{ $t(type) }}</nuxt-link>
            </div>

            <div class="my-4">
                <nuxt-link
                    :to="{ name: 'index' }"
                    class="slideover-link"
                    @click.native="onLinkClick">{{ $t('All') }}</nuxt-link>
            </div>
        </nav>
    </fig-slideover>
</template>


<style scoped>
.slideover-link {
    @apply font-semibold text-center mr-5 text-white text-xl block;
}
</style>
