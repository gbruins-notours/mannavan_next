<script>
export default {
    name: 'CartSubTotal'
}
</script> 

<script setup>
import { computed } from 'vue';
import { storeToRefs } from 'pinia';
import { useCartStore } from '@/stores/cart';
import { useUiStore } from '@/stores/ui';
import Currency from '@/components/currency/Currency.vue';
import {
    FigUseCurrency
} from '@notoursllc/figleaf';

const props = defineProps({
    cart: {
        type: Object,
        default() {
            return {};
        }
    }
});

const emit = defineEmits([
    'exchangeRatePrice'
]);

const uiStore = useUiStore();
const { exchange_rates } = storeToRefs(uiStore);

const cartStore = useCartStore();
const { currency } = storeToRefs(cartStore);

const { cartSubTotal } = FigUseCurrency();

const cartCurrency = computed(() => {
    return currency.value || 'USD';
});

const exchangeRateTable = computed(() => {
    return exchange_rates.value?.rates || {};
});

const exchangeRate = computed(() => {
    return exchangeRateTable.value[cartCurrency.value] || 1;
});

const subtotal = computed(() => {
    return cartSubTotal(props.cart, exchangeRate.value);
});

function onExchangeRatePrice(val) {
    emit('exchangeRatePrice', val);
}
</script>


<template>
    <currency
        :price="subtotal"
        :apply-exchange-rate="false"
        @exchangeRatePrice="onExchangeRatePrice" />
</template>
