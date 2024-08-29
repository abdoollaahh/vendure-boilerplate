# Vendure Remix Storefront Starter

An e-commerce storefront for [Vendure](https://www.vendure.io) built with [Remix](https://remix.run).

👉 [remix-storefront.vendure.io](https://remix-storefront.vendure.io/)


## To do

Most Vendure features are already part of this starter. Notable missing Vendure features:
- Default billing/shipping addresses
   - This is part of the account page (https://funkyton.com/vendure-tutorial//pull/39) but not yet used in checkout
- Separate billing address in checkout
- Promotions
- Localization
- Multi channel support

General things missing:
- Global input validation
- Sitemap generation
- Metadata

**Contributions welcome!**

## Development

1. Clone this repo
2. `yarn install`
3. Create a `.env` file in the root dir with the following command and update it with your variables:
   
   ```bash
   cp .env.template .env
   ```
   
5. `yarn dev` - run the storefront with a local Remix server
6. `yarn dev:cf` - runs locally with the Cloudflare Pages configuration

### Vendure Server

This storefront requires a Vendure V2 server. You can either run a local instance, or use our public demo server.  
If you're looking for V1 support, [75eb880](https://funkyton.com/vendure-tutorial//tree/75eb880052d7f76b2026fc917cf545996012e3ac) is the last supported commit.

#### Code Generation

Whenever the Graphql documents (the constants using the `gql` tag) in the [./app/providers](./app/providers) dir changes,
you should run `yarn generate` to generate new sdk definitions.

For a more detailed guide on how to work with code generation, check the wiki about [querying custom fields](https://funkyton.com/vendure-tutorial//wiki/Querying-custom-fields).

#### Local

You can set up a local instance, populated with test data by following the instructions in the Vendure [Getting Started guide](https://docs.vendure.io/getting-started/). Note that make sure you have enabled the `bearer` method for managing session tokens:

```ts
// vendure-config.ts
export const config: VendureConfig = {
  authOptions: {
    tokenMethod: ['bearer', 'cookie'], // or just 'bearer'
    // ...
  },
  // ...
};
```

## Payment Gateways

Currently, both Stripe and Braintree are supported out of the box, but only one of them can be used at the same time

### Stripe integration

This repo has a built-in Stripe payment integration. To enable it, ensure that your Vendure server is set up with
the [StripePlugin](https://docs.vendure.io/reference/core-plugins/payments-plugin/stripe-plugin/).

Ensure your new PaymentMethod uses the word `stripe` somewhere in its code, as that's how this integration will know
to load the Stripe payment element.

Then add your Stripe publishable key to the env file:

```
STRIPE_PUBLISHABLE_KEY=pk_test_...
```

**Important note**: There's a race condition between Stripe redirecting a customer to the confirmation page and the webhook receiving the confirmation in the Vendure backend. As this condition is not very distinguishable from other potential issues, it is currently addressed by implementing a very simple retry system of 5 retries every 2.5s You can tweak these settings in the [CheckoutConfirmation route](./app/routes/checkout/confirmation.%24orderCode.tsx).

### Braintree integration

This repo has built-in Braintree integration. To enable it, ensure that your Vendure server is set up with
the [BraintreePlugin](https://docs.vendure.io/reference/core-plugins/payments-plugin/braintree-plugin/).

Currently, `storeCustomersInBraintree` has to be set to `true` in plugin options.

## Public demo

There is a publicly-available demo instance at https://readonlydemo.vendure.io/shop-api

## Deployment

This repo is configured to deploy to either Netlify or Cloudflare Pages or to build locally with specialised build targets (`build(:nf/:cf)`).

No special setup should be needed, as the [remix.config.js](./remix.config.js) file contains a check for the `process.env.CF_PAGES` / `process.env.NETLIFY` environment variable to determine whether to use the Cloudflare Pages or Netlify server configuration.

Follow the usual procedure for setting up a project in Netlify/CF Pages and point it to your clone of this repo on GitHub/Gitlab.

**Be sure to change the cookie secret in [app/sessions.ts](./app/sessions.ts) for production use!**

## License

MIT
