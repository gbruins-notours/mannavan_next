import { defineStore, acceptHMRUpdate } from 'pinia';
import isObject from 'lodash-es/isObject.js';
import { ref, computed } from 'vue';

export const useCartStore = defineStore('cartStore', () => {

    const id = ref(123);
    const created_at = ref(null);
    const updated_at = ref(null);
    const currency = ref(null);
    const grand_total = ref(null);
    const num_items = ref(0);
    const sales_tax = ref(null);
    const shipping_total = ref(null);
    const selected_shipping_rate = ref({});
    const sub_total = ref(null);
    const weight_oz_total = ref(null);

    const shippingRateTotal = computed(() => {
        const rate = selected_shipping_rate.value;
        let total = 0;

        if(isObject(rate)) {
            if(isObject(rate.shipping_amount)) {
                total += rate.shipping_amount.amount ? rate.shipping_amount.amount * 100 : 0;
            }

            if(isObject(rate.other_amount)) {
                total += rate.other_amount.amount ? rate.other_amount.amount * 100 : 0;
            }

            if(isObject(rate.insurance_amount)) {
                total += rate.insurance_amount.amount ? rate.insurance_amount.amount * 100 : 0;
            }

            if(isObject(rate.confirmation_amount)) {
                total += rate.confirmation_amount.amount ? rate.confirmation_amount.amount * 100 : 0;
            }
        }

        return total;
    });

    const shippingRateEstimatedDeliveryDate = computed(() => {
        return selected_shipping_rate.value?.estimated_delivery_date;
    });

    function reset() {
        // id.value = null;
        id.value = 123;
        created_at.value = null;
        updated_at.value = null;
        currency.value = null;
        grand_total.value = null;
        num_items.value = 0;
        sales_tax.value = null;
        shipping_total.value = null;
        selected_shipping_rate.value = {};
        sub_total.value = null;
        weight_oz_total.value = null;
    }

    return {
        id,
        created_at,
        updated_at,
        currency,
        grand_total,
        num_items,
        sales_tax,
        shipping_total,
        selected_shipping_rate,
        sub_total,
        weight_oz_total,
        shippingRateTotal,
        shippingRateEstimatedDeliveryDate,
        reset
    }

}, { persist: true }); 


if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useCartStore, import.meta.hot))
}
