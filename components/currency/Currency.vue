<script>
export default {
    name: 'Currency'
}
</script> 

<script setup>
import { computed } from 'vue';
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
const cartStore = useCartStore();

const defaultExchangeRate = computed(() => {
    return uiStore.exchange_rates?.default || 'USD';
});

const cartCurrency = computed(() => {
    return cartStore.currency || defaultExchangeRate.value;
});

const exchangeRateTable = computed(() => {
    return uiStore.exchange_rates?.rates || {};
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
