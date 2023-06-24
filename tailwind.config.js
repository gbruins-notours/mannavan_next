// https://tailwindcss.nuxtjs.org/tailwind-config/#default-configuration
import figleafTailwindConfig from '@notoursllc/figleaf/src/tailwind.config.js';

// Add our own paths:
figleafTailwindConfig.content.push(
    './components/**/*.{js,vue}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './plugins/**/*.js',
    './nuxt.config.js',
    'node_modules/@notoursllc/figleaf/src/components/**/*.{js,vue}',
    'node_modules/@notoursllc/figleaf/src/layouts/**/*.vue'
);

export default {
    ...figleafTailwindConfig
};
