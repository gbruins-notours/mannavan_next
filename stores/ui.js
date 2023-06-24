import { defineStore, acceptHMRUpdate } from 'pinia';

export const useUiStore = defineStore('uiStore', {
    persist: true,

    state: () => ({
        sidebarOpened: true,
        isMobile: false,
        locales: ['en'],
        locale: 'en',
        infoEmailAddress: `info@${process.env.DOMAIN_NAME}`,
        brandName: 'BreadVan',
        siteName: process.env.DOMAIN_NAME,
        siteUrlLong: process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : `https://www.${process.env.DOMAIN_NAME}`,
        siteUrlShort: process.env.NODE_ENV === 'development' ? 'localhost:3000' : `www.${process.env.DOMAIN_NAME}`,
        twitterUser: 'gmnstLife',
        appConfig: {},
        exchange_rates: {},
    }),

    getters: {
    },

    actions: {
        openSidebar () {
            this.sidebarOpened = true;
        },
    
        closeSidebar () {
            this.sidebarOpened = false;
        },
    
        toggleSidebar () {
            this.sidebarOpened = !this.sidebarOpened;
        },
    
        windowResize () {
            const { innerWidth } = window;
            const isDesktop = innerWidth > 1024;
            this.isMobile = !isDesktop;
            this.sidebarOpened = isDesktop;
        }
    }
});

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useUiStore, import.meta.hot))
}
