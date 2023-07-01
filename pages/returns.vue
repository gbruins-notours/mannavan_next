<script>
export default {
    name: 'Returns'
}
</script> 

<script setup>
import { useRuntimeConfig } from "#app";
import { useI18n } from 'vue-i18n';
import { useUiStore } from '@/stores/ui';
import PageTitle from '@/components/PageTitle';
import ContentCard from '@/components/ContentCard.vue';
import {
    FigContent,
    FigAddress
} from '@notoursllc/figleaf';

const { t } = useI18n();
const uiStore = useUiStore();
const config = useRuntimeConfig();

useHead({
    title: t('Returns / Exchanges'),
    meta: [
        { name: 'description', content: t('Returns and Exchanges for your order at {sitename}', {sitename: uiStore.siteName}) }
    ]
});
</script>


<template>
    <fig-content size="lg">
        <page-title>{{ $t('Returns / Exchanges') }}</page-title>

        <content-card>
            {{ $t('returns_help')}}

            <div class="mt-6">
                <div class="font-bold">{{ $t('To return an item:')}}</div>

                <ol class="mt-4 orderedList">
                    <li>{{ $t('Include a copy of the packing slip or confirmation email from your order.') }}</li>
                    <li>
                        <div class="pb-1 pt-2 font-semibold">{{ $t('Mail your return to:') }}</div>
                        <div class="bg-white rounded px-6 py-2 inline-block">
                            <fig-address
                                :company="config.public.shippingFromCompany"
                                :street-address="config.public.shippingFromAddress1"
                                :city="config.public.shippingFromCity"
                                :state="config.public.shippingFromState"
                                :zip="config.public.shippingFromZip + ''"
                                :country-code="config.public.shippingFromCountryCode" />
                        </div>
                    </li>
                    <li>{{ $t('We will issue your refund when the return is received.') }}</li>
                </ol>
            </div>

            <div class="mt-6">
                <h2 class="font-bold">{{ $t('Questions?') }}</h2>
                <div><a :href="`mailto:${uiStore.infoEmailAddress}`">{{ uiStore.infoEmailAddress }}</a></div>
            </div>
        </content-card>
    </fig-content>
</template>

<style scoped>
.orderedList {
    margin: 0 20px;
}
.orderedList li {
    padding-left: 10px;
    margin-bottom: 10px;
}
</style>


