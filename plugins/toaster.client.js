import { FigToastPlugin } from '@notoursllc/figleaf';

export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.figSuccessToast = FigToastPlugin.successToast;
    nuxtApp.figErrorToast = FigToastPlugin.errorToast;
    nuxtApp.figToast = FigToastPlugin.toast;
    nuxtApp.figClearToasts = FigToastPlugin.clearToasts;
});

