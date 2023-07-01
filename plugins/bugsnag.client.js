import Bugsnag from '@bugsnag/js';
import BugsnagPluginVue from '@bugsnag/plugin-vue';

export default defineNuxtPlugin((nuxtApp) => {
    Bugsnag.start({
        apiKey: nuxtApp.$config.public.bugSnagApiKey,
        plugins: [new BugsnagPluginVue()],
        notifyReleaseStages: [ 'production' ]
    });

    const bugsnagVue = Bugsnag.getPlugin('vue')

    nuxtApp.vueApp.use(bugsnagVue);
    // nuxtApp.provide('bugsnag', Bugsnag);
    nuxtApp.bugsnag = Bugsnag;
});

