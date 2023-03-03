import locales from '../i18n/index.js';

const defaultLocale = 'de';

function sprintf(format, args) {
    return format?.replace(/{(\d+)}/g, function (match, number) {
        return typeof args[number] != 'undefined' ? args[number] : match;
    });
};

function translate(key, args, locale)  {
    return sprintf(locales?.[locale]?.[key], args) ?? sprintf(locales?.[defaultLocale]?.[key], args) ?? key;
};

export function useI18n(locale) {
    return {
        $t: (key, args) => translate(key, args, locale),
    };
};
