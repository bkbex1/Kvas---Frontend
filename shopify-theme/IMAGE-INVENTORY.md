# Image dependency audit

The React/Vite source contains Readdy-generated image URLs in the home page, page heroes, about mosaic, product/mock fallbacks, recipes, blog, learn, bundles, subscription, vouchers and giveaway content. `src/lib/api.ts` also converts arbitrary text into a Readdy search-image request when an API image is missing.

None of those URLs is copied into this theme. This avoids an external production dependency and avoids presenting generated placeholder people/products as authentic Kvaseya content.

## Upload before launch

| Placement | Recommended source | Suggested crop |
| --- | --- | --- |
| Home hero + mobile hero | Real Kvaseya bread/bakery photography | 2400×1400 landscape; 1100×1500 portrait |
| Home story | Founder/process photography | 4:5 portrait |
| Home CTA | Workshop/bread photography | 2000×800 landscape |
| About hero and 2–4 mosaic images | Real workshop/team/process photography | hero 2000×800; cards 4:5/landscape |
| Shop/category pages | Shopify collection images | 16:10 or 4:3 |
| Products and bundles | Shopify product media | 1:1, consistent neutral background |
| Blog | Shopify article featured images | 16:10 |
| Recipes | Recipe metaobject images and optional step images | hero 16:9; steps 4:3 |
| Learn | Merchant-owned videos/posters and real book product images | video 16:9; book 1:1/4:5 |
| Giveaway/campaign | Approved campaign creative | 16:9 or page-specific |
| Logo/favicon | Final brand files | wide logo SVG/PNG; square favicon PNG |

## Safe fallbacks

- Product cards use `product.featured_image`.
- Collection cards use the collection image, then the first product image.
- Article cards use `article.image`.
- Recipe pages use metaobject file references.
- Theme-controlled editorial media uses `image_picker` or Shopify video settings.
- Missing media renders a Shopify placeholder only; it never calls an external image API.

