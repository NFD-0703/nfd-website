(function () {
  // Common labels shared across all pages and language states.
  const COMMON_I18N = {
    en: {
      "nav.about": "About Us",
      "nav.about.company": "About Us",
      "nav.about.mission": "Mission & Vision",
      "nav.about.history": "History",
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
      "nav.about.company": "회사소개",
      "nav.about.mission": "미션과 비전",
      "nav.about.history": "회사연혁",
      "nav.services": "사업영역",
      "nav.ourwork": "주요 프로젝트",
      "nav.news": "뉴스",
      "nav.careers": "인재채용",
      "nav.careers.values": "인재상",
      "nav.careers.jobs": "인재채용",
      "nav.contact": "문의하기",
    },
  };

  // About dropdown items. Toggle `visible` to temporarily hide a page.
  const ABOUT_ITEMS = [
    {
      itemKey: "company",
      href: "aboutUs.html",
      labelKey: "nav.about.company",
      fallbackLabel: "About Us",
      visible: true,
    },
    {
      itemKey: "mission",
      href: "mission-vision.html",
      labelKey: "nav.about.mission",
      fallbackLabel: "Mission & Vision",
      visible: true,
    },
    {
      itemKey: "history",
      href: "history.html",
      labelKey: "nav.about.history",
      fallbackLabel: "History",
      visible: false,
    },
  ];

  // Careers dropdown items shown under the top-level careers menu.
  const CAREERS_ITEMS = [
    {
      itemKey: "values",
      href: "careers-values.html",
      labelKey: "nav.careers.values",
      fallbackLabel: "Our Values",
      visible: true,
    },
    {
      itemKey: "jobs",
      href: "careers.html",
      labelKey: "nav.careers.jobs",
      fallbackLabel: "Careers",
      visible: true,
    },
  ];

  // Top-level navigation definition used for both rendering and active-state logic.
  const NAV_ITEMS = [
    {
      type: "dropdown",
      role: "about",
      labelKey: "nav.about",
      fallbackLabel: "About Us",
      dropdownId: "aboutDropdown",
      items: ABOUT_ITEMS,
    },
    {
      type: "link",
      role: "services",
      href: "services.html",
      labelKey: "nav.services",
      fallbackLabel: "Services",
      activePages: [
        "services.html",
        "engineeringConsulting.html",
        "projectManager.html",
        "lease-management.html",
        "commissioning-agent.html",
        "facility-management.html",
        "integration.html",
      ],
    },
    {
      type: "link",
      role: "ourwork",
      href: "our-work.html",
      labelKey: "nav.ourwork",
      fallbackLabel: "Our Work",
      activePages: ["our-work.html", "first-work.html", "second-work.html"],
    },
    {
      type: "dropdown",
      role: "careers",
      labelKey: "nav.careers",
      fallbackLabel: "Careers",
      dropdownId: "careersDropdown",
      items: CAREERS_ITEMS,
    },
    {
      type: "link",
      role: "news",
      href: "news.html",
      labelKey: "nav.news",
      fallbackLabel: "News",
      activePages: ["news.html", "news-detail.html"],
    },
    {
      type: "link",
      role: "contact",
      href: "contact.html",
      labelKey: "nav.contact",
      fallbackLabel: "Contact",
      activePages: ["contact.html"],
    },
  ];

  function currentPage() {
    const path = window.location.pathname.split("/").pop();
    return path || "index.html";
  }

  // Returns only the menu items that should be rendered.
  function visibleItems(items) {
    return items.filter((item) => item.visible !== false);
  }

  // Resolves which dropdown item should be marked active for the current page.
  function findActiveDropdownItem(items, page, fallbackKey) {
    const match = items.find((item) => item.href === page);
    return match ? match.itemKey : fallbackKey;
  }

  // Builds page-level nav metadata so rendering and label sync stay consistent.
  function pageMeta(page) {
    const meta = {
      theme: page === "index.html" ? "overlay" : "solid",
      activeTop: "",
      activeAboutItem: "",
      activeCareersItem: "",
    };

    if (page === "index.html") return meta;
    if (ABOUT_ITEMS.some((item) => item.href === page)) {
      meta.activeTop = "about";
      meta.activeAboutItem = findActiveDropdownItem(ABOUT_ITEMS, page, "company");
    } else if (
      [
        "careers.html",
        "careers-values.html",
        "careers-estate-development.html",
        "careers-architect-engineer.html",
        "careers-csa-engineer.html",
        "careers-mechanical-electrical.html",
      ].includes(page)
    ) {
      meta.activeTop = "careers";
      meta.activeCareersItem = findActiveDropdownItem(CAREERS_ITEMS, page, "jobs");
    } else {
      const activeLink = NAV_ITEMS.find(
        (item) =>
          item.type === "link" &&
          Array.isArray(item.activePages) &&
          item.activePages.includes(page)
      );
      meta.activeTop = activeLink?.role || "";
    }

    return meta;
  }

  function renderDropdownItem(item) {
    return `
      <li>
        <a
          class="dropdown-item"
          href="${item.href}"
          data-i18n="${item.labelKey}"
          data-nav-item="${item.itemKey}"
        >${item.fallbackLabel}</a>
      </li>
    `;
  }

  // Renders a dropdown menu from its data definition.
  function renderDropdown(navItem) {
    const itemsMarkup = visibleItems(navItem.items)
      .map(renderDropdownItem)
      .join("");

    return `
      <li class="nav-item dropdown">
        <a
          class="nav-link dropdown-toggle"
          href="#"
          id="${navItem.dropdownId}"
          role="button"
          data-bs-toggle="dropdown"
          aria-expanded="false"
          data-i18n="${navItem.labelKey}"
          data-nav-role="${navItem.role}"
        >${navItem.fallbackLabel}</a>
        <ul class="dropdown-menu dropdown-menu-dark" aria-labelledby="${navItem.dropdownId}">
          ${itemsMarkup}
        </ul>
      </li>
    `;
  }

  // Renders a single top-level link item.
  function renderLink(navItem) {
    return `
      <li class="nav-item">
        <a
          class="nav-link"
          href="${navItem.href}"
          data-i18n="${navItem.labelKey}"
          data-nav-role="${navItem.role}"
        >${navItem.fallbackLabel}</a>
      </li>
    `;
  }

  function renderNavItem(navItem) {
    return navItem.type === "dropdown"
      ? renderDropdown(navItem)
      : renderLink(navItem);
  }

  // Builds the full shared header markup.
  function renderHeader() {
    const navMarkup = NAV_ITEMS.map(renderNavItem).join("");

    return `
      <nav class="navbar navbar-expand-xxl navbar-dark site-navbar">
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
            <ul class="navbar-nav">${navMarkup}</ul>
            <div class="lang-toggle ms-lg-3" role="group" aria-label="Language selector">
              <button id="btnKO" type="button" class="lang-btn" data-lang="ko" aria-pressed="false">KO</button>
              <button id="btnEN" type="button" class="lang-btn" data-lang="en" aria-pressed="true">EN</button>
            </div>
          </div>
        </div>
      </nav>
    `;
  }

  function setActiveLink(selector, isActive) {
    const el = document.querySelector(selector);
    if (!el) return;
    el.classList.toggle("active", isActive);
  }

  // Applies active classes after the header markup is mounted.
  function applyNavState(meta) {
    const nav = document.querySelector("#site-nav .site-navbar");
    if (!nav) return;

    nav.classList.add("site-navbar--" + meta.theme);

    NAV_ITEMS.forEach((item) => {
      setActiveLink(
        `#site-nav [data-nav-role="${item.role}"]`,
        meta.activeTop === item.role
      );
    });

    ABOUT_ITEMS.forEach((item) => {
      setActiveLink(
        `#site-nav [data-nav-item="${item.itemKey}"]`,
        meta.activeAboutItem === item.itemKey
      );
    });

    CAREERS_ITEMS.forEach((item) => {
      setActiveLink(
        `#site-nav [data-nav-item="${item.itemKey}"]`,
        meta.activeCareersItem === item.itemKey
      );
    });
  }

  function renderNav() {
    const mount = document.getElementById("site-nav");
    if (!mount) return;

    const page = currentPage();
    const meta = pageMeta(page);
    document.body.dataset.page = page === "index.html" ? "index" : "default";
    mount.innerHTML = renderHeader();
    applyNavState(meta);
  }

  function detectInitialLang() {
    const saved = localStorage.getItem("siteLang");
    if (saved === "ko" || saved === "en") return saved;
    const nav = (navigator.language || "en").toLowerCase();
    return nav.startsWith("ko") ? "ko" : "en";
  }

  // Keeps dropdown button text aligned with the currently active submenu item.
  function syncDropdownLabel(role, baseKey, dict) {
    const dropdownToggle = document.querySelector(
      `#site-nav .dropdown-toggle[data-nav-role="${role}"]`
    );
    const activeItem = document.querySelector(
      `#site-nav .dropdown-toggle[data-nav-role="${role}"] + .dropdown-menu .dropdown-item.active[data-i18n]`
    );

    if (!dropdownToggle) return;

    if (activeItem) {
      const key = activeItem.getAttribute("data-i18n");
      dropdownToggle.textContent = dict[key] || activeItem.textContent.trim();
      dropdownToggle.setAttribute("data-i18n", key);
      return;
    }

    dropdownToggle.textContent = dict[baseKey] || dropdownToggle.textContent.trim();
    dropdownToggle.setAttribute("data-i18n", baseKey);
  }

  function applyCommonUi(lang, dict) {
    const merged = { ...(COMMON_I18N[lang] || COMMON_I18N.en), ...(dict || {}) };
    document.querySelectorAll("#site-nav [data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      if (!merged[key]) return;
      el.textContent = merged[key];
    });
    syncDropdownLabel("about", "nav.about", merged);
    syncDropdownLabel("careers", "nav.careers", merged);

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

  // Render immediately so page scripts can safely wait on `window.NFDSite.ready`.
  const ready = Promise.resolve(renderNav());

  window.NFDSite = {
    COMMON_I18N,
    detectInitialLang,
    syncDropdownLabel,
    applyCommonUi,
    bindLanguageButtons,
    currentPage,
    ready,
  };
})();
