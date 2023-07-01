<script>
/**
 * Displays a thumbnail image for each product color
 */
export default {
    name: 'ProductCardThumbs'
}
</script> 

<script setup>
import { ref, computed, watch } from 'vue';
import isObject from 'lodash-es/isObject.js';
import { getProductVariantCoverImage } from '@/utils/product.js';
import {
    FigTooltip,
    FigNuxtImgBunny
} from '@notoursllc/figleaf';

const props = defineProps({
    product: {
        type: Object,
        default: () => {
            return {};
        }
    },

    limit: {
        type: Number,
        default: null
    },

    preset: {
        type: String,
        default: 'prodthumbxs',
        validator: (value) => ['prodthumb', 'prodthumbxs'].includes(value)
    },

    selected: {
        type: String,
        default: ''
    }
});

const emit = defineEmits([
    'mouseover',
    'click',
    'numdisplayed'
]);

const thumbs = ref([]);
const selectedVariantId = ref(null);

const thumbOverflowDisplay = computed(() => {
    if(numProductSkus.value > maxVariantDisplay.value) {
        return `+${numProductSkus.value - maxVariantDisplay.value}`;
    }
    return '';
});

function onThumbMouseOver(obj) {
    emit('mouseover', obj.variant);
}

function onThumbClick(obj) {
    emit('click', obj.variant);
    selectedVariantId.value = obj.variant.id;
}

function getOneThumbPerVariant(product) {
    const images = [];

    if(Array.isArray(product.variants)) {
        product.variants.forEach((variant) => {
            const coverImage = getProductVariantCoverImage(variant);

            if(coverImage?.url) {
                images.push({
                    ...coverImage,
                    variant: variant
                });
            }
        });
    }

    return images;
}

watch(
    () => props.selected,
    (newVal) => {
        selectedVariantId.value = newVal;
    },
    { immediate: true }
);

watch(
    () => props.product,
    (newVal) => {
        if(isObject(newVal) && Array.isArray(newVal.variants)) {
            const variantThumbs = getOneThumbPerVariant(newVal);

            // If there is only one featured image, then we will not dipslay any thumbs
            // because that one image will already be displayed on the page
            if(variantThumbs.length === 1) {
                thumbs.value = [];
            }
            else {
                thumbs.value = props.limit ? variantThumbs.slice(0, props.limit) : variantThumbs;
            }
        }

        emit('numdisplayed', thumbs.value.length);
    },
    { immediate: true }
);
</script>


<template>
    <div class="flex flex-row items-center -mx-sm">
        <div v-for="(obj, index) in thumbs"
             :key="index"
             class="media-thumb-wrapper"
             @click="onThumbClick(obj)"
             @mouseover="onThumbMouseOver(obj)">

            <fig-tooltip
                :disabled="obj.variant.total_inventory_count > 0">
                <div
                    slot="toggler"
                    class="media-thumb"
                    :class="{ 'media-thumb-selected': selectedVariantId === obj.variant.id }">
                    <fig-nuxt-img-bunny
                        :src="obj.url"
                        :preset="preset"
                        loading="lazy"
                        :alt="obj.alt_text || $t('variant image')" />
                </div>
                {{ $t('Sold out') }}
            </fig-tooltip>
        </div>
    </div>
</template>


<style>
.media-thumb {
    @apply cursor-pointer;
}
.media-thumb,
.media-thumb > div {
    @apply rounded-md;
}
.media-thumb-wrapper:not(:last-child) {
    @apply mr-2;
}
.media-thumb:hover,
.media-thumb-selected {
    box-shadow: 0 0 0 2px rgb(55, 194, 245);
}
</style>
