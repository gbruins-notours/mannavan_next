<script>
export default {
    name: 'OrderId'
}
</script> 

<script setup>
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useUiStore } from '@/stores/ui';
import isObject from 'lodash-es/isObject.js';
import AppIcon from '@/components/AppIcon.vue';
import CartReceipt from '@/components/cart/CartReceipt.vue';
import {
    FigIcon,
    FigContent,
    FigSpinner
} from '@notoursllc/figleaf';

const { t } = useI18n();
const uiStore = useUiStore();
const route = useRoute();

const shippingEmail = ref(null);
const ready = ref(true);
// const ready = ref(false);

useHead({
    title: t('We have a winner!'),
    meta: [
        { name: 'description', content: t('Thanks for your order from {sitename}', {sitename: uiStore.siteName}) }
    ],
    link: [
        { rel: 'stylesheet', href: '/css/animations.css' }
    ]
});

function onCartFound(cart) {
    if(isObject(cart)) {
        shippingEmail.value = cart.shipping_email;
        ready.value = true;
    }
    else {
        shippingEmail.value = null;
        ready.value = false;
    }
}
</script>


<template>
    <div>
        <div v-if="!ready" class="py-10 flex justify-center">
            <fig-spinner :width="40" />
        </div>

        <template v-else>
            <header class="hero text-center">
                <div class="pt-7 pb-10">
                    <div class="flex items-center justify-center">
                        <div class="sway">
                            <app-icon 
                                icon="victory-peace" 
                                width="125px" />
                        </div>

                        <div class="text-center">
                            <div class="font-bold text-2xl md:text-4xl">{{ $t('Victory!') }}</div>
                            <div class="md:text-xl">{{ $t('We have received your order.') }}</div>
                        </div>
                    </div>
                </div>

                <div class="animation-wrapper center-position">
                    <div class="racecar">
                        <app-icon icon="race-car" />
                    </div>
                </div>

                <div class="dotted"></div>
            </header>

            <!-- email info -->
            <div class="text-center p-4 bg-gray-200">
                <div class="text-emerald-600">
                    <span class="text-base">{{ $t('An email confirmation was sent to:') }}</span>
                    <div class="flex justify-center">
                        <fig-icon
                            icon="mail"
                            :stroke-width="1"
                            :width="50"
                            :height="50" />
                    </div>
                    <div class="font-bold text-lg">
                        {{ shippingEmail }}
                    </div>
                </div>

                <div class="text-sm mt-1">({{ $t('Please allow a few minutes for email delivery.') }})</div>
            </div>
        </template>

        <!-- order details -->
        <fig-content size="lg" class="px-4">
            <cart-receipt
                :cart-id="route.params.id"
                @found="onCartFound" />
        </fig-content>
    </div>
</template>


<style scoped>
.center-position {
    position: absolute;
    left: 50%;
    -webkit-transform: translateX(-50%);
    -ms-transform: translateX(-50%);
    -moz-transform: translateX(-50%);
    -o-transform: translateX(-50%);
    transform: translateX(-50%);
}

.animation-wrapper {
    width: 700px;
    bottom: 0;
}

.dotted {
    position: absolute;
    bottom: -4px;
    left: 0;
    height: 1px;
    width: 100%;
    background: repeating-linear-gradient(
        to right,
        red,
        red 10px,
        #fff 10px,
        #fff 20px
    );
}

.racecar {
    position: absolute;
    bottom: -2px;
    display: block;
    opacity: 0;
    width: 90px;
    height: 26px;
    animation-name: victoryLap;
    animation-duration: 20s;
    animation-delay: .3s;
    animation-timing-function: ease;
    animation-iteration-count: infinite;
}

.hero {
    background: linear-gradient(#64a865, #74b675);
    position: relative;
    color: #fff;
    padding: 0;
    border-bottom: 4px solid #4f4f4f;
}

@keyframes victoryLap {
    0% {
        opacity: 0;
        left: -1080px;
    }
    2%,98% {
        opacity:1
    }
    /*
    40%,60% {
         left:30px;
    }
    */
    40%,60% {
        left:300px;
    }
    to {
        opacity:0;
        left:1780px;
    }
}
</style>
