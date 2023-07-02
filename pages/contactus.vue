<script>
export default {
    name: 'ContactUs'
}
</script> 

<script setup>
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import ContentCard from '@/components/ContentCard.vue';
import {
    FigContent,
    FigContactUsForm,
    FigOverlay,
    FigIcon
} from '@notoursllc/figleaf';

const { t } = useI18n();

useHead({
    title: t('Contact BreadVan'),
    meta: [
        { name: 'description', content: t('Contact BreadVan') }
    ]
});

const { 
    $bugsnag,
    $figErrorToast
} = useNuxtApp();

const loading = ref(false);
const showSuccess = ref(false);
const contactUsForm = ref(null);

async function onSubmit(data) {
    try {
        loading.value = true;

        //TODO
        // await this.$api.tenant.contactUs(this.form);

        showSuccess.value = true;
        contactUsForm.value.reset();
    }
    catch(err) {
        $figErrorToast({
            title: t('An error occurred')
        });
        console.error(err);
        $bugsnag.notify(err);
    }
    finally {
        loading.value = false;
    }
}
</script>


<template>
    <fig-content size="sm" class="pt-10">

        <!-- success message -->
        <template v-if="showSuccess">
            <div class="text-center">
                <div class="flex justify-center">
                    <fig-icon
                        icon="check-circle"
                        stroke-width="1.5"
                        width="80"
                        height="80"
                        variant="success" />
                </div>
                <div class="mt-1 text-2xl">{{ $t('Thank you!') }}</div>
                <div class="text-base">{{ $t("Your message has been sent.") }}</div>
            </div>
        </template>

        <!-- form -->
        <template v-else>
            <div class="flex items-start justify-center gap-6 mb-2">
                <fig-icon 
                    icon="mail" 
                    stroke-width="1px" 
                    width="80" 
                    height="80" />

                <div class="pt-1">
                    <div class="mt-1 text-2xl">{{ $t('We want to hear from you!') }}</div>
                    <div class="text-base">{{ $t("We'll get back to you within 1 business day.") }}</div>
                </div>
            </div>

            <content-card>
                <fig-overlay :show="loading">
                    <fig-contact-us-form 
                        ref="contactUsForm"
                        @submit="onSubmit" />
                </fig-overlay>
            </content-card>
        </template>

    </fig-content>
</template>
