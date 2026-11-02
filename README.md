# Fluffy Meadow – Jekyll webstore for GitHub Pages

## Publish
1. Create a GitHub repo and upload everything in this folder.
2. Repo **Settings → Pages → Deploy from a branch → main / (root)**.
3. If your site lives at `you.github.io/repo-name`, set `baseurl: "/repo-name"` in `_config.yml`.

## Edit content (no code needed)
| File | Controls |
|---|---|
| `specs/site.md` | name, tagline, logo, announcement bar, currency, order email, checkout link, footer |
| `specs/nav.md` | menu links |
| `specs/hero.md` | home banner image, headline, button |
| `specs/categories.md` | round character icons |
| `specs/featured.md` | arch cards |
| `specs/promo.md` | gift banner, stamp, newsletter form |
| `specs/perks.md` | bottom perks strip |
| `specs/inventory.md` | **every product** |
| `specs/about.md`, `journal.md`, `contact.md` | text pages |

Images go in `/images/`; refer to them by file name.

## Preview locally
```
bundle install
bundle exec jekyll serve
```
Open http://localhost:4000 (specs are loaded by the browser, so opening the HTML files directly won't work).
