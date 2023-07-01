<script>
export default {
    name: 'CartItemMimi'
}
</script> 

<script setup>
import { computed } from 'vue';
import isObject from 'lodash-es/isObject.js';
import { getProductVariantCoverImage } from '@/utils/product.js';
import ProductPrice from '@/components/product/ProductPrice.vue';
import { FigNuxtImgBunny } from '@notoursllc/figleaf';

const props = defineProps({
    item: {
        type: Object,
        default: null
    },

    imageLoading: {
        type: String,
        default: 'eager',
        validator: (value) => ['lazy', 'eager', 'auto'].includes(value)
    }
});

const selectedColor = computed(() => {
    return isObject(props.item.product_variant) ? props.item.product_variant.label : null;
});

const selectedSize = computed(() => {
    return isObject(props.item.product_variant_sku) ? props.item.product_variant_sku.label : null;
});

const coverImage = computed(() => {
    return getProductVariantCoverImage(props.item.product_variant);
});
</script>


<template>
    <article class="flex items-start w-full my-2">
        <!-- pic -->
        <div class="mr-2 sm:mr-4">
            <fig-nuxt-img-bunny
                v-if="coverImage && coverImage.url"
                :src="coverImage.url"
                :alt="coverImage.alt_text"
                preset="prodthumb"
                :loading="imageLoading" />
        </div>

        <div class="flex-grow text-sm">
            <!-- title -->
            <div class="font-semibold mb-1">{{ item.product.title }}</div>

            <!-- color -->
            <div v-if="selectedColor" class="text-gray-600">
                {{ $t('Color') }}: {{ selectedColor }}
            </div>

            <!-- selected size -->
            <div v-if="selectedSize" class="text-gray-600">
                {{ $t(item.product_variant.sku_label_type === 'size' ? 'Size' : 'Label') }}: {{ selectedSize }}
            </div>

            <!-- quantity -->
            <div class="text-gray-600">
                {{ $t('Qty') }}: {{ $n(item.qty) }}
                @ <product-price
                    :variant="item.product_variant"
                    :sku="item.product_variant_sku" />
            </div>
        </div>
    </article>
</template>
