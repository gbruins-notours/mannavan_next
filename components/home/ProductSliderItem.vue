<script>
export default {
    name: 'ProductSliderItem'
}
</script> 

<script setup>
import { ref, computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import isObject from 'lodash-es/isObject.js';
import ProductPrice from '@/components/product/ProductPrice.vue';
import ProductCardThumbs from '@/components/product/ProductCardThumbs.vue';
import VariantAccentMessage from '@/components/product/VariantAccentMessage.vue';

const props = defineProps({
    product: {
        type: Object,
        required: true
    },

    imageLoading: {
        type: String,
        default: 'lazy',
        validator: (value) => ['lazy', 'eager', 'auto'].includes(value)
    },

    maxVariantDisplay: {
        type: Number,
        default: 4
    }
});

const router = useRouter();

const variant = ref({});
const coverImageUrl = ref(null);
const numVisibleThumbs = ref(0);

const numProductSkus = computed(() => {
    return props.product.skus?.length;
});

const thumbOverflowDisplay = computed(() => {
    if(numProductSkus.value > maxVariantDisplay.value) {
        return `+${numProductSkus.value - maxVariantDisplay.value}`;
    }
    return '';
});

function setNumVisibleThumbs(num) {
    numVisibleThumbs.value = num;
}

function goToProductDetails(variantId) {
    const params = {
        id: props.product.id
    };

    const query = {};
    if(variantId) {
        query.variant = variantId;
    }

    router.push({
        name: 'p-id',
        params,
        query
    });
}

function onCardClick() {
    goToProductDetails(variant.value.id);
}

function setVisibleVariant(v) {
    variant.value = v;
    coverImageUrl.value = Array.isArray(v.images) ? v.images[0].url : null;
}

function init() {
    if(isObject(props.product) && Array.isArray(props.product.variants)) {
        const variants = props.product.variants;

        for(let i=0, l=variants.length; i<l; i++) {
            if(variants[i].published) {
                setVisibleVariant(variants[i]);
                break;
            }
        }
    }
}

watch(
    () => props.product, 
    () => {
        init();
    }
);
</script>


<template>
    <div
        class="product-slider-item"
        @click="onCardClick">

        <div
            class="product-slider-pic"
            :style="{ backgroundImage: `url(https://bv-pullzone-1.b-cdn.net/${coverImageUrl}?class=w500)` }">

            <div class="product-slider-pic-details">
                <h3 class="text-white mb-1">
                    {{ product.title || product.name }}
                </h3>
            </div>
        </div>

        <div class="bg-white py-1 px-2" style="height:100px;">
            <product-card-thumbs
                :product="product"
                preset="prodthumbxs"
                :limit="maxVariantDisplay"
                @numdisplayed="setNumVisibleThumbs"
                @mouseover="setVisibleVariant"
                @click="(variant) => goToProductDetails(variant.id)" />

            <div>
                <variant-accent-message
                    :variant="variant"
                    class="text-orange-600 font-semibold" />

                <div class="text-gray-700 font-semibold">{{ product.title }}</div>
                <!-- <div class="text-gray-600">{{ product.caption }}</div> -->
            </div>

            <div class="text-gray-700 font-semibold pt-3">
                <product-price :variant="variant" />
            </div>

        </div>

    </div>
</template>


<style>
.product-slider-item {
    @apply border-2 border-transparent my-0 mx-1;

}
.product-slider-pic {
    @apply bg-cover bg-no-repeat bg-center rounded-t-sm;
    height: 20rem;
}

.product-slider-pic-details {
    @apply h-full flex flex-col justify-end py-2 px-4 opacity-100 sm:opacity-0 invisible transition-all ease-in-out duration-300 rounded-b-sm;
}
</style>
