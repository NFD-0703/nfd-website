# nfd-website

NFD corporate website built as a static HTML site.

## Project Structure

### Root HTML pages

Each public page remains at the project root to preserve existing URLs and SEO.

- `index.html`
- `aboutUs.html`
- `services.html`
- `our-work.html`
- `news.html`
- `news-detail.html`
- `careers.html`
- `careers-values.html`
- `contact.html`
- service detail pages such as `engineeringConsulting.html`
- career detail pages such as `careers-csa-engineer.html`

### Shared assets

- [`shared/site-ui.css`](/Users/junchollee/workspace/nfd-website/shared/site-ui.css)
  Shared navbar and common UI styling
- [`shared/site-ui.js`](/Users/junchollee/workspace/nfd-website/shared/site-ui.js)
  Shared navbar rendering, language toggle UI, active menu state
- [`shared/site-i18n.js`](/Users/junchollee/workspace/nfd-website/shared/site-i18n.js)
  Shared page i18n initializer and DOM translation helper

### Page data

- [`data/i18n/`](/Users/junchollee/workspace/nfd-website/data/i18n)
  One translation file per page
- [`data/news-detail-data.js`](/Users/junchollee/workspace/nfd-website/data/news-detail-data.js)
  News detail content data used by `news-detail.html`

### Static assets

- [`images/`](/Users/junchollee/workspace/nfd-website/images)
  Images and icons used across the site
- [`sitemap.xml`](/Users/junchollee/workspace/nfd-website/sitemap.xml)
  Public sitemap for indexed pages

## How The Site Works

### Navigation

Navigation is no longer duplicated in each HTML file.

Each page contains:

```html
<div id="site-nav"></div>
```

The shared navbar is rendered by `shared/site-ui.js`.

If you need to change:

- menu order
- active menu rules
- careers dropdown behavior
- language toggle markup

edit `shared/site-ui.js` and, if needed, `shared/site-ui.css`.

### Translations

Each page loads:

- `shared/site-ui.js`
- `shared/site-i18n.js`
- its own `data/i18n/<page>.js`

Example:

```html
<script src="shared/site-ui.js"></script>
<script src="shared/site-i18n.js"></script>
<script src="data/i18n/services.js"></script>
```

Page translation data is exposed as:

```js
window.NFD_PAGE_I18N = {
  en: { ... },
  ko: { ... },
};
```

The page then initializes:

```js
const I18N = window.NFD_PAGE_I18N;

window.NFDSiteI18n.init({
  dict: I18N,
  titleKey: "page.title",
});
```

Pages with custom behavior can use `onAfterSetLang`.

Examples:

- `index.html`: CTA image/text switching
- `news-detail.html`: re-rendering detail content per language
- `contact.html`: form validation message sync

## Rules For Adding A New Page

When adding a new page, follow this order.

1. Create the new root HTML file.
2. Add `<div id="site-nav"></div>` where the shared navbar should appear.
3. Include shared assets:
   `shared/site-ui.css`
   `shared/site-ui.js`
   `shared/site-i18n.js`
4. Create a matching translation file in `data/i18n/`.
   Example:
   `new-page.html` -> `data/i18n/new-page.js`
5. In the HTML, load that page i18n file and initialize `window.NFDSiteI18n.init(...)`.
6. If the page has custom language-specific rendering, use `onAfterSetLang`.
7. If the page should appear in top navigation logic, update `shared/site-ui.js`.
8. If the page is public and indexable, add it to `sitemap.xml`.

## Rules For Editing Existing Pages

- Do not duplicate navbar markup into individual pages.
- Do not reintroduce inline page-sized `I18N` objects inside HTML.
- Prefer putting reusable data into `data/`.
- Prefer putting reusable behavior into `shared/`.
- Keep root HTML file names stable unless URL migration is intentionally planned.

## When To Update Which File

- Change shared nav/menu behavior:
  `shared/site-ui.js`
- Change shared nav appearance:
  `shared/site-ui.css`
- Change page translations:
  `data/i18n/<page>.js`
- Change page-specific layout/content:
  the page HTML file
- Change news detail content:
  `data/news-detail-data.js`
- Change search indexing:
  `sitemap.xml`

## Sitemap Rule

Update [`sitemap.xml`](/Users/junchollee/workspace/nfd-website/sitemap.xml) when:

- a new public page is added
- a public page is removed
- a page URL changes

Do not add:

- verification files
- internal helper files
- shared scripts or styles

## Notes

- The project is intentionally still URL-flat at the HTML level.
- Structural cleanup happens in `shared/` and `data/` first.
- Moving HTML files into folders should only happen with a deliberate redirect plan.
