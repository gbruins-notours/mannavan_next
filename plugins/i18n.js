import { createI18n } from 'vue-i18n';
import { FigUseI18n } from '@notoursllc/figleaf';

export default defineNuxtPlugin(({ vueApp }) => {

    async function loadLocaleMessages() {
        const locales = import.meta.glob('../locales/*.js');
        const messages = {};

        for(const path in locales) {
            const matched = path.match(/([A-Za-z0-9-_]+)\./i);

            if(matched && matched.length > 1) {
                const locale = matched[1];

                const lang = await locales[path]();
                messages[locale] = lang.default;
            }
        }

        return messages;
    }

    const { numberFormats, dateTimeFormats } = FigUseI18n();

    const i18n = createI18n({
        legacy: false,
        globalInjection: true,
        locale: 'en',
        fallbackLocale: 'en',
        messages: loadLocaleMessages(),
                    
        // http://kazupon.github.io/vue-i18n/en/datetime.html
        dateTimeFormats: dateTimeFormats,

        // http://kazupon.github.io/vue-i18n/en/number.html
        numberFormats: numberFormats
    });

    vueApp.use(i18n);
});
