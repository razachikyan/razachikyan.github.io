"use strict";

const checkLanguages = () => {
    // Get selected language
    const { searchParams: params } = new URL(document.location);
    const selectedLanguage = Object.values(AppLanguages).includes(params.get("lang")) ? params.get("lang") : AppLanguages.HY;
    document
        .querySelectorAll(`[data-lang]`)
        .forEach(e => e.classList.toggle("hidden-as-language", e.dataset["lang"] !== selectedLanguage));
};

window.addEventListener("load", checkLanguages);
