[![CircleCI](https://circleci.com/gh/Jaspero/fireshop.svg?style=svg)](https://circleci.com/gh/Jaspero/fireshop)

# Fireshop

Fireshop is a webshop built on [firebase](https://firebase.google.com/) and
the [Angular](https://angular.io/) framework.

**Note**: Fireshop is in active development and shouldn't be used in a production environment.

## Supports

- [x] Multilingual
- [x] Universal Rendering ([SSR](https://angular.io/guide/universal))
- [x] PWA
- [x] [Stripe Checkout](https://stripe.com/docs)
- [x] Offline
  - [x] Browsing
  - [ ] Cart
  - [ ] Checkout
- [x] [Lazy Image Loading](https://github.com/Jaspero/ng-image-preload)
- [ ] Google Analytics
- [x] CI/CD (with [CircleCi](https://circleci.com))
- [ ] [Guess.js](https://github.com/guess-js)
- [x] [Prettier](https://github.com/prettier/prettier)

## Setup

- Fork this repository
- Create a firebase project
- Replace environment variables in [firebase](https://firebase.google.com/docs/functions/config-env)
- Add cors configuration for your storage bucket.
  The below is an example of how this looks for [https://fireshop.jaspero.co](https://fireshop.jaspero.co).
  ```
  [
    {
      "origin": ["https://fireshop.jaspero.co", "https://fireshop.admin.jaspero.co"],
      "method": ["GET"],
      "maxAgeSeconds": 3600
    }
  ]
  ```
  Create a `cors.json` file with the above configuration and run
  `gsutil cors set cors.json gs://jaspero-site.appspot.com`, replacing `jaspero-site`
  with the name of the bucket you'll be using.

## CMS

An example deployment of the cms can be found [here](https://fireshop.admin.jaspero.co/dashboard).
You can use the credentials below to login with a read only account.

| Property | Value                             |
| -------- | --------------------------------- |
| Site     | https://fireshop.admin.jaspero.co |
| Email    | example@jaspero.co                |
| Password | example                           |

## Project Structure

### Client

The client application is split in to three main segments dashboard, shop and shared.
Dashboard and shop represent the administrator dashboard and the client facing web shop
respectively and the shared folder holds any code shared between the two.

## Firestore Structure

### Authorization

A lot of CRUD operations are limited to admin access. You can read the full set of rules under `firestore.rules`.
To add an admin claim to an account add the account email to the `roles` array in the `settings/user` document.

**role**

```
{
    "email": {
        "type": "string"
    },
    "role": {
        "type": "string"
    }
}
```

**note:**
This document needs to exist before the user is created.

### Products

### Categories

## Adding a language

## SEO

- **Human readable URL** - In order to get human readable URL-s the product ID should be the URL.
  This is because firebase only allows loading of a single document by ID.

## Stripe Integration

1. Create a webhook and point it at `[jour-domain]/stripe/webhook`.
2. Connect `payment_intent.succeeded` and `payment_intent.payment_failed`
   events for the webhook.
3. Added the stripe webhook secret to your integrations environment variables.

## PayPal Integration

1.  Retrieve `client-id` from PayPal Developer Dashboard ([Step by step](https://developer.paypal.com/docs/checkout/integrate/#1-set-up-your-development-environment))
2.  Update PayPal import script from `index.html` with corresponding `client-id`

## Feature Branches

### feature/mail-chimp

Creates a MailChimp account for every new user if the users
email isn't listed already.
