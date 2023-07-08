import { storeToRefs } from 'pinia';
import isObject from 'lodash-es/isObject.js';
import { useApiFetch } from '@/composables/useApiFetch.js';

export default defineNuxtPlugin(async (nuxtApp) => {
    const cartStore = useCartStore();
    const { id: cartId } = storeToRefs(cartStore);

    const productStore = useProductStore();
    const uiStore = useUiStore();

    const promises = [
        useApiFetch('/master_types', {
            params: {
                object: 'product_type',
                published: true,
                _sort: 'ordinal:asc',
                // _page: 1,
                // _pageSize: 100
            }
        }),
        useApiFetch('/master_types', {
            params: {
                object: 'product_sub_type',
                published: true,
                _sort: 'ordinal:asc'
            }
        }),        
        useApiFetch('/product/accent_messages', {
            params: {
            }
        }),
        useApiFetch('/account/app_config', {
            params: {
            }
        }),
    ];

    if(cartId.value) {
        promises.push(
            useApiFetch('/cart', {
                params: {
                    id: cartId.value
                }
            })
        );
    }

    const [
        productTypes,
        productSubTypes,
        productAccentMessages,
        appConfig,
        cart
    ] = await Promise.all(promises);

    console.log("productTypes data", productTypes.data.value.data);
    console.log("productSubTypes data", productSubTypes.data.value.data);
    console.log("productAccentMessages data", productAccentMessages.data.value.data);
    console.log("appConfig data", appConfig.data.value.data);
    console.log("cart data", cart?.data);


    productStore.setProductTypes(productTypes.data.value?.data);
    productStore.setProductSubTypes(productSubTypes.data.value?.data);
    productStore.setProductSkuAccentMessages(productAccentMessages.data.value?.data);

    if(isObject(appConfig.data.value?.data)) {
        uiStore.$patch({
            appConfig: appConfig.data.value.data
        })
    }

    if(!cartId.value || !cart.data.value?.data) {
        cartStore.reset(); // https://pinia.vuejs.org/core-concepts/state.html#resetting-the-state
    }
    else {
        cartStore.$patch(cart.data.value?.data); // https://pinia.vuejs.org/core-concepts/state.html#mutating-the-state
    }
});
