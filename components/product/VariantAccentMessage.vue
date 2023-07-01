<script>
export default {
    name: 'VariantAccentMessage'
}
</script> 

<script setup>
import { computed } from 'vue';
import isObject from 'lodash-es/isObject.js';
import { isUuid4 } from '@/utils/common.js';
import { useProductStore } from '@/stores/product.js';

const props = defineProps({
    variant: {
        type: Object,
        default: () => {
            return {};
        }
    }
});

const productStore = useProductStore();

const accentMessage = computed(() => {
    const now = Date.now();
    let msg = null;

    if(isObject(props.variant) && props.variant.accent_message_id) {
        // if accent_message_id is a UUID then we need to get the actual
        // message from the list of all messages in Vuex

        if(isUuid4(props.variant.accent_message_id)) {
            msg = productStore.skuAccentMessages.value[props.variant.accent_message_id] || null;
        }
        else {
            msg = props.variant.accent_message_id;
        }

        if(!msg) {
            return null;
        }

        // checking for begin or end date display restrictions
        if(props.variant.accent_message_begin || props.variant.accent_message_end) {
            // if the begin time has not been reached yet
            // or the end time is in the past
            // then we can't set the message
            if( (props.variant.accent_message_begin && new Date(props.variant.accent_message_begin).getTime() > now)
                || (props.variant.accent_message_end && new Date(props.variant.accent_message_end).getTime() < now) ) {
                return null;
            }
        }
    }

    return msg;
});
</script>


<template>
    <span v-if="accentMessage">{{ accentMessage }}</span>
</template>
