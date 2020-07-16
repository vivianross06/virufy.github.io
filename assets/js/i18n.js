var i18nManager = function(updateContent) {
    i18next
        .use(i18nextXHRBackend)
        .use(i18nextBrowserLanguageDetector)
        .init({
            fallbackLng: 'en',
            debug: true,
            backend: {
            loadPath: 'locales/{{lng}}/{{ns}}.json',
            crossDomain: false
            }
        }, function(err, t) {
            jqueryI18next.init(i18next, $);
            updateLanguageToggleSelectOnLoad();          
            updateContent();
            
            i18next.on('languageChanged', () => {
                updateContent();
            });
        });
}

$('#language-toggle-select').on('change', function() {
    let language = this.value;
    i18next.changeLanguage(language);
})

function updateLanguageToggleSelectOnLoad() {
    $('#language-toggle-select').val(i18next.language);
}