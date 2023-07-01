import isObject from 'lodash-es/isObject.js';

/**
 * The cover image is the first image in the variant images array
 *
 * @param {*} variant
 */
export const getProductVariantCoverImage = (variant) => {
    if(isObject(variant) && variant.images?.[0]?.url) {
        return variant.images[0];
    }
    return null;
};
