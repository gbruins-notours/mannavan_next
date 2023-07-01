<script>
export default {
    name: 'CheckoutDeliveryEstimate'
}
</script> 

<script setup>
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { FigUseUtils } from '@notoursllc/figleaf';

const { t } = useI18n();
const runtimeConfig = useRuntimeConfig()
const utils = FigUseUtils();

const props = defineProps({
    arrivalDate: {
        type: String
    },

    serviceType: {
        type: String
    }
});

const estimateDisplay = computed(() => {
    const startPadding = utils.parseInt2(runtimeConfig.public.shippinEstimateArrivalStartIncrement, 0);
    const endPadding = utils.parseInt2(runtimeConfig.public.shippingEstimateArrivalEndRange, 4);

    // start day calculation
    let from = 1;
    if(props.arrivalDate) {
        from = utils.daysFromNow( new Date(props.arrivalDate) );

        if(from < 1) {
            from = 1;
        }
    }
    from += startPadding;

    // end day calculation
    const to = from + endPadding;
    if(to > from) {
        return t('{from}-{to} business days', {from, to});
    }

    return t('{num} business days', {num: from});
});
</script>

<template>
    <span>
        {{ estimateDisplay }}
        <span v-if="serviceType" class="pl-1">({{ serviceType }})</span>
    </span>
</template>
