<script>
export default {
    name: 'ProductPrice'
}
</script> 

<script setup>
import { computed } from 'vue';
import isObject from 'lodash-es/isObject.js';
import Currency from '@/components/currency/Currency.vue';

const props = defineProps({
    sku: {
        type: Object,
        default: () => {
            return {};
        }
    },

    showStrikethrough: {
        type: Boolean,
        default: true
    },

    stacked: {
        type: Boolean,
        default: false
    }
});

const basePrice = computed(() => {
    if(isObject(props.sku)
        && props.sku.base_price !== null) {
        return props.sku.base_price;
    }

    return null;
});

const salePrice = computed(() => {
    if(isObject(props.sku)
        && props.sku.is_on_sale
        && props.sku.sale_price !== null) {
        return props.sku.sale_price;
    }

    return null;
});
</script>


<template>
    <div class="inline-block">
        <!-- base price (with strikethrough) over sale price -->
        <template v-if="showStrikethrough && salePrice && basePrice">
            <currency
                :price="basePrice"
                tag="div"
                class="text-gray-500 mr-1 line-through hidden"
                :class="{'sm:inline-block': !stacked, 'sm:block': stacked}" />
            <currency :price="salePrice" />
        </template>
        <currency
            v-else-if="salePrice"
            :price="salePrice" />
        <currency
            v-else
            :price="basePrice" />
    </div>
</template>
