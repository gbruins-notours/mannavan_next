<script>
/*
* This component was heavily inspired by watching this video:
* https://www.youtube.com/watch?v=vk69GJUM3Mc
*/
export default {
    name: 'ProductImageSlider'
}
</script> 

<script setup>
import { ref, reactive, computed, watch, onMounted } from 'vue';
import { vOnKeyStroke } from '@vueuse/components';
import throttle from 'lodash.throttle';
import {
    FigNuxtImgBunny,
    FigIcon
} from '@notoursllc/figleaf';

const props = defineProps({
    product: {
        type: Object,
        default: () => {
            return {};
        }
    },

    variantId: {
        type: String,
        default: null
    },

    slideshowDisabledWidth: {
        type: Number,
        default: 1024
    },

    /**
     * Throttle delay in milliseconds
     */
    throttleDelay: {
        type: Number,
        default: 500
    }
});

const currentIndex = ref(0);
const widthWindow = ref(0);
const showFullscreen = ref(false);
const pics = ref([]);
const touch = reactive({
    startX: 0,
    endX: 0
});

const slideshowDisabled = computed(() => {
    return widthWindow.value > props.slideshowDisabledWidth;
});

const slideUlStyle = computed(() => {
    return !slideshowDisabled.value
        ? { width: countSlides.value * 100 + '%' }
        : { display: 'flex', 'flex-grow': '1', 'flex-wrap': 'wrap', 'justify-content': 'space-between', 'align-items': 'flex-start' };
});

const slideLiStyle = computed(() => {
    return !slideshowDisabled.value
        ? { transform: 'translateX(-' + (currentIndex.value * 100) + '%)', width: countSlides.value * 100 + '%' }
        : { width: '50%', display: 'flex' };
});

const countSlides = computed(() => {
    return pics.value.length;
});

const canGoToPrev = computed(() => {
    return !slideshowDisabled.value && currentIndex.value > 0;
});

const canGoToNext = computed(() => {
    return !slideshowDisabled.value && currentIndex.value < countSlides.value - 1;
});

function goTo(index) {
    currentIndex.value = index;
}

const goTo = throttle((index) => {
    currentIndex.value = index;
}, props.throttleDelay)

const getWidth = throttle(() => {
    widthWindow.value = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
}, 500);

function goToNext() {
    if (canGoToNext.value) {
        goTo(currentIndex.value + 1);
    }
}

function goToPrev() {
    if (canGoToPrev.value) {
        goTo(currentIndex.value - 1);
    }
}

function onTouchStart(e) {
    touch.startX = e.touches[0].clientX;
    touch.endX = 0;
}

function onTouchMove(e) {
    touch.endX = e.touches[0].clientX;
}

function onTouchEnd() {
    // a swipe distance of more than 20 pix is needed in order to move the
    // slides, otherwise it's too sensitive
    if(!touch.endX || Math.abs(touch.endX - touch.startX) < 20) {
        return;
    }

    if(touch.endX < touch.startX) {
        goToNext();
    }
    else {
        goToPrev();
    }
}

function onSlidesClick(e) {
    // Only display full screen on desktop.
    // Pics are already full screen in mobile devices.
    if (slideshowDisabled.value) {
        showFullscreen.value = true;
        document.body.style.overflow = 'hidden';
    }
}

function onFullScreenCloseClick() {
    showFullscreen.value = false;
    document.body.style.overflow = '';
}

function getVariantImages(variantId) {
    let images = [];

    if(Array.isArray(props.product.variants)) {
        props.product.variants.forEach((variant) => {
            if(variant.id === variantId && Array.isArray(variant.images)) {
                images = variant.images;
            }
        });
    }

    return images;
}

onMounted(() => {
    getWidth();
    window.addEventListener('resize', getWidth);
});

watch(
    () => props.variantId,
    (newVal) => {
        if(newVal) {
            pics.value = getVariantImages(newVal);
        }
    },
    { immediate: true }
)
</script>


<template>
    <div
        class="slider-list"
        :class="{'slider-disabled': slideshowDisabled}"
        @touchstart="onTouchStart"
        @touchmove="onTouchMove"
        @touchend="onTouchEnd">
        <ul
            :style="slideUlStyle"
            @click="onSlidesClick">
            <li
                v-for="(obj, index) in pics"
                :key="index"
                :style="slideLiStyle">
                <div class="relative overflow-hidden">
                    <fig-nuxt-img-bunny
                        v-if="obj.url"
                        :src="obj.url"
                        :alt="obj.alt_text"
                        loading="eager"
                        sizes="lg:550px md:400px"
                        class="w-full" />
                </div>
            </li>
        </ul>

        <!-- previous button -->
        <button
            ref="prevButton"
            class="slider-nav-btn slider-nav-btn-prev"
            v-show="canGoToPrev"
            type="button"
            @click="goToPrev()">
            <div class="icon">
                <fig-icon
                    icon="chevron-left"
                    :width="24"
                    :height="24"
                    stroke-color="#000" />
            </div>
        </button>

        <!-- next button -->
        <button
            ref="nextButton"
            class="slider-nav-btn slider-nav-btn-next"
            v-show="canGoToNext"
            type="button"
            @click="goToNext()">
            <div class="icon">
                <fig-icon icon="chevron-right" width="24" height="24" />
            </div>
        </button>

        <!-- dots -->
        <div class="slider-nav-dots-container">
            <div class="flex justify-between">
                <ul
                    ref="dots"
                    class="slider-nav-dots">
                    <li
                        v-for="n in countSlides"
                        :key="n"
                        class="slider-nav-dot"
                        :class="{'slider-nav-dot-current': n - 1 === currentIndex}">
                        <button
                            type="button"
                            @click="goTo(n - 1)"></button>
                    </li>
                </ul>
            </div>
        </div>

        <!-- full screen -->
        <div
            class="slider-fullscreen"
            v-if="showFullScreen.value"
            v-on-key-stroke:esc="onFullScreenCloseClick">
            <div
                v-for="(obj, index) in pics"
                :key="index"
                class="mb-2">
                <fig-nuxt-img-bunny
                    v-if="obj.url"
                    :src="obj.url"
                    :alt="obj.alt_text"
                    preset="w1280"
                    :loading="index > 1 ? 'lazy' : 'eager'" />
            </div>

            <button
                type="button"
                class="slider-fullscreen-close"
                :aria-label="$t('Close')"
                @click="onFullScreenCloseClick">
                <fig-icon icon="x" width="24" height="24" />
            </button>
        </div>

    </div>
</template>

<style scoped>
.slider-list {
    @apply relative pb-1;
}
.slider-list > ul {
    @apply list-none flex;
}
.slider-list > ul li {
    @apply p-1;
    transition: all .5s ease;
}

.slider-nav-btn {
    @apply border-0 cursor-pointer h-full absolute top-0 flex items-center justify-center;
    background: none;
    width: 90px;
}
.slider-nav-btn[disabled]{
    @apply cursor-not-allowed;
}
.slider-nav-btn[disabled]:hover {
    background: none;
}
.slider-nav-btn[disabled] svg {
    stroke: rgb(159, 159, 159) !important;
}
.slider-nav-btn-prev {
    @apply left-0;
}
.slider-nav-btn-prev svg {
    margin-left: -2px;
}
.slider-nav-btn-next {
    @apply right-0;
}
.slider-nav-btn-next svg {
    margin-right: -2px;
}
.slider-nav-btn .icon {
    @apply rounded-full flex items-center justify-center;
    background: rgba(255,255,255,.8);
    height: 40px;
    width: 40px;
}

.slider-nav-dots-container {
    @apply absolute w-full pb-2;
    bottom: 0;
}
.slider-nav-dots {
    @apply flex items-center list-none whitespace-nowrap relative p-0 py-2 m-0;
    left: 50%;
    transform: translateX(-50%);
}
.slider-nav-dot {
    @apply mx-2 my-0;
}
.slider-nav-dot button {
    @apply bg-transparent border border-white rounded-full cursor-pointer block m-0 p-0;
    height: 10px;
    width: 10px;
    font-size: 0;
    line-height: 0;
    transition-duration: .3s;
}

.slider-nav-dot button:hover,
.slider-nav-dot-current button {
    @apply bg-white;
}

.slider-disabled {
    @apply flex flex-wrap justify-between items-start p-0 pt-2 pl-2;
}
.slider-disabled > ul li {
    @apply cursor-pointer;
}
.slider-disabled .slider-nav-dots-container,
.slider-disabled .slider-nav-btn {
    @apply hidden;
}

.slider-fullscreen {
    @apply fixed inset-0 z-10 bg-white overflow-y-scroll;
}
.slider-fullscreen-close {
    @apply border-0 fixed cursor-pointer p-5 rounded-md;
    background: rgba(255,255,255,.7);
    top: 10px;
    right: 25px;
}
.slider-fullscreen img {
    @apply w-full;
    max-width: initial;
}
</style>

