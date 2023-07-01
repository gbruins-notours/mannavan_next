<script>
export default {
    name: 'CheckoutAddressForm'
}
</script> 

<script setup>
import { ref, reactive } from 'vue';
import { useI18n } from 'vue-i18n';
import { stringsAreEqual } from '@/utils/common.js';
import {
    FigButton,
    FigOverlay,
    FigAddressForm,
    FigCompareAddressModal
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
    cart: {
        type: Object,
        required: true
    },

    stripe: {
        type: Object,
        required: true
    }
});

const emit = defineEmits([
    'done'
]);

const { t } = useI18n();
const runtimeConfig = useRuntimeConfig()
const { 
    $bugsnag,
    $figErrorToast,
    $api
} = useNuxtApp();

const loading = ref(false);
const isInvalid = ref(true);
const form = reactive({
    ...addressFormBase,
    email: null,
    phone: null,
    is_gift: false
});
const original_address = ref({});
const matched_address = ref({});
const showMatchedAddress = ref(true);
const validationAttempts = ref(0);
const address_modal = ref(null);

function showCompareModal() {
    address_modal.value.show();
}

function onShippingAddressFormInvalid(isInvalid) {
    isInvalid.value = isInvalid;
}

function setShippingFormFromCart() {
    for(const key in form) {
        form[key] = (key === 'is_gift' ? props.cart[key] : props.cart[`shipping_${key}`]);
        form[key] = props.cart[key === 'is_gift' ? key : `shipping_${key}`];
    }
}

/**
 * Address validation costs money.
 * This prevents the backend validation of the form values
 * are the same as the cart values.
 * (The cart values will exist if the user goes back to the shipping form, step 1,
 * from a higher step)
 */
function shippingDataNeedsValidation() {
    let needValidation = false;

    ['streetAddress', 'city', 'state', 'postalCode', 'countryCodeAlpha2'].forEach((attr) => {
        if(!stringsAreEqual(form[attr], props.cart[`shipping_${attr}`])) {
            needValidation = true;
        }
    });

    return needValidation;
}

function setShippingDataFromForm() {
    const setAddressData = {};

    for(const key in form) {
        const dataKey = key === 'is_gift' ? key : `shipping_${key}`;
        setAddressData[dataKey] = form[key];
    }

    return setAddressData;
}

async function validateShippingForm() {
    validationAttempts.value++;
    let modalVisible = false;

    const shippingParams = setShippingDataFromForm();
    delete shippingParams.is_gift;

    const validateAddressReply = await $api.cart.shipping.validateAddress({
        id: props.cart.id,
        ...shippingParams
    });

    /*
    * Process validation errors:
    */
    const validationResponse = validateAddressReply.data?.validation_response;

    // Show the compare modal if there are issues
    // https://www.shipengine.com/docs/addresses/validation/#address-status-meanings
    if(['unverified', 'warning', 'error'].includes(validationResponse?.status)) {
        original_address.value = validationResponse?.original_address;
        matched_address.value = {};
        showMatchedAddress.value = false;
        showCompareModal();

        modalVisible = true;
    }
    else if(validationResponse?.status === 'verified'   
        && validationResponse?.matched_address 
        && validationResponse?.original_address) {
        // if the status is 'verified' BUT the matched address is not identical
        // to the provided address, then we want to get user acceptance:

        let diffs = 0;

        [
            'address_line1',
            'address_line2',
            'city_locality',
            'state_province',
            'postal_code',
            'country_code'
        ].forEach((key) => {
            if(validationResponse.matched_address[key] !== validationResponse.original_address[key]) {
                diffs++;
            }
        });

        if(diffs > 0) {
            original_address.value = validationResponse.original_address;
            matched_address.value = validationResponse.matched_address;
            showMatchedAddress.value = true;
            showCompareModal();

            modalVisible = true;
        }
    }

    if(modalVisible) {
        return false;
    }

    return true;
}


async function saveShippingForm(validate) {
    try {
        loading.value = true;

        const attemptsCfg = runtimeConfig.public.shippingAddressMaxValidationAttempts;
        const maxValidationAttempts = attemptsCfg ? parseInt(attemptsCfg) : 10;

        const doValidate = [true, false].includes(validate)
            ? validate 
            : shippingDataNeedsValidation();

        // Force turn off validation if the user has reached their limit
        if(validationAttempts.value >= maxValidationAttempts) {
            doValidate = false;
        }

        if(doValidate) {
            const modalVisible = await validateShippingForm();

            // If the modal is visible, then we need further
            // user input before we can persist the shipping address,
            // so we stop here
            if(modalVisible) {
                return;
            }
        }

        const setAddressResponse = await $api.cart.shipping.setAddress({
            id: props.cart.id,
            ...setShippingDataFromForm()
        });

        // If we got here then either no validation was performed
        // or the validation was clean
        emit('done', setAddressResponse.data?.cart);
    }
    catch(err) {
        console.error('ERR', err);

        $figErrorToast({
            title: t('Error')
            // text: err.response.data.message
        });

        $bugsnag.notify(err);
    }
    finally {
        loading.value = false;
    }
}

function onUseAddress(selectedAddress) {
    form.streetAddress = selectedAddress.addressLine1;
    form.extendedAddress = selectedAddress.addressLine2,
    form.countryCodeAlpha2 = selectedAddress.country,
    form.city = selectedAddress.city,
    form.state = selectedAddress.state,
    form.postalCode = selectedAddress.zip

    saveShippingForm(false);
}

watch(
    () => props.cart,
    (newVal) => {
        setShippingFormFromCart();
    },
    { immediate: true }
);
</script>

<template>
    <div>
        <fig-overlay :show="loading">
            <fig-address-form
                v-if="stripe"
                v-model="form"
                :stripe="stripe"
                @invalid="onShippingAddressFormInvalid" />

            <div class="mt-4 w-full">
                <fig-button
                    variant="primary"
                    @click="() => { saveShippingForm() }"
                    :disabled="isInvalid">{{ $t('Save & Continue') }}</fig-button>
            </div>
        </fig-overlay>

        <!-- modal for verifying the shipping address -->
        <fig-compare-address-modal
            ref="address_modal"
            :original-line1="original_address.address_line1"
            :original-line2="original_address.address_line2"
            :original-city="original_address.city_locality"
            :original-state="original_address.state_province"
            :original-zip="original_address.postal_code"
            :original-country="original_address.country_code"
            :suggested-line1="matched_address.address_line1"
            :suggested-line2="matched_address.address_line2"
            :suggested-city="matched_address.city_locality"
            :suggested-state="matched_address.state_province"
            :suggested-zip="matched_address.postal_code"
            :suggested-country="matched_address.country_code"
            :show-suggested-address="showMatchedAddress"
            @original="onUseAddress"
            @suggested="onUseAddress" />
    </div>
</template>
