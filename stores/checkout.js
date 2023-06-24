import { defineStore, acceptHMRUpdate } from 'pinia';

function getInitialState() {
    return {
        validations: {
            shippingForm: false
        },
        shippingMethod: '1'
    }
}

export const useCheckoutStore = defineStore('checkoutStore', {
    persist: true,

    state: () => ({
        ...getInitialState()
    }),

    actions: {
        SHIPPING_FORM_VALID: (isValid) => {
            this.validations.shippingForm = isValid;
        },
    
        SHIPPING_METHOD: (val) => {
            this.shippingMethod = val;
        },
    
        RESET: () => {
            let s = getInitialState();

            Object.keys(s).forEach((key) => {
                this[key] = s[key];
            })
        }
    },

    getters: {
        // subTypes: (state) => {
        //     return state.subTypes;
        // }
    },
});

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useCheckoutStore, import.meta.hot))
}
