import { defineStore, acceptHMRUpdate } from 'pinia';
import { ref } from 'vue';

export const useUiStore = defineStore('uiStore', () => {
    const sidebarOpened = ref(true);
    const isMobile = ref(false);
    const locales = ref(['en-US']);
    const locale = ref('en-US');
    const infoEmailAddress = ref(`info@${process.env.DOMAIN_NAME}`);
    const brandName = ref('BreadVan');
    const siteName = ref(process.env.DOMAIN_NAME);
    const siteUrlLong = ref(process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : `https://www.${process.env.DOMAIN_NAME}`);
    const siteUrlShort = ref(process.env.NODE_ENV === 'development' ? 'localhost:3000' : `www.${process.env.DOMAIN_NAME}`);
    const twitterUser = ref('gmnstLife');
    const appConfig = ref({});
    const exchange_rates = ref({});

    function openSidebar () {
        sidebarOpened.value = true;
    }

    function closeSidebar () {
        sidebarOpened.value = false;
    }

    function toggleSidebar () {
        sidebarOpened.value = !sidebarOpened.value;
    }

    function windowResize () {
        const { innerWidth } = window;
        const isDesktop = innerWidth > 1024;
        isMobile.value = !isDesktop;
        sidebarOpened.value = isDesktop;
    }

    return {
        sidebarOpened,
        isMobile,
        locales,
        locale,
        infoEmailAddress,
        brandName,
        siteName,
        siteUrlLong,
        siteUrlShort,
        twitterUser,
        appConfig,
        exchange_rates,
        openSidebar,
        closeSidebar,
        toggleSidebar,
        windowResize
    }
}, { persist: true });

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useUiStore, import.meta.hot))
}
