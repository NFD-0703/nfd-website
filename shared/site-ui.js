(function () {
  const COMMON_I18N = {
    en: {
      "nav.about": "About Us",
      "nav.services": "Services",
      "nav.ourwork": "Our Work",
      "nav.news": "News",
      "nav.careers": "Careers",
      "nav.careers.values": "Our Values",
      "nav.careers.jobs": "Careers",
      "nav.contact": "Contact",
    },
    ko: {
      "nav.about": "회사소개",
      "nav.services": "사업영역",
      "nav.ourwork": "주요 프로젝트",
      "nav.news": "뉴스",
      "nav.careers": "인재채용",
      "nav.careers.values": "인재상",
      "nav.careers.jobs": "인재채용",
      "nav.contact": "문의하기",
    },
  };

  function currentPage() {
    const path = window.location.pathname.split("/").pop();
    return path || "index.html";
  }

  function pageMeta(page) {
    const careersPages = new Set([
      "careers.html",
      "careers-values.html",
      "careers-estate-development.html",
      "careers-architect-engineer.html",
      "careers-csa-engineer.html",
      "careers-mechanical-electrical.html",
    ]);

    const meta = {
      theme: page === "index.html" ? "overlay" : "solid",
      activeTop: "",
      activeCareersItem: "",
    };

    if (page === "index.html") return meta;
    if (page === "aboutUs.html") meta.activeTop = "about";
    else if (
      [
        "services.html",
        "engineeringConsulting.html",
        "projectManager.html",
        "lease-management.html",
        "commissioning-agent.html",
        "facility-management.html",
        "integration.html",
      ].includes(page)
    ) {
      meta.activeTop = "services";
    } else if (
      ["our-work.html", "first-work.html", "second-work.html"].includes(page)
    ) {
      meta.activeTop = "ourwork";
    } else if (["news.html", "news-detail.html"].includes(page)) {
      meta.activeTop = "news";
    } else if (careersPages.has(page)) {
      meta.activeTop = "careers";
      meta.activeCareersItem =
        page === "careers-values.html" ? "values" : "jobs";
    } else if (page === "contact.html") {
      meta.activeTop = "contact";
    }

    return meta;
  }

  function renderNav() {
    const mount = document.getElementById("site-nav");
    if (!mount) return;

    const page = currentPage();
    const meta = pageMeta(page);
    const careersLabelKey =
      meta.activeCareersItem === "values"
        ? "nav.careers.values"
        : meta.activeCareersItem === "jobs"
          ? "nav.careers.jobs"
          : "nav.careers";

    document.body.dataset.page = page === "index.html" ? "index" : "default";

    mount.innerHTML = `
      <nav class="navbar navbar-expand-lg navbar-dark site-navbar site-navbar--${meta.theme}">
        <div class="container-fluid">
          <a class="navbar-brand fw-bold" href="index.html"> NFD </a>
          <button
            class="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse justify-content-end" id="navbarNav">
            <ul class="navbar-nav">
              <li class="nav-item">
                <a class="nav-link${meta.activeTop === "about" ? " active" : ""}" href="aboutUs.html" data-i18n="nav.about">About Us</a>
              </li>
              <li class="nav-item">
                <a class="nav-link${meta.activeTop === "services" ? " active" : ""}" href="services.html" data-i18n="nav.services">Services</a>
              </li>
              <li class="nav-item">
                <a class="nav-link${meta.activeTop === "ourwork" ? " active" : ""}" href="our-work.html" data-i18n="nav.ourwork">Our Work</a>
              </li>
              <li class="nav-item dropdown">
                <a
                  class="nav-link dropdown-toggle${meta.activeTop === "careers" ? " active" : ""}"
                  href="#"
                  id="careersDropdown"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                  data-i18n="${careersLabelKey}"
                  data-nav-role="careers"
                >${COMMON_I18N.en[careersLabelKey]}</a>
                <ul class="dropdown-menu dropdown-menu-dark" aria-labelledby="careersDropdown">
                  <li>
                    <a class="dropdown-item${meta.activeCareersItem === "values" ? " active" : ""}" href="careers-values.html" data-i18n="nav.careers.values">Our Values</a>
                  </li>
                  <li>
                    <a class="dropdown-item${meta.activeCareersItem === "jobs" ? " active" : ""}" href="careers.html" data-i18n="nav.careers.jobs">Careers</a>
                  </li>
                </ul>
              </li>
              <li class="nav-item">
                <a class="nav-link${meta.activeTop === "news" ? " active" : ""}" href="news.html" data-i18n="nav.news">News</a>
              </li>
              <li class="nav-item">
                <a class="nav-link${meta.activeTop === "contact" ? " active" : ""}" href="contact.html" data-i18n="nav.contact">Contact</a>
              </li>
            </ul>
            <div class="lang-toggle ms-lg-3" role="group" aria-label="Language selector">
              <button id="btnKO" type="button" class="lang-btn" data-lang="ko" aria-pressed="false">KO</button>
              <button id="btnEN" type="button" class="lang-btn" data-lang="en" aria-pressed="true">EN</button>
            </div>
          </div>
        </div>
      </nav>
    `;
  }

  function detectInitialLang() {
    const saved = localStorage.getItem("siteLang");
    if (saved === "ko" || saved === "en") return saved;
    const nav = (navigator.language || "en").toLowerCase();
    return nav.startsWith("ko") ? "ko" : "en";
  }

  function syncCareersDropdownLabel(dict) {
    const dropdownToggle = document.querySelector(
      '#site-nav .dropdown-toggle[data-nav-role="careers"]'
    );
    const activeItem = document.querySelector(
      "#site-nav .dropdown-item.active[data-i18n]"
    );

    if (!dropdownToggle) return;

    if (activeItem) {
      const key = activeItem.getAttribute("data-i18n");
      dropdownToggle.textContent = dict[key] || activeItem.textContent.trim();
      dropdownToggle.setAttribute("data-i18n", key);
      return;
    }

    dropdownToggle.textContent = dict["nav.careers"] || "Careers";
    dropdownToggle.setAttribute("data-i18n", "nav.careers");
  }

  function applyCommonUi(lang, dict) {
    const merged = { ...(COMMON_I18N[lang] || COMMON_I18N.en), ...(dict || {}) };
    document.querySelectorAll("#site-nav [data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      if (!merged[key]) return;
      el.textContent = merged[key];
    });
    syncCareersDropdownLabel(merged);

    const isKO = lang === "ko";
    document.getElementById("btnKO")?.setAttribute("aria-pressed", String(isKO));
    document
      .getElementById("btnEN")
      ?.setAttribute("aria-pressed", String(!isKO));
    localStorage.setItem("siteLang", lang);
  }

  function bindLanguageButtons(setLang) {
    document.getElementById("btnKO")?.addEventListener("click", () => setLang("ko"));
    document.getElementById("btnEN")?.addEventListener("click", () => setLang("en"));
  }

  renderNav();

  window.NFDSite = {
    COMMON_I18N,
    detectInitialLang,
    syncCareersDropdownLabel,
    applyCommonUi,
    bindLanguageButtons,
    currentPage,
  };
})();
