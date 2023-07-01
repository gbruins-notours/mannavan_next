<script>
export default {
    name: 'CheckoutPaymentForm'
}
</script> 

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useCartStore } from '@/stores/cart';
import {
    FigButton,
    FigOverlay,
    FigFormCheckbox,
    FigAddressForm,
    FigStripeForm,
} from '@notoursllc/figleaf';

const addressFormBase = {
    firstName: null,
    lastName: null,
    streetAddress: null,
    extendedAddress: null,
    countryCodeAlpha2: null,
    city: null,
    state: null,
    postalCode: null
};

const props = defineProps({
    stripe: {
        required: true
    },

    cart: {
        type: Object,
        required: true
    }
});

const router = useRouter();
const { t } = useI18n();
const cartStore = useCartStore();
const { 
    $bugsnag,
    $figErrorToast,
    $api
} = useNuxtApp();

const loading = ref(false);
const billing_same_as_shipping = ref(true);
const stripeFormIsValid = ref(false);
const billingFormIsInvalid = ref(true);
const billingForm = reactive({
    ...addressFormBase
});

const canShowPlaceOrderButton = computed(() => {
    return (billing_same_as_shipping.value || !billingFormIsInvalid.value) && stripeFormIsValid.value;
});

function onStripeFormValid(isValid) {
    stripeFormIsValid.value = isValid;
}

function onStripeTokenGenerated(token) {
    // console.log("onStripeTokenGenerated", token)
    //TODO: send token to server
}

function onBillingAddressFormInvalid(isInvalid) {
    billingFormIsInvalid.value = isInvalid;
}

async function afterTransactionSuccess() {
    await cartStore.reset();

    return router.push({
        name: 'order-id',
        params: { id: props.cart.id }
    });
}

function saveBillingForm() {
    try {
        // If billing is the same as shipping then
        // set all billing form values to null
        if(billing_same_as_shipping.value) {
            Object.keys(billingForm).forEach(key => {
                billingForm[key] = addressFormBase[key];
            });
        }

        // append 'billing_' to all of the keys
        const billingData = {
            billing_same_as_shipping: billing_same_as_shipping.value
        };
        for(const key in billingForm) {
            billingData[`billing_${key}`] = billingForm[key];
        }

        return $api.cart.update({
            id: props.cart.id,
            ...billingData
        });
    }
    catch(err) {
        console.error('ERR', err);

        $figErrorToast({
            title: t('Error')
            // text: err.response.data.message
        });

        $bugsnag.notify(err);
    }
}


async function onClickPlaceOrder(cardElement) {
    loading.value = true;

    // this may be a second attempt at processing payment
    // if the first attempt resulted in an error, so closing
    // any previous message instances
    $figClearToasts();

    try {
        // first save the billing data
        await saveBillingForm();

        const { data } = await $api.cart.payment.intent(props.cart.id);

        const stripeResponse = await sendStripeCardPayment(
            data.clientSecret,
            cardElement
        );

        // console.log("STRIPE RESPONSE", stripeResponse);

        if(stripeResponse.error) {
            $figErrorToast({
                title: t('An error occurred when processing your card'),
                text: stripeResponse.error ? stripeResponse.error.message : null
            });
        }
        else {
            await $api.cart.payment.success(
                props.cart.id,
                stripeResponse.paymentIntent.id
            );

            afterTransactionSuccess();
        }
    }
    catch(err) {
        $figErrorToast({
            title: t('An error occurred'),
            text: err.message
        });

        $bugsnag.notify(err);
    }
    finally {
        loading.value = false;
    }
}


function sendStripeCardPayment(clientSecret, cardElement) {
    // const billingAddressSource = billing_same_as_shipping.value ? this.shippingForm.form : billingForm;

    return props.stripe.confirmCardPayment(
        clientSecret,
        {
            payment_method: {
                card: cardElement,

                //https://stripe.com/docs/api/payment_methods/create#create_payment_method-billing_details
                // billing_details: {
                //     address: {
                //         city: billingAddressSource.city,
                //         country: billingAddressSource.countryCodeAlpha2,
                //         line1: billingAddressSource.streetAddress,
                //         line2: billingAddressSource.extendedAddress,
                //         postal_code: billingAddressSource.postalCode,
                //         state: billingAddressSource.state
                //     },
                //     name: `${billingAddressSource.firstName} ${billingAddressSource.lastName}`.trim()
                //     // email: null,
                //     // phone: null
                // },

                // https://stripe.com/docs/api/payment_methods/create#create_payment_method-metadata
                metadata: {
                    cart_id: props.cart.id
                }
            }
            // receipt_email: 'gregbruins@gmail.com'
        }
    );
}
</script>

<template>
    <fig-overlay :show="loading">
        <fig-stripe-form
            :stripe="stripe"
            @valid="onStripeFormValid"
            @token="onStripeTokenGenerated">

            <template v-slot:content="props">
                <!-- billing same as shipping checkbox -->
                <div class="mt-4">
                    <fig-form-checkbox
                        class="mr-3"
                        v-model="billing_same_as_shipping">{{ $t('Billing address same as shipping') }}</fig-form-checkbox>
                </div>

                <!-- billing address form -->
                <div v-if="!billing_same_as_shipping" class="mt-4">
                    <div class="text-black">{{ $t('Billing address') }}:</div>
                    <fig-address-form
                        v-model="billingForm"
                        @invalid="onBillingAddressFormInvalid"
                        hide-email
                        hide-phone
                        hide-gift />
                </div>

                <!-- place order button -->
                <div class="pt-6">
                    <fig-button
                        variant="primary"
                        size="lg"
                        @click="onClickPlaceOrder(props.cardElement)"
                        :disabled="!canShowPlaceOrderButton">{{ $t('PLACE YOUR ORDER') }}</fig-button>
                </div>
            </template>
        </fig-stripe-form>
    </fig-overlay>
</template>
