import { defineStore, acceptHMRUpdate } from 'pinia';
import isObject from 'lodash-es/isObject.js';

export const useCartStore = defineStore('cartStore', {
    persist: true,

    state: () => {
        /*
        * I decided not to include the "billing_" and "shipping_" attributes
        * in local storage, because I guess it could be a priviacy issue.
        * Omitting it comes with some inconvenience in the UI, as now
        * I need to fetch cart data from the API more often in order to
        * get "billing_" and "shipping_" data, but the impact isn't that great.
        * Seems worth the tradeoff.
        *
        * cart_items are also omitted because of a staleness issue I discovered:
        * If the UI uses cart_data from local storage, and product info changes in the
        * back end (price or availability, for example) then those changes arent reflected
        * in the cart, and an issue can occur (for example a customer may be charged a different
        * price for a product than is set in the DB)
        */

        return {
            // billing_city: null,
            // billing_company: null,
            // billing_countryCodeAlpha2: null,
            // billing_extendedAddress: null,
            // billing_firstName: null,
            // billing_lastName: null,
            // billing_phone: null,
            // billing_postalCode: null,
            // billing_state: null,
            // billing_streetAddress: null,
            // billingSameAsShipping: true,
            // cart_items: [],
            created_at: null,
            currency: null,
            grand_total: null,
            id: null,
            num_items: 0,
            sales_tax: null,
            // shipping_city: null,
            // shipping_company: null,
            // shipping_countryCodeAlpha2: null,
            // shipping_email: null,
            // shipping_extendedAddress: null,
            // shipping_firstName: null,
            // shipping_lastName: null,
            // shipping_postalCode: null,
            // shipping_state: null,
            // shipping_streetAddress: null,
            // shipping_phone: null,
            shipping_total: null,
            selected_shipping_rate: {},
            sub_total: null,
            updated_at: null,
            weight_oz_total: null
        }
    },

    actions: {
    },

    getters: {
        cart: (state) => {
            return state;
        },

        shippingRateTotal: (state) => {
            const rate = state.selected_shipping_rate;
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
        },
    
        shippingRateEstimatedDeliveryDate: (state) => {
            return state.selected_shipping_rate?.estimated_delivery_date;
        } 
    },
});

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useCartStore, import.meta.hot))
}
