import { FigToastPlugin } from '@notoursllc/figleaf';

export default defineNuxtPlugin((nuxtApp) => {
    FigToastPlugin.install(nuxtApp.vueApp);
});

