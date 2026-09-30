# Design QA

- Source visual truth: `https://kvaseya-frontend.vercel.app/` and `src/pages/home/page.tsx` on branch `shopify-theme`.
- Implementation: Shopify Liquid theme in this directory.
- Source viewport inspected: approximately 1266×712 CSS pixels, desktop home route.
- Shopify draft: `Kvaseya Development` (`#205496058204`) in `kvaseya.myshopify.com`.
- Preview URL: `https://kvaseya.myshopify.com?preview_theme_id=205496058204`.
- Implementation screenshot: password template verified in Shopify; the home route remains behind the store password in the automated browser session.
- Density normalization: not applicable; no implementation screenshot captured.
- State: desktop home, top of page.

## Full-view comparison evidence

The source was captured and inspected in the Codex in-app browser. The implementation uses the measured source design contract: full-height hero with bottom-left copy, Inter/Playfair hierarchy, warm brown/cream palette, 1280px content width, 96px desktop section rhythm, pill CTAs, square product cards, 4:5 story media, two-column collection cards and dark process/footer surfaces. Code-only checks are not sufficient for a visual pass.

## Focused region comparison

The password template, global header/footer, Bulgarian copy and Shopify preview bar rendered successfully from the uploaded draft. The full theme now includes the source home imagery, page heroes and populated fallback cards. Full route comparison remains blocked because the automated browser session is not authenticated through the storefront password.

## Findings

- [P2] Final text wrapping and navigation density need a real Theme Editor preview. The source navigation overflows near the observed desktop width; the implementation collapses at 1399px to prevent that regression.
- [P2] Commerce states still need Shopify data. Product variants, selling plans, filters, discounts, native articles and recipe metaobjects cannot be visually judged from theme fallbacks alone.

## Implementation checklist

- Import `imports/kvaseya-products.csv` to create the prepared catalogue as draft products.
- Enter the storefront password in the preview browser or disable password protection temporarily during QA.
- Capture desktop 1440×900 and mobile 390×844 views for home, collection, product and cart.
- Compare against the source and resolve remaining P0/P1/P2 mismatches.

## Comparison history

- Initial source audit: fake claims/reviews and external images identified; theme defaults made neutral and media moved to Shopify.
- Code iteration: desktop navigation changed to collapse before source overflow; native responsive CSS and reduced-motion behavior added.
- Shopify upload: draft theme `#205496058204` uploaded and confirmed as `unpublished` and fully processed.
- Shopify validation: Theme Check completed with 0 errors and 0 warnings; password template rendered successfully.
- Media restoration: 97 local image assets and populated fallback cards added; the exact retrievable live home images are embedded.
- Post-fix browser comparison: partially verified; full routes remain behind storefront authentication.

final result: partial pass — complete populated draft uploaded and password template verified; full visual route comparison is blocked only by storefront authentication

