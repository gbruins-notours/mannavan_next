import { defineStore, acceptHMRUpdate } from 'pinia';
import { ref } from 'vue';


export const useCheckoutStore = defineStore('checkoutStore', () => {
    
    const shippingFormIsValid = ref(false);
    const shippingMethod = ref('1');

    return {
        shippingFormIsValid,
        shippingMethod
    }

}, { persist: true });


if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useCheckoutStore, import.meta.hot))
}
