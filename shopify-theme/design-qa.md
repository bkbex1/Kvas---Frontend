# Design QA

- Source visual truth: `https://kvaseya-frontend.vercel.app/` and `src/pages/home/page.tsx` on branch `shopify-theme`.
- Implementation: Shopify Liquid theme in this directory.
- Source viewport inspected: approximately 1266×712 CSS pixels, desktop home route.
- Implementation screenshot: unavailable without a Shopify development-store domain and theme preview session.
- Density normalization: not applicable; no implementation screenshot captured.
- State: desktop home, top of page.

## Full-view comparison evidence

The source was captured and inspected in the Codex in-app browser. The implementation uses the measured source design contract: full-height hero with bottom-left copy, Inter/Playfair hierarchy, warm brown/cream palette, 1280px content width, 96px desktop section rhythm, pill CTAs, square product cards, 4:5 story media, two-column collection cards and dark process/footer surfaces. Code-only checks are not sufficient for a visual pass.

## Focused region comparison

Blocked because the Liquid implementation cannot be browser-rendered with real Shopify objects without a development store. Product, collection, cart, localization and theme-editor states also depend on store data.

## Findings

- [P1] Merchant photography is missing. The source uses full-bleed generated bread photography; the theme intentionally ships with Shopify placeholders until real Kvaseya assets are uploaded.
- [P2] Final text wrapping and navigation density need a real Theme Editor preview. The source navigation overflows near the observed desktop width; the implementation collapses at 1399px to prevent that regression.
- [P2] Commerce states need real data. Product variants, selling plans, filters, discounts, articles and recipe metaobjects cannot be visually judged from source code alone.

## Implementation checklist

- Upload real imagery and catalogue data.
- Run `shopify theme dev` with the store domain.
- Capture desktop 1440×900 and mobile 390×844 views for home, collection, product and cart.
- Compare against the source and resolve remaining P0/P1/P2 mismatches.

## Comparison history

- Initial source audit: fake claims/reviews and external images identified; theme defaults made neutral and media moved to Shopify.
- Code iteration: desktop navigation changed to collapse before source overflow; native responsive CSS and reduced-motion behavior added.
- Post-fix browser comparison: blocked pending Shopify development-store access.

final result: blocked

