<script>
export default {
    name: 'CartItem'
}
</script> 

<script setup>
import { ref, reactive, computed, watch } from 'vue';
import isObject from 'lodash-es/isObject.js';
import { useI18n } from 'vue-i18n';
import { useUiStore } from '@/stores/ui';
import { useCartStore } from '@/stores/cart';
import { getProductVariantCoverImage } from '@/utils/product';
import ProductPrice from '@/components/product/ProductPrice.vue';
import {
    FigButton,
    FigPopConfirm,
    FigOverlay,
    FigFormSelectNative,
    FigNuxtImgBunny
} from '@notoursllc/figleaf';


const props = defineProps({
    item: {
        type: Object,
        default: () => {
            return {};
        }
    },

    editMode: {
        type: Boolean,
        default: false
    },

    showPriceStrikethrough: {
        type: Boolean,
        default: true
    },

    showQuantityWarning: {
        type: Boolean,
        default: true
    },

    imageLoading: {
        type: String,
        default: 'eager',
        validator: (value) => ['lazy', 'eager', 'auto'].includes(value)
    }
});

const emit = defineEmits([
    'updated'
]);

const { t } = useI18n();
const { 
    $bugsnag,
    $figErrorToast,
    $api
} = useNuxtApp();

const uiStore = useUiStore();
const cartStore = useCartStore();

const cartItem = ref({});
const sizeOptions = ref([]);
const form = reactive({
    size: null,
    qty: null
});
const isLoading = ref(false);

const selectedColor = computed(() => {
    return cartItem.value.product_variant?.label || null;
});

const selectedSize = computed(() => {
    return cartItem.value.product_variant_sku?.label || null;
});

const coverImage = computed(() => {
    return getProductVariantCoverImage(cartItem.value.product_variant);
});

const quantityOptions = computed(() => {
    const opts = [];
    const max = uiStore.appConfig.CART_PRODUCT_QUANTITY_LIMIT || 20;

    for(let i=1; i<=max; i++) {
        opts.push(
            { label: i, value: i }
        );
    }

    return opts;
});

async function setSizeOptions() {
    try {
        const { data } = await $api.product.variant.get(
            cartItem.value.product_variant?.id
        );

        const opts = [];

        if(isObject(data) && Array.isArray(data.skus)) {
            data.skus.forEach((sku) => {
                opts.push({
                    label: sku.label,
                    value: sku.id
                });
            });
        }

        sizeOptions.value = opts;
    }
    catch(err) {
        console.error('Error getting products', err);
    }
}


function init() {
    setSizeOptions();
}

async function onRemoveItem(id) {
    isLoading.value = true;

    try {
        isLoading.value = true;

        const { data } = await $api.cart.item.delete({
            id: id
        });

        emit('updated');
        cartStore.$patch(data);
    }
    catch(err) {
        console.error('Error getting products', err);
        $bugsnag.notify(err);
    }
    finally {
        isLoading.value = false;
    }
}

async function updateCartItem() {
    try {
        isLoading.value = true;

        const { data } = await $api.cart.item.update({
            cart_id: cartStore.id.value,
            id: cartItem.value.id,
            product_variant_sku_id: cartItem.value.product_variant_sku?.id,
            qty: cartItem.value.qty,
            clear_shipping_rate: true
        });

        emit('updated');

        cartStore.$patch({
            ...data
        });

        init();
    }
    catch(err) {
        console.error('Error updating cart item', err);

        $figErrorToast ({
            title: t('An error occurred')
        });

        $bugsnag.notify(err);
    }
    finally {
        isLoading.value = false;
    }
}

watch(
    () => props.item,
    (newVal) => {
        cartItem.value = {
            ...newVal
        };
        init();
    },
    {
        immediate: true,
        deep: true
    }
);
</script>


<template>
    <fig-overlay :show="isLoading">
        <div class="bg-white rounded p-2 sm:p-3 mb-2 sm:mb-4 flex items-start">
            <!-- image -->
            <div class="mr-2 sm:mr-4">
                <fig-nuxt-img-bunny
                    v-if="coverImage && coverImage.url"
                    :src="coverImage.url"
                    :alt="coverImage.alt_text"
                    preset="prodthumb"
                    :loading="imageLoading" />
            </div>

            <div class="flex-grow">
                <!-- product title -->
                <div class="font-semibold mb-1">{{ cartItem.product.title }}</div>

                <!-- color -->
                <div v-if="selectedColor" class="text-gray-600 mb-1">
                    <div class="inline-block pr-1">{{ $t('Color') }}:</div>
                    <div class="inline-block">{{ selectedColor }}</div>
                </div>

                <!-- selected size -->
                <div v-if="selectedSize" class="text-gray-600 mb-3 sm:mb-4">
                    <div class="inline-block pr-1">
                        {{ $t(cartItem.product_variant.sku_label_type === 'size' ? 'Size' : 'Label') }}:
                    </div>
                    <div class="inline-block">{{ selectedSize }}</div>
                </div>

                <div>
                    <!-- remove button -->
                    <fig-pop-confirm @confirm="onRemoveItem(cartItem.id)">
                        {{ $t('Remove this item?') }}

                        <fig-button
                            slot="reference"
                            variant="naked"
                            size="sm">
                            <span class="border-b border-gray-400">{{ $t('Remove') }}</span>
                        </fig-button>
                    </fig-pop-confirm>
                </div>
            </div>

            <div class="mr-8 sm:mr-10">
                <!-- quantity -->
                <div>{{ $t('Quantity') }}:</div>
                <fig-form-select-native
                    v-model="cartItem.qty"
                    @input="updateCartItem"
                    :options="quantityOptions" />
            </div>

            <div>
                <product-price
                    :variant="cartItem.product_variant"
                    :sku="cartItem.product_variant_sku" />
            </div>
        </div>
    </fig-overlay>
</template>
