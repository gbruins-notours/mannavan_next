<script>
export default {
    name: 'AppSlideover'
}
</script> 

<script setup>
import { storeToRefs } from 'pinia';
import { useUiStore } from '@/stores/ui';
import { useProductStore } from '@/stores/product';
import { FigSlideover } from '@notoursllc/figleaf';

const uiStore = useUiStore();
const { sidebarOpened } = storeToRefs(uiStore);

const productStore = useProductStore();
const { subTypes } = storeToRefs(productStore);

function onLinkClick(e) {
    e.preventDefault;
    closeSidebar()
}

function closeSidebar() {
    uiStore.$patch({
        sidebarOpened: false
    });
}

onMounted(() => {
    closeSidebar()
});
</script>


<template>
    <fig-slideover
        :opened="sidebarOpened"
        @close="closeSidebar"
        class="bg-gray-800">

        <nav class="px-10 w-full block">
            <div v-for="(obj, type) in subTypes" :key="obj.id" class="my-4">
                <!-- <nuxt-link
                    :to="{ name: 'productSubType', params: { productSubType: obj.slug } }"
                    class="slideover-link"
                    active-class="active"
                    @click.native="onLinkClick">{{ $t(type) }}</nuxt-link> -->
            </div>

            <div class="my-4">
                <!-- <nuxt-link
                    :to="{ name: 'index' }"
                    class="slideover-link"
                    @click.native="onLinkClick">{{ $t('All') }}</nuxt-link> -->
            </div>
        </nav>
    </fig-slideover>
</template>


<style scoped>
.slideover-link {
    @apply font-semibold text-center mr-5 text-white text-xl block;
}
</style>
