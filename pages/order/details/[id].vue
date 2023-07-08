<script>
export default {
    name: 'OrderDetails'
}
</script> 

<script setup>
import { storeToRefs } from 'pinia';
import { useI18n } from 'vue-i18n';
import { useUiStore } from '@/stores/ui';
import CartReceipt from '@/components/cart/CartReceipt';
import PageTitle from '@/components/PageTitle';
import { FigContent } from '@notoursllc/figleaf';

const { t } = useI18n();
const route = useRoute();

const uiStore = useUiStore();
const { siteName } = storeToRefs(uiStore);

useHead({
    title: t('Order Details'),
    meta: [
        { name: 'description', content: t('Order details for your order from {sitename}', {sitename: siteName.value}) }
    ]
});
</script>


<template>
    <fig-content size="lg">
        <page-title>{{ $t('Order Details') }}</page-title>

        <cart-receipt
            :cart-id="route.params.id" />
    </fig-content>
</template>



