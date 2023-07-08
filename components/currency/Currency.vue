<script>
export default {
    name: 'Currency'
}
</script> 

<script setup>
import { computed } from 'vue';
import { storeToRefs } from 'pinia';
import { useUiStore } from '@/stores/ui';
import { useCartStore } from '@/stores/cart';
import {
    FigCurrency
} from '@notoursllc/figleaf';

const props = defineProps({
    price: {
        type: Number
    },

    tag: {
        type: String,
        default: 'span'
    },

    applyExchangeRate: {
        type: Boolean,
        default: true
    }
});

const emit = defineEmits([
    'exchangeRatePrice'
]);

const uiStore = useUiStore();
const { exchange_rates } = storeToRefs(uiStore);

const cartStore = useCartStore();
const { currency } = storeToRefs(cartStore);

const defaultExchangeRate = computed(() => {
    return exchange_rates.value?.default || 'USD';
});

const cartCurrency = computed(() => {
    return currency.value || defaultExchangeRate.value;
});

const exchangeRateTable = computed(() => {
    return exchange_rates.value?.rates || {};
});

function onExchangeRatePrice(val) {
    emit('exchangeRatePrice', val);
}
</script>


<template>
    <fig-currency
        :price="price"
        :currency="cartCurrency"
        :exchange-rates="exchangeRateTable"
        :apply-exchange-rate="applyExchangeRate"
        :tag="tag"
        @exchangeRatePrice="onExchangeRatePrice" />
</template>
