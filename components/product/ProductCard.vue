<script>
export default {
    name: 'ProductCard'
}
</script> 

<script setup>
import { ref, computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import isObject from 'lodash-es/isObject.js';
import ProductPrice from '@/components/product/ProductPrice.vue';
import ProductCardThumbs from '@/components/product/ProductCardThumbs.vue';
import VariantAccentMessage from '@/components/product/VariantAccentMessage.vue';
import {
    FigNuxtImgBunny
} from '@notoursllc/figleaf';

const props = defineProps({
    product: {
        type: Object,
        default: () => {
            return {};
        }
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
const coverImageUrl = ref({});
const accentMessage = ref(null);
const numVisibleThumbs = ref(0);
const showThumbs = ref(false);

const numProductSkus = computed(() => {
    return props.product.skus?.length;
});

const visibleVariantSku = computed(() => {
    return Array.isArray(variant.value.skus)
        ? variant.value.skus[0]
        : null
});

function setNumVisibleThumbs(num) {
    numVisibleThumbs.value = num;
}

function onCardMouseAction(isEnter) {
    showThumbs.value = numVisibleThumbs.value ? !!isEnter : false;
}

function onCardClick() {
    goToProductDetails(visibleVariantSku.value.id);
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

function setVisibleVariant(v) {
    variant.value = v;
    coverImageUrl.value = Array.isArray(v.images) ? v.images[0] : null;
    // accentMessage.value = v.accentMessage;
}

function init() {
    if(isObject(props.product) && Array.isArray(props.product.variants)) {
        const variants = this.product.variants;

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
    },
    { immediate: true }
);
</script>


<template>
    <div
        class="product-card"
        @click="onCardClick"
        @mouseenter="onCardMouseAction(true)"
        @mouseleave="onCardMouseAction()">

        <figure class="rounded-t-md">
            <fig-nuxt-img-bunny
                v-if="coverImage && coverImage.url"
                :src="coverImage.url"
                :alt="coverImage.alt_text"
                :loading="imageLoading"
                class="rounded-t"
                format="webp"
                sizes="lg:575px md:375px sm:500px" />
        </figure>

        <div class="pic-card-info">
            <product-card-thumbs
                v-show="showThumbs"
                :product="product"
                preset="prodthumbxs"
                :limit="maxVariantDisplay"
                @numdisplayed="setNumVisibleThumbs"
                @mouseover="setVisibleVariant"
                @click="(variant) => goToProductDetails(variant.id)" />

            <div v-show="!showThumbs">
                <variant-accent-message
                    :variant="variant"
                    class="text-orange-600 font-semibold" />

                <div class="text-gray-700 font-semibold">{{ product.title }}</div>
                <div class="text-gray-500 text-sm font-normal">{{ product.caption }}</div>
            </div>

            <div class="text-gray-700 font-semibold pt-3">
                <product-price :sku="visibleVariantSku" />
            </div>
        </div>

        <!-- <div
            @click="onCardClick"
            class="border-t border-gray-300 flex justify-center py-3 cursor-pointer text-blue-600">
            <fig-icon-label>
                <template v-slot:left>
                    <fig-icon
                        icon="eye"
                        :width="16"
                        :height="16" />
                </template>
                <div class="pl-1">{{ $t('SEE MORE') }}</div>
            </fig-icon-label>
        </div> -->
    </div>
</template>


<style>
.product-card {
    @apply bg-white rounded cursor-pointer;
}

/* https://www.codecaptain.io/blog/web-development/responsive-images-and-preventing-page-reflow/474 */
.product-card > figure {
    @apply w-full m-0 block relative;
    padding-bottom: 100%;
    background: #dceff9;
}

.product-card > figure > img {
    @apply absolute w-full h-auto top-0 left-0;
}

.pic-card-info {
    @apply p-3 text-base font-semibold relative overflow-hidden;
    min-height: 100px;
}
</style>
