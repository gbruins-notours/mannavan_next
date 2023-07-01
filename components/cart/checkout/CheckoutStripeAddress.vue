<script>
export default {
    props: {
        stripe: {
            type: Object,
            required: true
        }
    },

    data: function() {
        return {
        };
    },

    beforeDestroy () {
        for(const name in this.elements) {
            this.elements[name].destroy();
        }
    },

    methods: {
        async init() {
            const elements = this.stripe.elements({
                loader: 'always',
                // locale: '' // https://edge.stripe.com/docs/js/appendix/supported_locales?type=cvc_update
                appearance: {
                    // theme: 'stripe',
                    // variables: {
                    //     colorPrimary: '#0570de',
                    //     colorBackground: '#ffffff',
                    //     colorBackgroundDeemphasize10: 'red',
                    //     colorText: '#30313d',
                    //     colorDanger: '#df1b41',
                    //     fontFamily: 'Ideal Sans, system-ui, sans-serif',
                    //     spacingUnit: '4px',
                    //     borderRadius: '4px',
                    // }
                    theme: 'none',
                    rules: {
                        '.Tab': {
                            border: '1px solid #E0E6EB',
                            boxShadow: '0px 1px 1px rgba(0, 0, 0, 0.03), 0px 3px 6px rgba(18, 42, 66, 0.02)',
                        },

                        '.Tab:hover': {
                            color: 'var(--colorText)',
                        },

                        '.Tab--selected': {
                            borderColor: '#E0E6EB',
                            boxShadow: '0px 1px 1px rgba(0, 0, 0, 0.03), 0px 3px 6px rgba(18, 42, 66, 0.02), 0 0 0 2px var(--colorPrimary)',
                        },

                        '.Input': {
                            border: '1px solid #cccccc',
                            borderRadius: '2px',
                        },
                        '.Input--invalid': {
                            boxShadow: '0 1px 1px 0 rgba(0, 0, 0, 0.07), 0 0 0 2px var(--colorDanger)',
                        },
                    }
                }
            });

            // https://stripe.com/docs/js/elements_object/create_address_element#address_element_create-options
            const addressElement = elements.create('address', {
                mode: 'shipping',
                autocomplete: {
                    mode: 'automatic'
                },
                blockPoBox: true,
                fields: {
                    phone: 'always',
                    // email: 'always',
                },
                validation: {
                    phone: {
                        required: 'always',
                    },
                    // email: {
                    //     required: 'always',
                    // },
                },
                display: {
                    name: 'split'
                }
            });

            addressElement.mount("#address-element");

            addressElement.on('change', (event) => {
                if (event.complete){
                    // Extract potentially complete address
                    const address = event.value.address;
                    console.log("ADDRESS COMPLETE", event.value)
                }
            })
        }
    },

    watch: {
        stripe: {
            handler(newVal) {
                if(newVal) {
                    this.init();
                }
            },
            immediate: true
        }
    },
};
</script>


<template>
    <div id="address-element"></div>
</template>
