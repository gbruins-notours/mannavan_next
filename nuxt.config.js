import * as dotenv from 'dotenv';
import path from 'path';
import { presets } from '@notoursllc/figleaf/src/components/nuxtImgBunny/bunnyProvider.js';
const isDev = process.env.NODE_ENV === 'development';

if(isDev) {
    dotenv.config();
}

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    ssr: true,

    devtools: {
        enabled: true
    },

    alias: {
        // '@': path.resolve(__dirname, '/'),
        assets: '<rootDir>/assets</rootDir>',
    },

    runtimeConfig: {
        public: {
            // TODO: deprecate this one and use apiBaseUrl instead
            axios: {
                browserBaseURL: process.env.API_URL
            },
            
            apiBaseUrl: process.env.API_URL,
            apiBasicAuth: Buffer.from(`${process.env.TENANT_ID}:${process.env.TENANT_API_KEY}`).toString('base64'),
            bugSnagApiKey: process.env.BUG_SNAG_API_KEY,
            cookieSecure: process.env.COOKIE_SECURE || false,
            domainName: process.env.DOMAIN_NAME,
            emailInfo: process.env.EMAIL_INFO,
    
            nodeEnv: process.env.NODE_ENV,
            nodeEnvIsDev: isDev,
            nodeEnvIsProd: process.env.NODE_ENV === 'production',
    
            shippingFromAddress1: process.env.SHIPPING_ADDRESS_FROM_ADDRESS1,
            shippingFromCity: process.env.SHIPPING_ADDRESS_FROM_CITY,
            shippingFromCompany: process.env.SHIPPING_ADDRESS_FROM_COMPANY,
            shippingFromCountryCode: process.env.SHIPPING_ADDRESS_FROM_COUNTRY_CODE,
            shippingFromPhone: process.env.SHIPPING_ADDRESS_FROM_PHONE,
            shippingFromState: process.env.SHIPPING_ADDRESS_FROM_STATE,
            shippingFromZip: process.env.SHIPPING_ADDRESS_FROM_ZIP,
            shippingAddressMaxValidationAttempts: process.env.SHIPPING_ADDRESS_MAX_VALIDATION_ATTEMPTS,
            shippinEstimateArrivalStartIncrement: process.env.SHIPPING_ESTIMATE_ARRIVAL_START_INCREMENT,
            shippingEstimateArrivalEndRange: process.env.SHIPPING_ESTIMATE_ARRIVAL_END_RANGE,
    
            // this needs to be public because it's used by axios plugin
            tenantId: process.env.TENANT_ID,
            tenantApiKey: process.env.TENANT_API_KEY,
    
            stripePublishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
            locale: process.env.LOCALE
        }
    },

    /*
    ** Headers
    ** Common headers are already provided by @nuxtjs/pwa preset
    */
    app: {
        head: {
            title: 'Breadvan',
            meta: [
                { charset: 'utf-8' },
                { name: 'viewport', content: 'width=device-width, initial-scale=1' },
                { hid: 'description', name: 'description', content: 'You wear what you are.  Breadvan faith based apparel.' }
            ],
            link: [
                { rel: 'icon', type: 'image/x-icon', href: '/images/favicon.ico' }
            ],
            script: [
                // NOTE: Putting this in the head() of the cart/checkout/index.vue file, instead of here,
                // causes this to be loaded only for that route.  That's a good thing, but it caused a race
                // condition resulting in a javascript error: SqPaymentForm is not defined
                // That's because the CheckoutSectionPayment component, which uses SqPaymentForm, sometimes
                // loads before the head() script is loaded.
                // Putting it here doesn't seem ideal, but it's safest.
                // {
                //     src: isDev ? 'https://js.squareupsandbox.com/v2/paymentform' : 'https://js.squareup.com/v2/paymentform',
                //     body: true,
                //     async: true
                // }
            ]
        }
    },

    telemetry: false,

    // plugins: [
    //     '@/plugins/bugsnag.client.js',
    //     '@/plugins/api.js',
    //     '@/plugins/i18n.js',
    //     '@/plugins/global-properties',
    //     '@/plugins/toaster.client.js',
    // ],

    modules: [
        '@nuxtjs/tailwindcss', // https://tailwindcss.nuxtjs.org/getting-started/setup
        '@nuxt/image', // https://v1.image.nuxtjs.org/get-started
        '@nuxt/devtools', // https://devtools.nuxtjs.org/guide
        '@vite-pwa/nuxt',
        '@pinia/nuxt',
        '@pinia-plugin-persistedstate/nuxt'
    ],

    // https://tailwindcss.nuxtjs.org/getting-started/options/
    tailwindcss: {
        cssPath: '@/node_modules/@notoursllc/figleaf/src/assets/css/tailwind.css',
        configPath: 'tailwind.config',
        exposeConfig: false,
        // config: {},
        injectPosition: 0,
        viewer: true,
    },

    // https://prazdevs.github.io/pinia-plugin-persistedstate/frameworks/nuxt-3.html#global-options
    piniaPersistedstate: {
        cookieOptions: {
            sameSite: 'strict'
        },
        storage: 'cookies', // needs to be cookies because of SSR.  'localStorage' and 'sessonStorage' are client-side only
        debug: isDev
    },

    // Nuxt image config
    // https://image.nuxtjs.org/configuration
    image: {
        providers: {
            customProvider: {
                name: 'bunny',
                provider: '@/node_modules/@notoursllc/figleaf/src/components/nuxtImgBunny/bunnyProvider.js',
                baseURL: 'https://bv-pullzone-1.b-cdn.net',
            }
        },
        // The screen sizes predefined by `@nuxt/image`:
        screens: {
            xs: 320,
            sm: 640,
            md: 768,
            lg: 1024,
            xl: 1280,
            xxl: 1536,
            '2xl': 1536
        },
        presets: {
            ...presets
        }
    },

    // PWA module configuration: 
    // https://go.nuxtjs.dev/pwa
    // https://vite-pwa-org.netlify.app/frameworks/nuxt.html
    pwa: {
        manifest: {
            // lang: 'en'
            lang: 'en-US'
        }
    },

    imports: {
        dirs: ['./stores'],
    },
    
    pinia: {
        autoImports: ['defineStore', 'acceptHMRUpdate'],
    },

    /*
    ** Global CSS
    */
    css: [
        '@/assets/css/base.css',
        '@/node_modules/@notoursllc/figleaf/src/assets/css/tailwind.css'
    ],

    // build: {
    //     transpile: [
    //         '@notoursllc/figleaf',
    //         'date-fns',
    //         'date-fns-tz',
    //         'youtube-player'
    //     ]
    // },

    // https://nuxt.com/docs/api/configuration/nuxt-config#vite
    vite: {
        optimizeDeps: {
            include: [
                '@notoursllc/figleaf',
                'date-fns',
                'date-fns-tz',
                'youtube-player'
            ]
        }
    },

    pageTransition: {
        name: 'fade',
        mode: 'out-in'
    },

    /*
    ** Customize the progress-bar color
    */
    loading: {
        color: '#67c23a',
        height: '4px',
        duration: 5000
    },

})
