import { defineStore, acceptHMRUpdate } from 'pinia';
import { ref } from 'vue';

export const useProductStore = defineStore('productStore', () => {
    const types = ref({});
    const subTypes = ref({});
    const skuAccentMessages = ref({});

    function setProductTypes(productTypes) {
        if(Array.isArray(productTypes)) {
            const t = {};

            productTypes.forEach((obj) => {
                t[obj.name] = obj;
            });

            types.value = t;
        }
    }

    function setProductSubTypes(data) {
        if(Array.isArray(data)) {
            const val = {};

            data.forEach((obj) => {
                val[obj.name] = obj;
            });

            subTypes.value = val;
        }
    }

    function setProductSkuAccentMessages(accentMessages) {
        if(Array.isArray(accentMessages)) {
            const messages = {};

            accentMessages.forEach((obj) => {
                messages[obj.id] = obj.message;
            });

            skuAccentMessages.value = messages;
        }
    }

    return {
        types,
        subTypes,
        skuAccentMessages,
        setProductTypes,
        setProductSubTypes,
        setProductSkuAccentMessages
    }

}, { persist: true });


if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useProductStore, import.meta.hot))
}
