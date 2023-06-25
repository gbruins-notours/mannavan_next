import isObject from 'lodash-es/isObject.js';


export default defineNuxtPlugin(async (nuxtApp) => {
    const cartStore = useCartStore();
    const productStore = useProductStore();
    const uiStore = useUiStore();

    const promises = [
        nuxtApp.$api.masterType.list({
            object: 'product_type',
            published: true,
            _sort: 'ordinal:asc'
        }),
        nuxtApp.$api.masterType.list({
            object: 'product_sub_type',
            published: true,
            _sort: 'ordinal:asc'
        }),
        nuxtApp.$api.product.accentMessage.list(),
        nuxtApp.$api.account.appConfig()
    ];

    if(cartStore.id) {
        promises.push(
            nuxtApp.$api.cart.get({
                id: cartStore.id
            })
        );
    }

    const [
        productTypes,
        productSubTypes,
        productAccentMessages,
        appConfig,
        shoppingCart
    ] = await Promise.all(promises);

    productStore.setProductTypes(productTypes?.data);
    productStore.setProductSubTypes(productSubTypes?.data);
    productStore.setProductSkuAccentMessages(productAccentMessages?.data);

    // console.log("APP CONFIG", appConfig.data.exchange_rates);

    if(isObject(appConfig?.data)) {
        uiStore.$patch(appConfig.data);
    }

    if(!cartStore.id || !shoppingCart?.data) {
        cartStore.reset(); // https://pinia.vuejs.org/core-concepts/state.html#resetting-the-state
    }
    else {
        cartStore.$patch(shoppingCart?.data); // https://pinia.vuejs.org/core-concepts/state.html#mutating-the-state
    }
});
