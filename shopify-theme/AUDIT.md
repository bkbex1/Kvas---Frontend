# Kvaseya migration audit

Source: `bkbex1/Kvas---Frontend`, branch `shopify-theme`, baseline `d97ac703ccff71fbe0238985c4ed456f4a5179f7`.

## Repository inspection before implementation

Inspected the source inventory, route map, shared components, home, shop, product components, cart, checkout, recipes/detail, blog/detail, about, learn, giveaway, bundles, subscription/vouchers, profile/admin imports and endpoints, auth, shipping services, i18n, mocks, CSS, Tailwind configuration and package.json. `node_modules` and `out` are generated/tracked artifacts, not theme source. No AGENTS.md found in the repository.

The React application has real API integrations as well as simulated behavior; it is not accurate to call the entire backend fake. `src/lib/api.ts` targets `VITE_API_BASE_URL` (localhost:8080 fallback), stores a bearer token in localStorage, normalizes API products, and creates Readdy image URLs. Those integrations are replaced, not copied.

| Area | Findings | Shopify decision |
| --- | --- | --- |
| Home | Local featuredProducts/categories/testimonials arrays; Readdy image and newsletter URLs; four-step process; story, CTA | Independent editable sections; Shopify collection data; no customer/statistical defaults |
| Navbar/Footer | Fixed transparent home navigation; white scrolled header; hardcoded links, sample contact details/social # links; API cart count | Header/footer section groups, menus, routes, cart.item_count, optional merchant contacts |
| Shop | API catalogue with mock fallback; local price/rating/category filters and wishlist | Native collection pagination, sort_options, filters; no invented ratings or wishlist persistence |
| Product | API data; gallery, information and tabs; API cart/favorites; comparison state | Native product form, option selectors, media, price/availability, descriptive metafields, recommendations |
| Cart | API cart; frontend shipping choices and hardcoded 10% code | Shopify cart form, discounts and totals; shipping calculated at checkout |
| Checkout | Custom customer/address/card draft state, shipping adapters and order/payment APIs | Shopify checkout only; no card fields or checkout draft copied |
| Auth/profile | Custom bearer auth, protected routes, profile orders/favorites/subscriptions/vouchers | Shopify customer accounts and orders; custom profile dashboard excluded |
| Admin | Product/customer/order/content CRUD, uploads, courier labels, dashboard | Shopify Admin; no admin code or credentials in theme |
| Blog | Content API, hero, category tabs, featured article, cards/detail/comments | Shopify blogs, tags, articles and native moderated comments |
| Recipes | Content API, filters, cards; ingredient sidebar, ordered steps, tags and linked products | Recipe and recipe_step metaobjects; native web pages and product references |
| Learn | API books/video lessons; level tabs and fake add confirmation | Page template, merchant video blocks, real book collection/products |
| About | Content API; hero, story/mosaic, values, team | Editable hero/story/cards sections; empty team defaults |
| Bundles | Content API, item composition/discount presentation | Real bundle products and collection; Shopify Bundles manages component stock |
| Giveaway | Content API; Readdy entry form, countdown, simulated mystery-box order success | Editorial campaign page and FAQ, optional real product collection; no simulated entry/order processing |
| Subscriptions/vouchers | API content mixed with Readdy forms; voucher purchase API | Excluded custom forms; gift cards/native selling plans require merchant setup |
| Services | Speedy/BoxNow API wrappers, shipping calculation, labels | Shipping configuration/integration outside theme; not portable frontend code |
| i18n | English initialization, mostly hardcoded Bulgarian UI, sparse auto-loaded modules | Bulgarian default storefront locale, matching English keys |
| Mocks | products, recipes, profile, learn, giveaway, bundles, blog | No mock database copied into storefront |

## Design contract

Home source: full viewport hero (minimum 700px), bottom-aligned copy, 72/96px desktop heading lines, 48/60px mobile, 64px desktop hero gutter. Inter body, Playfair Display headings. Main surfaces #FAFAF7, #F5EFE6, #1A0F08, footer #2E1A0E, accent #C17A3A and gold #F5C842. Content width 1280px, 96px section padding, 24px card gaps, 16–24px radii, pill CTA buttons, square product imagery, 4:5 story image, two-column category tiles. Mobile stacks columns and CTA buttons. Preserve these proportions with standalone CSS; no React/Tailwind runtime.

Live home inspected in browser: the same composition is present; navigation overflows at the observed ~1266px viewport, and external icon/font resources can fail. Theme navigation must collapse earlier and use inline SVG. Photographic fidelity depends on merchant assets replacing external generated images.

## Classification A–J

- A presentation: typography, spacing, cards, hero gradients, navigation, article/recipe layouts.
- B mock: src/mocks plus home arrays; never used as Shopify production data.
- C simulation: promo code, learn add feedback, mystery-box order success, fallback ratings/statistics.
- D Shopify replacement: catalogue, inventory, prices, customers, cart, checkout, discounts, newsletter, blogs.
- E exclude: custom auth/admin/payment/shipping backend, maintenance gate, fake ratings/reviews, comparison/wishlist without real storage.
- F sections: header/footer, hero, benefits, featured collection, story, categories, steps, testimonials, newsletter, banner, content/cards/FAQ and page mains.
- G snippets: image, product/article/collection/recipe card, price, icons, navigation, pagination, newsletter, filters, section heading.
- H templates: all requested OS 2.0 templates; content alternates and recipe metaobject template; password/gift card support.
- I structured data: recipe/step definitions, product details/care/features/related products, optional badges/bundle contents.
- J JavaScript: header appearance, disclosure Escape handling and asynchronous product recommendations only where helpful. Commerce and forms retain server-rendered navigation/submission.

## Claims to remove

Home 500+ products/customers, 5+ years, 20+ categories, 4.9/200+ reviews and three fabricated reviewers; two-day delivery, 30-day guarantee, certified materials and 24/7 support; product fallback rating; free shipping threshold and sample promo; sample Vitosha street address/phone/email; hardcoded SEO location and Store data. None is evidence of a real merchant policy. Any later claim must be supplied and verified by the merchant.

All Readdy references are inventoried separately in IMAGE-INVENTORY.md. Product images come from Shopify; merchant images use image_picker and blank states. No source images are silently downloaded or represented as authentic brand photography.
