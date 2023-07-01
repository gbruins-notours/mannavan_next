<script>
export default {
    name: 'ProductSubType'
}
</script> 

<script setup>
import { ref, computed } from 'vue';
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
const productStore = useProductStore();
// const routeParams = useRoute().params;
const route = useRoute();

useHead({
    title: productTypeName.value,
    meta: [
        { name: 'description', content: `${productTypeName.value} by ${uiStore.brandName}` }
    ]
});

const productTypeName = computed(() => {
    return t(subTypeData.value.name);
});

const subTypeData = computed(() => {
    let data = {};

    if(route.params.productSubType) {
        const subTypes = productStore.subTypes.value;

        Object.keys(subTypes).forEach((id) => {
            if(subTypes[id].slug === route.params.productSubType.trim()) {
                data = subTypes[id];
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

const { data: products, error, pending } = useApiFetch({
    url: '/products',
    params: queryParams.value
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
