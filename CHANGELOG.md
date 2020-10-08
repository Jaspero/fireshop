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
