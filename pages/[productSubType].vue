<script>
export default {
    name: 'ProductSubType'
}
</script> 

<script setup>
import { computed } from 'vue';
import { storeToRefs } from 'pinia';
import { useI18n } from 'vue-i18n';
import { useUiStore } from '@/stores/ui';
import { useProductStore } from '@/stores/product';
import { useApiFetch } from '@/composables/useApiFetch.js';
import ProductCard from '@/components/product/ProductCard.vue';
import {
    FigProductGrid,
    FigContent
} from '@notoursllc/figleaf';

const { t } = useI18n();

const uiStore = useUiStore();
const { brandName } = storeToRefs(uiStore);

const productStore = useProductStore();
const { subTypes } = storeToRefs(productStore);

// const routeParams = useRoute().params;
const route = useRoute();

const productTypeName = computed(() => {
    return t(subTypeData.value.name);
});

const subTypeData = computed(() => {
    let data = {};

    if(route.params.productSubType) {
        const types = subTypes.value;

        Object.keys(types).forEach((id) => {
            if(types[id].slug === route.params.productSubType.trim()) {
                data = types[id];
            }
        });
    }

    return data;
});

const queryParams = computed(() => {
    const searchConfig = {
        published: true,
        _sort: 'updated_at:desc'
    };

    let data = subTypeData.value;
    if(data.value) {
    //     // searchConfig.whereRaw = ['sub_type & ? > 0', [data.value]];
        searchConfig.sub_type = { bitwise_and_gt: { left: data.value, right: 0 } };
    }

    return searchConfig;
})

// test: does this work?
const { data: products, pending, error } = await useAsyncData(() => {
    console.log("IN useAsyncData");

    return useApiFetch({
        url: '/products',
        params: queryParams.value
    });
});

useHead({
    title: productTypeName.value,
    meta: [
        { name: 'description', content: `${productTypeName.value} by ${brandName.value}` }
    ]
});
</script>


<template>
    <fig-content>
        <fig-product-grid :products="products">
            <template v-slot:default="slotProps">
                <product-card :product="slotProps.data.product" />
            </template>
        </fig-product-grid>
    </fig-content>
</template>
