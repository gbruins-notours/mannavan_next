<script>
export default {
    name: 'ProductDetails'
}
</script> 

<script setup>
import { ref, computed, reactive, onMounted } from 'vue';
// import isObject from 'lodash.isobject';
// import { email, required } from 'vuelidate/lib/validators';
// import ProductPrice from '@/components/product/ProductPrice';
// import ProductImageSlider from '@/components/product/ProductImageSlider';
// import ProductCardThumbs from '@/components/product/ProductCardThumbs';
// import { getProductVariantCoverImage } from '@/utils/product';
// import Currency from '@/components/currency/Currency.vue';
import { useApiFetch } from '@/composables/useApiFetch.js';
// import TshirtSizeChart from '@/components/product/TshirtSizeChart';
import {
    // FigButton,
    // FigOverlay,
    // FigModal,
    // FigSizeButtons,
    FigProductDetailsLayout,
    // FigStockLevelWarning,
    FigTexasToast,
    FigContent,
    // FigNuxtImgBunny,
    // FigAddress,
    // FigIcon,
    // FigIconLabel,
    // FigYouTube,
    // FigBunnyVideoPlayer
} from '@notoursllc/figleaf';

const route = useRoute();

const product = ref({});
const visibleVariant = ref({});
const selectedAttributes = ref({});
const selectedAttributesAreValid = ref(false);
const isLoading = ref(false);
const cartButtonLoading = ref(false);
const selectedSkuInventoryCount = ref(null);

const atcConfirm = reactive({
    title: null,
    imageUrl: null,
    skuLabel: null,
    skuLabelType: null,
    productPrice: null
});

const form = reactive({
    selectedSku: null
});


// test: does this work?
// const { data: prod, pending, error } = await useAsyncData(() => {
//     console.log("IN useAsyncData", route.params.id);

//     return useApiFetch(
//         'products',
//         {
//             url: '/product',
//             params: {
//                 id: route.params.id
//             }
//         }
//     );
// });

// test
onMounted(() => {
    console.log("OMN MOUNTED")

    useApiFetch(
        'products',
        {
            url: '/product',
            params: {
                id: route.params.id
            }
        }
    );
});


// if(route.query.variant) {
//     prod?.variants?.forEach((obj) => {
//         if(obj.id === route.query.variant) {
//             visibleVariant.value = obj;
//         }
//     });
// }
// if(visibleVariant.value?.skus?.length === 1) {
//     form.selectedSku = data.visibleVariant.skus[0];
// }
</script>


<template>
    <div>test</div>
</template>


<style>
.product-attribute-select .vs__dropdown-toggle,
.product-attribute-select .vs__selected {
    line-height: 2;
}
</style>
