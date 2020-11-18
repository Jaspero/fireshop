## [3.7.1](https://github.com/jaspero/jms/compare/v3.7.0...v3.7.1) (2020-11-18)


### Bug Fixes

* **setup:** created-on populates on load ([79d7d3f](https://github.com/jaspero/jms/commit/79d7d3ff37aa7791ed1ecd2e3ecf5c73f66fc9f9))

# [3.7.0](https://github.com/jaspero/jms/compare/v3.6.0...v3.7.0) (2020-11-17)


### Features

* incremented form-builder library ([63a3243](https://github.com/jaspero/jms/commit/63a32435b854f85708fd6f098f29537044aa2402))

# [3.6.0](https://github.com/jaspero/jms/compare/v3.5.0...v3.6.0) (2020-11-17)


### Features

* extended password reset to support action-controller ([5be6b3f](https://github.com/jaspero/jms/commit/5be6b3f98b2362057e077547eb335e3cc55f06cd))

# [3.5.0](https://github.com/jaspero/jms/compare/v3.4.0...v3.5.0) (2020-11-17)


### Features

* connected mfa :tada: closes [#192](https://github.com/jaspero/jms/issues/192) ([3d8d615](https://github.com/jaspero/jms/commit/3d8d615f5884aa5bff235cc3c80664bd5166b97f))
* connecting MFA :construction: [#192](https://github.com/jaspero/jms/issues/192) ([dd9fde7](https://github.com/jaspero/jms/commit/dd9fde74b1d667b5befb564bf791e275d1f1b677))

# [3.4.0](https://github.com/jaspero/jms/compare/v3.3.1...v3.4.0) (2020-11-14)


### Features

* **client:** made appearance outline default for mat form fields ([f8afbce](https://github.com/jaspero/jms/commit/f8afbcea4905fff8dc618666fe6b3014e4af4d1e))
* **client:** updated to angular v11 ([26e65bf](https://github.com/jaspero/jms/commit/26e65bfc3c5882b5fa295907ddab03c7e227da4a))
* **setup:** split out in to modules and collections and switched to typescript ([107e1ee](https://github.com/jaspero/jms/commit/107e1ee3ef1831dad289bfcd5c7995745aa5fd19))

## [3.3.1](https://github.com/jaspero/jms/compare/v3.3.0...v3.3.1) (2020-11-09)


### Bug Fixes

* **FileCreated:** removed space replace ([735f14f](https://github.com/jaspero/jms/commit/735f14f0ddf89ac65bcd9396bb5271b6d3cae64a))

# [3.3.0](https://github.com/jaspero/jms/compare/v3.2.3...v3.3.0) (2020-11-01)


### Features

* **client:** profile page closes [#171](https://github.com/jaspero/jms/issues/171) ([b3d846d](https://github.com/jaspero/jms/commit/b3d846d42f34756d6e1c15d619a56a9b65de6a7a))

## [3.2.3](https://github.com/jaspero/jms/compare/v3.2.2...v3.2.3) (2020-10-22)


### Bug Fixes

* get modules layout not defined ([7c80e1f](https://github.com/jaspero/jms/commit/7c80e1f056337eeac25926ddb21a8069870482ed))

## [3.2.2](https://github.com/jaspero/jms/compare/v3.2.1...v3.2.2) (2020-10-22)


### Bug Fixes

* replace space in image name ([829f5c4](https://github.com/jaspero/jms/commit/829f5c4588dde3347a8dfcef24a283e8cd85bb7c))

## [3.2.1](https://github.com/jaspero/jms/compare/v3.2.0...v3.2.1) (2020-10-20)


### Bug Fixes

* **client:** missing function parser for root navigation item ([e04c604](https://github.com/jaspero/jms/commit/e04c604ca08c13bb3ff0767d883777865aaa25b6))

# [3.2.0](https://github.com/jaspero/jms/compare/v3.1.0...v3.2.0) (2020-10-17)


### Bug Fixes

* **client:** buttons are type=button and have tabindex=-1 on password input in UserAddComponent ([1c31b09](https://github.com/jaspero/jms/commit/1c31b094a08556b6d97d6e95d8bb428a6517db65))


### Features

* **client:** allow toggling the type on password input in UserAddComponent, prevented autofill for email/password ([2b15f3a](https://github.com/jaspero/jms/commit/2b15f3ad18012812de7a0821f46518abaaf735e3))
* **client:** prevent login to dashboard for users without a role claim ([37743eb](https://github.com/jaspero/jms/commit/37743eb31a93f795f4aaa490179b84dc0d50bfd0))

# [3.1.0](https://github.com/jaspero/jms/compare/v3.0.0...v3.1.0) (2020-10-14)


### Features

* **client:** don't require layout.order on modules to fetch them ([4f3d748](https://github.com/jaspero/jms/commit/4f3d748d9a5f74fc6c76e3e2d4491d3639e44304))

# [3.0.0](https://github.com/jaspero/jms/compare/v2.1.4...v3.0.0) (2020-10-13)


### Features

* **client:** bumped version; implemented custom component duplicate component; ([d472343](https://github.com/jaspero/jms/commit/d4723432e83ce90b537329238ff78f5f8184d244))


### BREAKING CHANGES

* **client:** We removed the hideDuplicate property on ModuleInstance.

Features like "duplicate" are now implemented through custom components on the form.

## [2.1.4](https://github.com/jaspero/jms/compare/v2.1.3...v2.1.4) (2020-10-08)


### Bug Fixes

* don't use emulator in prod ([108655c](https://github.com/jaspero/jms/commit/108655c03ed042a1d52051f5322ab8b2bf92b4a6))

## [2.1.3](https://github.com/jaspero/jms/compare/v2.1.2...v2.1.3) (2020-10-08)


### Bug Fixes

* properly registering providers in FbModule ([7681bf0](https://github.com/jaspero/jms/commit/7681bf036ec03d301f08ce66204e2f57dbbbb287))

## [2.1.2](https://github.com/jaspero/jms/compare/v2.1.1...v2.1.2) (2020-10-08)


### Bug Fixes

* using AngularFireFunctions instead of firebase functions directly ([5e0acde](https://github.com/jaspero/jms/commit/5e0acde8147d1fe94b3b8b5f744edf0f2667d11d))

## [2.1.1](https://github.com/jaspero/jms/compare/v2.1.0...v2.1.1) (2020-10-06)


### Bug Fixes

* revert imports to afAuth ([c360a13](https://github.com/jaspero/jms/commit/c360a130738578cbfc22d577c937e538303ea54c))

# [2.1.0](https://github.com/jaspero/jms/compare/v2.0.1...v2.1.0) (2020-10-06)


### Bug Fixes

* removed pkgRoot from release in package.json ([cec11e4](https://github.com/jaspero/jms/commit/cec11e4fb27df2d4e7eb0ba145b97be7e8d6151d))


### Features

* added @semantic-release/npm to increment package.json version ([cc7b001](https://github.com/jaspero/jms/commit/cc7b00193a3d1dfe667091a5b737128ace45f819))

## [2.0.1](https://github.com/jaspero/jms/compare/v2.0.0...v2.0.1) (2020-10-06)


### Bug Fixes

* **functions:** export based on read not write permission ([92a34c3](https://github.com/jaspero/jms/commit/92a34c364cbbde3f64f065c44fab6047dcb520fa))

# [2.0.0](https://github.com/jaspero/jms/compare/v1.1.0...v2.0.0) (2020-10-03)


### Bug Fixes

* **client:** filter-tags not showing if value is false ([aad43ee](https://github.com/jaspero/jms/commit/aad43ee2d447be228dd69c702bf5e23241a5e411))


### Features

* export is now configurable and takes in account table setup on a module ([cedd9e2](https://github.com/jaspero/jms/commit/cedd9e24aef33994698fa5212668e876aec35e95))
* **client:** added url() method to DbService ([b519d00](https://github.com/jaspero/jms/commit/b519d009b952270a6d7865bd56fa96356de22767))
* **client:** adjustable columns in table :tada: closes [#190](https://github.com/jaspero/jms/issues/190) ([8b11bf2](https://github.com/jaspero/jms/commit/8b11bf206c90a157a4517911223771c3facd6af7))
* **functions:** export now looks at provided module for authorization, added filter and sort options ([19982ed](https://github.com/jaspero/jms/commit/19982edcd4cf4a897a9468590c4a7144f2395a58))


### BREAKING CHANGES

* **client:** we removed the restApi property from the environment. It's now costructed from the region and project in FbService.

# [1.1.0](https://github.com/jaspero/jms/compare/v1.0.1...v1.1.0) (2020-09-24)


### Features

* made env-config.ts public and added it to the source code ([457640d](https://github.com/jaspero/jms/commit/457640dddc9e63c649ef5e47bb51ad23be0e7e38))

## [1.0.1](https://github.com/jaspero/jms/compare/v1.0.0...v1.0.1) (2020-09-19)


### Bug Fixes

* change private to public of ioc property ([6ca3068](https://github.com/jaspero/jms/commit/6ca3068d808627f6e820022cb5bb44a657a0301f))

# 1.0.0 (2020-09-15)

### Features

- connected semantic-release, updated library version in client. ([6bd8626](https://github.com/jaspero/jms/commit/6bd8626d9f51bae0f33bef08124de3f47b187ad0))

### BREAKING CHANGES

- @jaspero/form-builder has been updated from 2.x to 3.x so forks of jms will need to go through the necessary changes to implement tinymce.
