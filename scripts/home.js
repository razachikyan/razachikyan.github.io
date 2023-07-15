// Copyright logic
const $copyrightYear = document.querySelector("#copyright-year");
if ($copyrightYear) {
    const d = new Date();
    $copyrightYear.innerHTML = d.getFullYear().toString();
}
