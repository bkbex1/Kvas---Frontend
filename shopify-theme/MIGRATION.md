# Migration matrix

| Original React feature | Shopify replacement | Status | Notes |
| --- | --- | --- | --- |
| Global React/Vite shell | `layout/theme.liquid`, CSS variables, minimal vanilla JS | Migrated | No React, Vite, Tailwind runtime or npm dependency in the theme |
| Fixed/transparent Navbar | Header section group, Shopify menu, search/account/cart routes | Migrated | Collapses before the source navigation overflows; submenu and keyboard support included |
| Hardcoded footer links/contact | Footer section group, menus, merchant settings and policies | Migrated | Sample Vitosha address, phone, email and Readdy credit removed |
| Home full-screen hero | Editable Hero section | Migrated | Desktop/mobile image pickers, overlay, alignment and two CTAs |
| Hardcoded benefit claims | Editable Benefits blocks | Migrated | Neutral defaults; merchant must verify claims before adding them |
| `featuredProducts` mock array | Featured collection section and Shopify product cards | Migrated | Price, compare-at price, stock, URLs and images are native |
| Story section and sample statistics | Editable Story section | Migrated | Fake 500+/5+/4.9 statistics removed; caption is blank by default |
| Hardcoded category array/counts | Selected Shopify collections | Migrated | Counts use `collection.all_products_count` |
| How-it-works array | Editable Steps blocks | Migrated | Neutral copy, no catalogue/delivery claims |
| Fabricated testimonials/ratings | Testimonials section with merchant blocks | Migrated | Empty storefront output until genuine reviews are entered |
| Readdy newsletter endpoint | Shopify customer form | Migrated | Adds `newsletter` tag; consent/email flows remain Admin configuration |
| Home final CTA | Editable image banner | Migrated | Merchant image picker with placeholder |
| `/shop` API/mock catalogue | Native collection template | Migrated | Shopify sorting, Search & Discovery filters and pagination |
| Wishlist and comparison state | Excluded | Not migrated | No reliable Shopify-native persistence in a theme alone |
| React product page | Native product template | Migrated | Media, variants, selling plans, quantity rules, product form, SKU and metafields |
| API related products | Shopify product recommendations endpoint | Migrated | Progressive enhancement; product page remains functional without JS |
| API cart | Shopify cart form | Migrated | Line properties, selling plans, quantity, removal, discounts, notes and checkout |
| Hardcoded shipping choices/promo | Shopify checkout, shipping, discounts | Migrated | Sample `КВАС10` and frontend price calculations removed |
| Custom checkout/card/IBAN form | Shopify checkout | Replaced | No payment or address data handled by theme |
| Custom auth/profile | Shopify customer accounts | Replaced | Header uses Shopify account route; custom favorites/subscriptions not copied |
| Custom admin panel | Shopify Admin | Replaced | Products, customers, orders, content, discounts and settings managed in Admin |
| API blog/detail | Shopify Blog/Articles | Migrated | Tag navigation, pagination, structured data and native comments |
| API recipes/detail | Recipe and Recipe step metaobjects | Migrated | Theme templates complete; Admin definitions/content must be created |
| About API content | `page.about` and editable sections | Migrated | Hero, story mosaic, values/team card blocks; blank team by default |
| Learn API books/videos | `page.learn`, video blocks and Shopify collection | Migrated | Books should be real products; video content is merchant controlled |
| Bundles API/UI | Bundle page/collection/product templates | Migrated | Inventory composition requires Shopify Bundles; no frontend simulation |
| Giveaway API/Readdy form | Editorial `page.giveaway` template | Partially migrated | Campaign design/FAQ/products supported; entry processing intentionally absent |
| Subscription API/forms | Shopify selling-plan UI | Partially migrated | A selling-plan provider/configuration is required in Admin |
| Vouchers/courses API | Shopify gift cards/products/pages | Partially migrated | Custom voucher purchase API and course enrolment are not theme capabilities |
| Speedy/BOX NOW frontend services | Shopify shipping integration | Not migrated | Carrier integration belongs in Admin/app/server, not Liquid |
| Maintenance gate | Password template | Migrated | Shopify storefront password flow |
| Sparse React i18n | Bulgarian default and English locale JSON | Migrated | Merchant content still needs Shopify Translate & Adapt/manual translation |
| Hardcoded SEO/geo/Store JSON-LD | Shopify page title, description, canonical, OG, structured data | Migrated | No fake location/contact schema |
| Readdy search-image URLs | Shopify media/image pickers/placeholders | Migrated | No Readdy dependency in theme source |

## Intentionally unfinished outside theme code

Real product catalogue, collections, images, menus, policies, shipping/payment configuration, recipe entries and verified merchant copy must be entered in Shopify Admin. These are store data and cannot be safely inferred from mock frontend content.

