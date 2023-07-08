
import { useFetch, useRuntimeConfig } from "#app";

/*
* Nuxt useFetch options: https://nuxt.com/docs/api/composables/use-fetch
*/
export const useApiFetch = (url, options = {}) => {
    const config = useRuntimeConfig();

    options.baseURL = config.public.apiBaseUrl;
    
    options.headers = {
        Authorization: `Basic ${config.public.apiBasicAuth}`,
        ...options.headers
    }

    // https://nuxt.com/docs/api/composables/use-fetch
    return useFetch(url, {
        // onRequest({ request, options }) {
        //     // Set the request headers
        // },
        // onRequestError({ request, options, error }) {
        //     // Handle the request errors
        // },
        // onResponse({ request, response, options }) {
        //     return response.data
        // },
        // onResponseError({ request, response, options }) {
        //     // Handle the response errors
        // },
        lazy: true,
        ...options
    });
}