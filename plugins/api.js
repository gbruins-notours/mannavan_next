import axios from 'axios';
import { Buffer } from 'buffer';

export default defineNuxtPlugin((nuxtApp) => {

    const encodedToken = Buffer.from(`${nuxtApp.$config.public.tenantId}:${nuxtApp.$config.public.tenantApiKey}`).toString('base64');

    const $axios = axios.create({
        baseURL: nuxtApp.$config.public.axios.browserBaseURL,
        headers: {
            common: {
                Authorization: `Basic ${encodedToken}`
            }
        }
    });

    const utils = {};

    // GET
    utils.get = (url, params) => {
        let config = null;

        if(params) {
            config = { params }
        }

        return $axios.get(url, config);
    };

    utils.$get = async (url, params) => {
        const response = await utils.get(url, params);
        return response?.data;
    };

    // POST
    utils.post = (url, params) => {
        return $axios.post(url, params);
    };

    utils.$post = async (url, params) => {
        const response = await utils.post(url, params);
        return response?.data;
    };


    // PUT
    utils.put = (url, params) => {
        return $axios.put(url, params);
    };

    utils.$put = async (url, params) => {
        const response = await utils.put(url, params);
        return response?.data;
    };


    // DELETE
    utils.delete = (url, params) => {
        let config = null;

        if(params) {
            config = { data: params } // sending params as request body (payload) instead of query string
        }

        return $axios.delete(url, config);
    };

    utils.$delete = async (url, params) => {
        const response = await utils.delete(url, params);
        return response?.data;
    };
    

    const api = {};

    api.account = {
        appConfig(){
            return utils.$get('/account/app_config')
        }
    };


    api.cart = {
        get(params) {
            return utils.$get('/cart', params)
        },

        item: {
            add(data) {
                return utils.$post('/cart/item', data);
            },

            update(data) {
                return utils.$put('/cart/item', data)
            },

            delete(params) {
                return utils.$delete('/cart/item', params);
            }
        },

        payment: {
            get(cartId) {
                return utils.$get('/cart/payment', {
                    id: cartId
                });
            },

            intent(cartId) {
                return utils.$post('/cart/payment/intent', {
                    id: cartId
                });
            }
        },

        shipping: {
            purchaseLabel(id) {
                return utils.$post('/cart/shipping/label', { id });
            },

            selectRate(cartId, rateId) {
                return utils.$post('/cart/shipping/rate', {
                    id: cartId,
                    rate_id: rateId || null
                });
            }
        }
    };


    api.hero = {
        list(params) {
            return utils.$get('/heros', params);
        }
    };


    api.masterType = {
        list(params) {
            return utils.$get('/master_types', params);
        }
    };


    api.product = {
        list(params) {
            // Example params object:
            // See BaseController.queryHelper() for all attributes
            // ============================
            // {
            // where: ['is_available', '=', true],
            // whereRaw: ['sub_type & ? > 0', [productTypeId]],
            // andWhere: [
            //     ['total_inventory_count', '>', 0]
            // ],
            // }
            return utils.$get('/products', params);
        },

        get(id, options) {
            return utils.$get('/product', {
                id,
                ...(isObject(options) ? options : {})
            });
        },

        accentMessage: {
            list(params) {
                return utils.$get('/product/accent_messages', params);
            }
        },

        variant: {
            get(id) {
                return utils.$get('/product/variant', {
                    id
                });
            },

            sku: {
                get(id) {
                    return utils.$get('/product/variant/sku', {
                        id
                    });
                }
            }
        }
    };


    api.tenant = {
        contactUs(params) {
            return utils.$post('/tenant/contactus', params);
        }
    };


    // nuxtApp.api = { ...api };
    nuxtApp.provide('api', { ...api });
    // nuxtApp.provide('$api', { ...api });

    // return {
    //     provide: {
    //         $api: { ...api }
    //     }
    // }

    /*
    context.$axios.onError(async (error) => {

    });
    */

});
