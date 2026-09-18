# Kvaseya Shopify theme

Shopify Online Store 2.0 implementation of the existing Kvaseya React/Vite storefront. The original application remains unchanged; all Shopify code is isolated in this directory.

## Prerequisites

- A Shopify development or merchant store and permission to manage themes.
- Node.js 20+.
- Shopify CLI 4.x: `npm install -g @shopify/cli@latest`.
- Products, collections, menus and content created in Shopify Admin. The repository contains no production catalogue or fabricated reviews.

## Local development

From the repository root:

```powershell
shopify auth login
shopify theme dev --store YOUR-STORE.myshopify.com --path shopify-theme
```

The first command opens Shopify's authentication flow. `theme dev` creates a temporary development theme and prints preview/editor URLs. It does not publish the live theme.

## Validation and packaging

```powershell
shopify theme check --path shopify-theme
shopify theme package --path shopify-theme
```

The repository also includes `shopify-theme/Kvaseya-1.0.0.zip`, produced after a clean Theme Check run. Markdown audit/setup files are excluded from the uploaded package by `.shopifyignore`.

## Upload as an unpublished theme

```powershell
shopify theme push --unpublished --store YOUR-STORE.myshopify.com --path shopify-theme
```

Review the unpublished theme in Shopify Admin and test products, variants, cart, checkout, search, filters, customer account links, articles, policies and mobile layouts with real store data.

## Publish

Publishing changes the live storefront. It is intentionally not automated here. After stakeholder approval:

```powershell
shopify theme list --store YOUR-STORE.myshopify.com
shopify theme publish --store YOUR-STORE.myshopify.com --theme THEME_ID
```

## Shopify Admin setup

1. **Settings > Store details / Markets**: configure BGN, Bulgaria, taxes, domains and Bulgarian as the default language. Add English only when translated content is ready.
2. **Online Store > Navigation**: create `main-menu` and `footer`; select them in Header/Footer through the Theme Editor.
3. **Products and Collections**: import the real catalogue and media. Create a manual or automated featured collection and category collections. Assign the bundle product template to bundle products.
4. **Search & Discovery**: configure the filters shown by `collection.filters`. The theme renders Shopify-native filters; it does not filter a JavaScript product array.
5. **Content > Metaobjects**: create the `recipe_step` and `recipe` definitions described below, enable recipe Online Store pages and the renderable/SEO capability, then assign the `recipe` template.
6. **Settings > Custom data > Products**: create the optional product metafields below.
7. **Content > Blog posts**: create the blog and articles, enable moderated comments if desired.
8. **Settings > Customer accounts**: choose Shopify's customer-account mode. The theme links to `routes.account_url`; it does not provide custom authentication.
9. **Settings > Shipping and delivery / Payments / Checkout / Taxes / Discounts**: configure all commercial rules in Shopify. The old React checkout, courier forms and sample promo logic are not used.
10. **Settings > Policies**: add real privacy, terms, returns and shipping policies. Footer links appear only for policies with content.
11. **Marketing**: customer-form submissions are tagged `newsletter`. Configure consent and email flows in Shopify according to your policy.
12. **Apps > Shopify Bundles**: use Shopify's first-party Bundles app for fixed bundles/multipacks if component inventory is required; place bundle products in a Bundles collection and assign `product.bundle`.

## Recipe metaobjects

Create definition **Recipe step** with type handle `recipe_step`:

| Field | Key | Shopify type | Required |
| --- | --- | --- | --- |
| Step text | `text` | Rich text | Yes |
| Step image | `image` | File reference, images only | No |

Create definition **Recipe** with type handle `recipe` and enable **Storefronts > Web pages**, **Active-draft status** and SEO fields:

| Field | Key | Shopify type | Required |
| --- | --- | --- | --- |
| Title | `title` | Single line text | Yes; display name |
| Image | `image` | File reference, images only | Yes |
| Description | `description` | Rich text | Yes |
| Ingredients | `ingredients` | List of single line text | Yes; include amount and ingredient in each item |
| Steps | `steps` | List of metaobject references to `recipe_step` | Yes |
| Difficulty | `difficulty` | Single line text | No |
| Preparation time | `prep_time` | Integer | No; minutes |
| Bake time | `bake_time` | Integer | No; minutes |
| Total time | `total_time` | Integer | No; minutes |
| Servings | `servings` | Single line text | No |
| Category | `category` | Single line text | No |
| Tags | `tags` | List of single line text | No |
| Baker tips | `tips` | Rich text | No |
| Related products | `related_products` | List of product references | No |

Publish entries, give each entry a web-page URL, and create a Shopify Page using template `page.recipes` for the recipe index.

## Optional product metafields

Namespace is `custom`:

| Name | Key | Type | Used in theme |
| --- | --- | --- | --- |
| Specifications | `specifications` | Rich text | Product accordion |
| Use and care | `care` | Rich text | Product accordion |
| Bundle contents | `bundle_contents` | List of single line text | Bundle contents accordion |

## Template assignments

- About page → `page.about`
- Recipes index → `page.recipes`
- Learn page → `page.learn`
- Giveaway/campaign page → `page.giveaway`
- Bundles landing page → `page.bundles`
- Bundle collection → `collection.bundles`
- Bundle products → `product.bundle`
- Recipe metaobjects → `recipe`

## Content and image placeholders

All merchant photography is intentionally empty until real licensed Kvaseya assets are uploaded. Product/collection/article cards use their Shopify media and graceful placeholders otherwise. The Theme Editor controls hero, mobile hero, story, CTA, page heroes and card media. See `IMAGE-INVENTORY.md` for the complete source audit.

## Known external configuration

- Speedy, Econt and BOX NOW rates, offices, labels and fulfilment are not theme code. Configure a compatible Shopify shipping integration or carrier-rate setup.
- Selling plans require a subscription solution that creates Shopify selling plans; the product form already renders available plans.
- Gift cards use Shopify gift-card products and the included gift-card template.
- Reviews require genuine merchant-provided testimonials or a review app block. The theme ships with an empty testimonial section.
