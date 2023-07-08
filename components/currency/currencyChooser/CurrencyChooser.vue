<script>
export default {
    name: 'CurrencyChooser'
}
</script> 

<script setup>
import { computed, onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import isString from 'lodash-es/isString.js'
import { useUiStore } from '@/stores/ui';
import { useCartStore } from '@/stores/cart';
import {
    FigDropdown,
    FigDropdownButton,
    FigButton,
    FigCurrencySymbol,
    FigUseTime,
    FigUseCountry,
    FigIconLabel
} from '@notoursllc/figleaf';

const uiStore = useUiStore();
const { exchange_rates } = storeToRefs(uiStore);

const cartStore = useCartStore();
const { id: cartId, currency } = storeToRefs(cartStore);

const { 
    $bugsnag,
    $figErrorToast,
    $api
} = useNuxtApp();

const defaultExchangeRate = computed(() => {
    return exchange_rates.value?.default || 'USD';
});

const cartCurrency = computed(() => {
    const c = currency.value || defaultExchangeRate.value;
    return isString(c) ? c.toUpperCase() : '';
});

const exchangeRates = computed(() => {
    const rates = exchange_rates.value?.rates || {};
    let filteredRates = {};

    if(rates && cartCurrency) {
        filteredRates = { ...rates };
        delete filteredRates[cartCurrency];
    }

    return Object.keys(filteredRates);
});

async function onExchangeRateClick(val) {
    if(exchangeRates.value.includes(val)) {
        cartStore.$patch({
            currency: val
        });

        if (cartId.value) {
            try {
                const { data } = await $api.cart.currency({
                    id: cartId.value,
                    currency: val
                });

                await Promise.all([
                    cartStore.$patch(data.cart),

                    uiStore.$patch({
                        exchange_rates: data.exchange_rates
                    })
                ]);
            }
            catch(err) {
                // no action
            }
        }
    }
}

onMounted(() => {
    // Set the cart currency to the currency based on the browser's timezone
    // if the cart currency is not already set
    if(!currency.value) {
        const { getCountryFromTimezone } = FigUseTime();
        const { getCountryCodeToCurrencyCodeMap } = FigUseCountry();

        const tz = getCountryFromTimezone();
        const countryToCurrencyMap = getCountryCodeToCurrencyCodeMap();
        const cur = countryToCurrencyMap[tz];
        const rates = exchange_rates.value?.rates || {};

        if(cur && rates[cur]) {
            cartStore.$patch({
                currency: cur
            });
        }
    }
});
</script>

<template>
    <fig-dropdown>
        <template v-slot:toggler>
            <fig-button variant="naked">
                <fig-icon-label>
                    <template v-slot:left>
                        <fig-currency-symbol :currency="cartCurrency" />
                    </template>
                    {{ cartCurrency }}
                </fig-icon-label>
            </fig-button>
        </template>

        <fig-dropdown-button
            v-for="(rate, idx) in exchangeRates"
            :key="idx"
            @click="onExchangeRateClick(rate)">
            <fig-icon-label>
                <template v-slot:left>
                    <fig-currency-symbol :currency="rate" />
                </template>
                {{ rate }}
            </fig-icon-label>
        </fig-dropdown-button>
    </fig-dropdown>
</template>

