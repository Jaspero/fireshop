[![CircleCI](https://circleci.com/gh/Jaspero/fireshop.svg?style=svg)](https://circleci.com/gh/Jaspero/fireshop)

# Fireshop

Fireshop is a webshop built on [firebase](https://firebase.google.com/) and
the [Angular](https://angular.io/) framework.

## Supports

- [x] Multilingual
- [ ] Universal Rendering (SSR)
- [x] PWA
- [ ] [Stripe Checkout](https://stripe.com/docs)
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

## Project Structure

### Client

The client application is split in to three main segments dashboard, shop and shared.
Dashboard and shop represent the administrator dashboard and the client facing web shop
respectively and the shared folder holds any code shared between the two.

## Firestore Structure

### Authorization

A lot of CRUD operations are limited to admin access. You can read the full set of rules under `firestore.rules`.
To add an admin claim to an account add it to the `email` property of the `settings/allowed-admins` document.

### Products

### Categories

## Adding a language

## SEO

- **Human readable URL** - In order to get human readable URL-s the product ID should be the URL.
  This is because firebase only allows loading of a single document by ID.
