(function () {
  function translateElements(dict, options) {
    const mode = options.mode || "html-breaks";
    const htmlKeys = new Set(options.htmlKeys || []);

    document.querySelectorAll("[data-i18n]").forEach((el) => {
      if (el.closest("#site-nav")) return;
      const key = el.getAttribute("data-i18n");
      const val = dict[key];
      if (!val) return;

      const useHtml = mode === "html-breaks" || htmlKeys.has(key);
      if (useHtml) {
        el.innerHTML = String(val).replace(/\n/g, "<br>");
      } else {
        el.textContent = String(val);
      }
    });
  }

  function applyAttrTranslations(dict) {
    document.querySelectorAll("[data-i18n-attr]").forEach((el) => {
      try {
        const map = JSON.parse(el.getAttribute("data-i18n-attr"));
        Object.entries(map).forEach(([attr, key]) => {
          if (dict[key]) el.setAttribute(attr, dict[key]);
        });
      } catch (err) {
        console.warn("Invalid data-i18n-attr JSON", err);
      }
    });
  }

  function init(config) {
    const {
      dict,
      titleKey = "page.title",
      mode = "html-breaks",
      htmlKeys = [],
      applyAttrs = true,
      onAfterSetLang,
    } = config;

    function setLang(lang) {
      const currentDict = dict[lang] || dict.en;

      translateElements(currentDict, { mode, htmlKeys });
      if (applyAttrs) applyAttrTranslations(currentDict);

      if (currentDict[titleKey]) document.title = currentDict[titleKey];
      document.documentElement.setAttribute("lang", lang);
      window.NFDSite.applyCommonUi(lang, currentDict);

      if (typeof onAfterSetLang === "function") {
        onAfterSetLang(lang, currentDict);
      }
    }

    window.NFDSite.bindLanguageButtons(setLang);
    setLang(window.NFDSite.detectInitialLang());

    return { setLang };
  }

  window.NFDSiteI18n = {
    init,
    translateElements,
    applyAttrTranslations,
  };
})();
