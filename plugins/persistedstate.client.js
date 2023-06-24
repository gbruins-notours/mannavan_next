import { createPersistedState } from 'pinia-plugin-persistedstate';

/*
* https://prazdevs.github.io/pinia-plugin-persistedstate-v2/frameworks/nuxt-3.html#client-side-persistence
*/
export default defineNuxtPlugin(nuxtApp => {
    nuxtApp.$pinia.use(createPersistedState())
});