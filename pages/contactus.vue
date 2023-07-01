<script>
export default {
    name: 'ContactUs'
}
</script> 

<script setup>
import { ref, reactive } from 'vue';
import { useI18n } from 'vue-i18n';
import { useVuelidate } from '@vuelidate/core';
import { required, email } from '@vuelidate/validators';
import ContentCard from '@/components/ContentCard.vue';
import {
    FigContent,
    FigLabelValueGroup,
    FigLabelValue,
    FigFormText,
    FigFormTextarea,
    FigButton,
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
const form = reactive({
    name: null,
    company: null,
    email: null,
    message: null,
});

const validatiorRules = computed(() => {
    return {
        name: { required },
        email: { required, email },
        message: { required },
    }
})
const v$ = useVuelidate(validatiorRules, form);

async function onSubmit() {
    try {
        loading.value = true;

        //TODO
        // await this.$api.tenant.contactUs(this.form);

        showSuccess.value = true;
        form.name = null;
        form.company = null;
        form.email = null;
        form.message = null;
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
                    <div class="text-left">
                        <fig-label-value-group density="lg" block>
                            <!-- Your name -->
                            <fig-label-value required>
                                <template v-slot:label>{{ $t('Your name') }}:</template>

                                <fig-form-text
                                    v-model="form.name"
                                    maxlength="100"
                                    @update:modelValue="v$.$touch()" />
                                <template v-slot:error v-if="v$.name.$dirty && !v$.name.required">{{ $t('required') }}</template>
                            </fig-label-value>

                            <!-- Company -->
                            <fig-label-value>
                                <template v-slot:label>{{ $t('Company') }}:</template>

                                <fig-form-text
                                    v-model="form.company"
                                    maxlength="100" />
                            </fig-label-value>

                            <!-- Email -->
                            <fig-label-value required>
                                <template v-slot:label>{{ $t('Email') }}:</template>

                                <fig-form-text
                                    v-model="form.email"
                                    maxlength="100"
                                    @update:modelValue="v$.$touch()" />

                                <template v-slot:error v-if="v$.email.$dirty && v$.email.$invalid">
                                    <div v-if="v$.email.required.$invalid">{{ $t('required') }}</div>
                                    <div v-else-if="v$.email.email.$invalid">{{ $t('invalid email address format') }}</div>
                                </template>
                            </fig-label-value>

                            <!-- Message -->
                            <fig-label-value required>
                                <template v-slot:label>{{ $t('Message') }}:</template>
                                
                                <fig-form-textarea
                                    v-model="form.message"
                                    maxlength="10000"
                                    @update:modelValue="v$.$touch()" />

                                <template v-slot:error v-if="v$.name.$dirty && !v$.message.required">{{ $t('required') }}</template>
                            </fig-label-value>
                        </fig-label-value-group>

                        <div class="pt-5">
                            <fig-button
                                variant="primary"
                                @click="onSubmit"
                                :disabled="v$.$invalid > 0"
                                block
                                size="lg">{{ $t('Submit') }}</fig-button>
                        </div>
                    </div>
                </fig-overlay>
            </content-card>
        </template>

    </fig-content>
</template>
