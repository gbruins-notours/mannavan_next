import { defineStore, acceptHMRUpdate } from 'pinia';
// import { persistedState } from '@pinia-plugin-persistedstate/nuxt';

export const useProductStore = defineStore('productStore', {
    state: () => ({
        types: {},
        subTypes: {},
        skuAccentMessages: {}
    }),

    actions: {
        setProductTypes(productTypes) {
            if(Array.isArray(productTypes)) {
                const types = {};

                productTypes.forEach((obj) => {
                    types[obj.name] = obj;
                });

                this.types = types;
                // console.log("TUPE", types, this.types)
            }
        },
    
        setProductSubTypes(data) {
            if(Array.isArray(data)) {
                const val = {};

                data.forEach((obj) => {
                    val[obj.name] = obj;
                });

                this.subTypes = val;
                // console.log("subTypes", val, this.subTypes)
            }
        },
    
        setProductSkuAccentMessages(accentMessages) {
            if(Array.isArray(accentMessages)) {
                const messages = {};

                accentMessages.forEach((obj) => {
                    messages[obj.id] = obj.message;
                });

                this.skuAccentMessages = messages;
            }
        }
    },

    // persist: {
    //     storage: persistedState.localStorage,
    // }
    persist: true
});

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useProductStore, import.meta.hot))
}
