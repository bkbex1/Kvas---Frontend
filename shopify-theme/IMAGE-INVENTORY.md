# Image dependency audit

The React/Vite source contains Readdy-generated URLs in the home page, page heroes, about mosaic and mock content. The theme has no production dependency on Readdy: the retrievable source media is stored locally in `assets/` and rendered through Shopify's CDN with `asset_url`.

## Bundled media

- 97 `kv-*.jpg` assets are included in the installable theme package.
- The exact retrievable images used by the live home page are bundled: hero, story, CTA, four product cards and four category cards.
- Retrievable hero and editorial images for Shop, Blog, Recipes, Bundles, Learn, Giveaway, Vouchers and About are bundled.
- Product, bundle, book, lesson, recipe and article fallback cards are populated, so the supplied templates do not require manual image uploads.
- Image pickers and native product/collection/article media remain editable and take precedence when the merchant supplies replacements.

## Source limitation

73 dynamic Readdy mock URLs return HTTP 400 (`hash not found`) and the live `/shop` route currently returns no products. Those unavailable mock images are represented by locally bundled, thematically related fallbacks. `imports/media-failures.json` records each unavailable source URL; `imports/media-manifest.json` records the exact downloads.

## Safe rendering order

- Product cards use Shopify `product.featured_image`, then their bundled catalogue fallback.
- Collection cards use the collection image or first product image, then the bundled category fallback.
- Article and recipe cards use Shopify content media when present, then bundled editorial fallbacks.
- Theme-controlled editorial media uses `image_picker` first and a bundled asset second.
- No storefront request calls an external image-generation or search API.

