
import { useFetch, useRuntimeConfig } from "#app";


export const useAPIFetch = (path, options = {}) => {
    const config = useRuntimeConfig();

    // modify options as needed
    options.baseURL = config.public.apiBaseUrl;

    // https://nuxt.com/docs/api/composables/use-fetch
    return useFetch(path, {
        // onRequest({ request, options }) {
        //     // Set the request headers
        // },
        // onRequestError({ request, options, error }) {
        //     // Handle the request errors
        // },
        onResponse({ request, response, options }) {
            return response.data
        },
        // onResponseError({ request, response, options }) {
        //     // Handle the response errors
        // },
        lazy: true,
        ...options
    })
}