<script>
export default {
    name: 'CartReceipt'
}
</script> 

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import ProductPrice from '@/components/product/ProductPrice.vue';
import CartTotalsTable from '@/components/cart/CartTotalsTable.vue';
import {
    FigOverlay,
    FigAddress,
    FigCardLastFour,
    FigTableSimple,
    FigTh,
    FigTd
} from '@notoursllc/figleaf';

const props = defineProps({
    cartId: {
        type: String
    }
});

const emit = defineEmits([
    'found'
]);

const { 
    $bugsnag,
    $figErrorToast,
    $api
} = useNuxtApp();

const { t } = useI18n();
const loading = ref(false);
const cart = ref({});
const payment = ref({});

const paymentMethodCard = computed(() => {
    return payment.value.payment_method_details?.card || {};
});

async function getCart() {
    try {
        const { data } = await $api.cart.get({
            id: props.cartId,
        });

        cart.value = data;

        emit('found', { ...cart.value })
    }
    catch(err) {
        $figErrorToast({
            title: t('An error occurred')
        });

        $bugsnag.notify(err);
    }
}

async function getPayment() {
    try {
        const { data } = await $api.cart.payment.get(cart.value.id);
        payment.value = data;
    }
    catch(err) {
        $figErrorToast({
            title: t('An error occurred')
        });

        $bugsnag.notify(err);
    }
}

function getBillingAddressProperty(prop) {
    return cart.billing_same_as_shipping ? cart[`shipping_${prop}`] : cart[`billing_${prop}`];
}

onMounted(() => {
    if(props.cartId) {
        loading.value = true;
        getCart();
        getPayment();
        loading.value = false;
    }
});
</script>


<template>
    <div>
        <div v-if="!loading && !cart" class="text-center">
            {{ $t('Oops we could not find the order you are looking for.') }}
        </div>

        <div v-else>
            <fig-overlay :show="loading">

                <!-- order details -->
                <div class="flex flex-wrap -mx-2 pt-5">

                    <!-- shipping -->
                    <div class="my-2 px-2 w-full sm:w-1/3">
                        <div class="font-semibold">{{ $t('Shipping') }}:</div>
                        <div class="pt-2">
                            <fig-address
                                :first-name="cart.shipping_firstName"
                                :last-name="cart.shipping_lastName"
                                :street-address="cart.shipping_streetAddress"
                                :extended-address="cart.shipping_extendedAddress"
                                :city="cart.shipping_city"
                                :state="cart.shipping_state"
                                :zip="cart.shipping_postalCode" />
                        </div>
                    </div>

                    <!-- billing -->
                    <div
                        class="my-2 px-2 w-full sm:w-1/3">
                        <div class="font-semibold">{{ $t('Billing') }}:</div>
                        <div class="pt-2">
                            <fig-address
                                :first-name="getBillingAddressProperty('firstName')"
                                :last-name="getBillingAddressProperty('lastName')"
                                :street-address="getBillingAddressProperty('streetAddress')"
                                :extended-address="getBillingAddressProperty('extendedAddress')"
                                :city="getBillingAddressProperty('city')"
                                :state="getBillingAddressProperty('state')"
                                :zip="getBillingAddressProperty('postalCode')" />
                        </div>
                    </div>

                    <!-- payment -->
                    <div class="my-2 px-2 w-full sm:w-1/3">
                        <div class="font-semibold">{{ $t('Payment') }}:</div>
                        <div class="pt-2">
                            <div>
                                {{ `${getBillingAddressProperty('firstName')} ${getBillingAddressProperty('lastName')}`.trim() }}
                            </div>
                            <div>
                                <fig-card-last-four
                                    :type="paymentMethodCard.brand"
                                    :last-four="paymentMethodCard.last4" />
                            </div>
                            <div>
                                {{ $t('Expiration') }}: {{ paymentMethodCard.exp_month }}/{{ paymentMethodCard.exp_year }}
                            </div>
                        </div>
                    </div>
                </div>

                <!-- cart items -->
                <div class="pt-5">
                    <fig-table-simple
                        striped
                        hover
                        bordered>
                        <template slot="head">
                            <tr>
                                <fig-th>{{ $t('Item') }}</fig-th>
                                <fig-th>{{ $t('Qty / Price') }}</fig-th>
                            </tr>
                        </template>

                        <tr v-for="(item, index) in cart.cart_items" :key="index">
                            <!-- item -->
                            <fig-td class="">
                                {{ item.product.title }}
                            </fig-td>

                            <!-- qty / price -->
                            <fig-td class="">
                                {{ $n(item.qty) }} @
                                <product-price
                                    :variant="item.product_variant"
                                    :sku="item.product_variant_sku" />
                            </fig-td>
                        </tr>
                    </fig-table-simple>
                </div>

                <div class="pt-6">
                    {{ $t('Order number') }}: {{ cart.id }}
                </div>

                <div class="pt-6 flex justify-end">
                    <div>
                        <cart-totals-table
                            :cart="cart"
                            shipping
                            sales-tax />
                    </div>
                </div>
            </fig-overlay>
        </div>
    </div>
</template>
