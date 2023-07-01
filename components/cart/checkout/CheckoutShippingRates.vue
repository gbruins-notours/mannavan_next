<script>
export default {
    name: 'CheckoutShippingRates'
}
</script>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { useCartStore } from '@/stores/cart';
import CheckoutDeliveryEstimate  from '@/components/cart/checkout/CheckoutDeliveryEstimate.vue';
import Currency from '@/components/currency/Currency.vue';
import {
    FigFormRadio,
    FigButton,
    FigOverlay
} from '@notoursllc/figleaf';


const props = defineProps({
    cart: {
        type: Object,
        required: true
    },

    showSelectedRate: {
        type: Boolean,
        default: false
    }
});

const emit = defineEmits([
    'done'
]);

const { t } = useI18n();
const cartStore = useCartStore();
const { 
    $bugsnag,
    $figErrorToast,
    $api
} = useNuxtApp();

const loading = ref(false);
const rates = ref([]);
const selectedRate = ref(null);

const buttonDisabled = computed(() => {
    return (rates.value.length && !selectedRate.value) ? true : false;
});

async function getShippingRates() {
    try {
        loading.value = true;

        const response = await $api.cart.shipping.getEstimates(props.cart.id)
        rates.value = response?.data;

        // Hopefully an unlikely scenario, but if no shipping rates were returned
        // then we should probably consider it as 'free' and move on to the next step.
        if(!rates.value.length) {
            selectedRate.value = null;
            continueToPayment();
            return;
        }

        if(rates.value.length === 1) {
            selectedRate.value = rates.value[0].rate_id;
        }
    }
    catch(err) {
        $figErrorToast({
            title: t('A server error occurred while setting the shipping rates'),
            text: err.message
        });

        $bugsnag.notify(err);
    }
    finally {
        loading.value = false;
    }
}

async function continueToPayment() {
    try {
        loading.value = true;

        const response = await $api.cart.shipping.selectRate(
            props.cart.id,
            selectedRate.value
        );

        selectedRate.value = null;
        emit('done', response?.data);
    }
    catch(err) {
        $figleaf.errorToast({
            title: t('An error occurred')
        });

        $bugsnag.notify(err);
    }
    finally {
        loading.value = false;
    }
}

onMounted(() => {
    getShippingRates();
});
</script>

<template>
    <fig-overlay :show="loading">
        <div class="text-gray-900 font-semibold mb-2 mt-4" v-if="rates.length">
            {{ rates.length > 1 ? $t('Choose your shipping speed') : $t('Shipping') }}:
        </div>

        <div>
            <!-- selected rate details -->
            <template v-if="showSelectedRate">
                <template v-if="cart.selected_shipping_rate">
                    <div class="inline-block text-black">
                        <currency :price="cartStore.shippingRateTotal" />
                    </div>
                    <div class="inline-block text-gray-500 pl-3">
                        <checkout-delivery-estimate
                            :arrival-date="cartStore.shippingRateEstimatedDeliveryDate" />
                    </div>
                </template>
            </template>

            <!-- rate selection -->
            <template v-else>
                <fig-form-radio
                    v-for="obj in rates"
                    :key="obj.rate_id"
                    name="selectedShipping"
                    :checked-value="obj.rate_id"
                    v-model="selectedRate">
                    <div class="flex items-center">
                        <div class="text-black">
                            <currency :price="obj.shipping_amount.amount * 100" />
                        </div>
                        <div class="text-gray-500 pl-3">
                            <checkout-delivery-estimate
                                :arrival-date="obj.estimated_delivery_date" />
                        </div>
                    </div>
                </fig-form-radio>

                <div class="mt-4">
                    <fig-button
                        variant="primary"
                        size="md"
                        @click="continueToPayment"
                        :disabled="buttonDisabled">{{ $t('Continue to payment') }}</fig-button>
                </div>
            </template>
        </div>
    </fig-overlay>
</template>
