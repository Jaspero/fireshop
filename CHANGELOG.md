## [3.21.1](https://github.com/jaspero/jms/compare/v3.21.0...v3.21.1) (2021-02-13)


### Bug Fixes

* **client:** translate labels of fields in column sort closes [#209](https://github.com/jaspero/jms/issues/209) ([0975d72](https://github.com/jaspero/jms/commit/0975d72c9dd1a6458d53bd74380cd285fa522dee))

# [3.21.0](https://github.com/jaspero/jms/compare/v3.20.0...v3.21.0) (2021-02-12)


### Features

* added workflow_dispatch to all workflows ([992c83f](https://github.com/jaspero/jms/commit/992c83f06e38a8b3fcc74d846efac4d2e0c0eefd))

# [3.20.0](https://github.com/jaspero/jms/compare/v3.19.2...v3.20.0) (2021-02-07)


### Features

* **functions:** added support for overriding original image with generated version. ([121cdd3](https://github.com/jaspero/jms/commit/121cdd314b17d9f9aea115688da3b72b243b4614))

## [3.19.2](https://github.com/jaspero/jms/compare/v3.19.1...v3.19.2) (2021-02-03)


### Bug Fixes

* hideAdd would always return true if any bool is assigned. hideAdd was overridden on init. improved double braces regex ([670224a](https://github.com/jaspero/jms/commit/670224aa070f46783f2cdde4302c454cd6bb6da9))

## [3.19.1](https://github.com/jaspero/jms/compare/v3.19.0...v3.19.1) (2021-01-31)


### Bug Fixes

* **client:** ColumnPipe set up working ([b3df354](https://github.com/jaspero/jms/commit/b3df354961ef98252cb29ac911fdecfa956ec449))

# [3.19.0](https://github.com/jaspero/jms/compare/v3.18.2...v3.19.0) (2021-01-28)


### Features

* **client:** added InstanceOverviewContextService as an argument to the custom pipe ([0731ad6](https://github.com/jaspero/jms/commit/0731ad6c3849fe982ea2c6c1c08ca3db113481cf))

## [3.18.2](https://github.com/jaspero/jms/compare/v3.18.1...v3.18.2) (2021-01-27)


### Bug Fixes

* **client:** collection names not being translated ([8fc931e](https://github.com/jaspero/jms/commit/8fc931edea481672ed5fe9dd1a1910f2785386bb))

## [3.18.1](https://github.com/jaspero/jms/compare/v3.18.0...v3.18.1) (2021-01-24)


### Bug Fixes

* **client:** lock file update ([d582ea8](https://github.com/jaspero/jms/commit/d582ea828ebdad720e631ac41911cb27413a0238))

# [3.18.0](https://github.com/jaspero/jms/compare/v3.17.0...v3.18.0) (2021-01-23)


### Bug Fixes

* data attribute converts uppercase characters to lowercase, so use kebab-case which will be converted to camelCase ([e110f6e](https://github.com/jaspero/jms/commit/e110f6ecc8f1c00a3b42861a1182e2b7473714fe))


### Features

* prefill collection/subcollection document directly from table actions. added string interpolation in modules ([3555b96](https://github.com/jaspero/jms/commit/3555b9678519c03f30cfbc37545a64270e99ccce))

# [3.17.0](https://github.com/jaspero/jms/compare/v3.16.0...v3.17.0) (2021-01-22)

### Features

- prefill collection/subcollection document directly from table actions. added string interpolation in modules ([3cd9008](https://github.com/jaspero/jms/commit/3cd90081d07ec71d9dc6bc7a42e4644cacfb9f44))

# [3.16.0](https://github.com/jaspero/jms/compare/v3.15.4...v3.16.0) (2021-01-11)

### Features

- update user email from actions ([0d0c07d](https://github.com/jaspero/jms/commit/0d0c07da068db8d83108ac9b37177cd0c0c08584))

## [3.15.4](https://github.com/jaspero/jms/compare/v3.15.3...v3.15.4) (2021-01-04)

### Bug Fixes

- **functions:** trigger-password-reset receiving email wrongly ([d96c9f4](https://github.com/jaspero/jms/commit/d96c9f4468f432ea9bf1ea18f7b0c0614226bffe))

## [3.15.3](https://github.com/jaspero/jms/compare/v3.15.2...v3.15.3) (2021-01-03)

### Bug Fixes

- **client:** removed console logs from mfa page ([f560a0d](https://github.com/jaspero/jms/commit/f560a0d491b2e468f036d4280289ff65f075dc47))

## [3.15.2](https://github.com/jaspero/jms/compare/v3.15.1...v3.15.2) (2021-01-02)

### Bug Fixes

- **client:** resetting fields twice on login error ([611ed24](https://github.com/jaspero/jms/commit/611ed247eccefb2e490c67508106aa473bd6e0f3))

## [3.15.1](https://github.com/jaspero/jms/compare/v3.15.0...v3.15.1) (2021-01-02)

### Bug Fixes

- **client:** MFA login not working ([62f43c6](https://github.com/jaspero/jms/commit/62f43c633e28eb33e2854ff8ba1d781dcddbc289))

# [3.15.0](https://github.com/jaspero/jms/compare/v3.14.0...v3.15.0) (2020-12-27)

### Features

- various adjustments for edit and delete on subcollections ([a2050bc](https://github.com/jaspero/jms/commit/a2050bc2a0bc5a141dd525b62f8cb5eb6e719629))

# [3.14.0](https://github.com/jaspero/jms/compare/v3.13.0...v3.14.0) (2020-12-27)

### Features

- first class support for firestore sub-collections ([74421a2](https://github.com/jaspero/jms/commit/74421a2cb25831610f0eab008fd228516907f1b2))

# [3.13.0](https://github.com/jaspero/jms/compare/v3.12.2...v3.13.0) (2020-12-26)

### Features

- **client:** updated link element to work with query params ([a93fe34](https://github.com/jaspero/jms/commit/a93fe34e29e7e2f712e1378387550f63fcfd2711))

## [3.12.2](https://github.com/jaspero/jms/compare/v3.12.1...v3.12.2) (2020-12-22)

### Bug Fixes

- pass correct key to sort header ([146bf68](https://github.com/jaspero/jms/commit/146bf688884f76874bf9372d237c55a3936a1d9d))

## [3.12.1](https://github.com/jaspero/jms/compare/v3.12.0...v3.12.1) (2020-12-16)

### Bug Fixes

- create-user proper mapping ([a1ef7b8](https://github.com/jaspero/jms/commit/a1ef7b877cf85fb691438f4b88af84ffe7c34ad9))

# [3.12.0](https://github.com/jaspero/jms/compare/v3.11.0...v3.12.0) (2020-12-16)

### Features

- **client:** added notes to users ([50137f2](https://github.com/jaspero/jms/commit/50137f2c3911f4b11b4aea865a88f41bc4d20128))

# [3.11.0](https://github.com/jaspero/jms/compare/v3.10.0...v3.11.0) (2020-12-15)

### Features

- **client:** added module, dbService, stateService and elementsPrefix providers for use in plugins ([584f721](https://github.com/jaspero/jms/commit/584f72113d59e9850b2427bc77f8bd70ae4af034))

# [3.10.0](https://github.com/jaspero/jms/compare/v3.9.4...v3.10.0) (2020-12-10)

### Features

- error login ([7a666af](https://github.com/jaspero/jms/commit/7a666aff74730cc7ceabc3fd599cfec9dc11b64f))
- login error translations ([813b001](https://github.com/jaspero/jms/commit/813b001737258013b48fd4998c3f5ff7d2ac956e))
- login error translations ([7832eb3](https://github.com/jaspero/jms/commit/7832eb39db484647f8777170de93055e262a9c33))

## [3.9.4](https://github.com/jaspero/jms/compare/v3.9.3...v3.9.4) (2020-12-09)

### Bug Fixes

- **user-add:** breaking after user creates successfully ([0b32a88](https://github.com/jaspero/jms/commit/0b32a8869fcf80b4d7b12c3ed302ec7f0fb30e09))

## [3.9.3](https://github.com/jaspero/jms/compare/v3.9.2...v3.9.3) (2020-12-08)

### Bug Fixes

- forgot password a tag style ([f3260e9](https://github.com/jaspero/jms/commit/f3260e94f016d76939b81d3bd8e0f4b939c6f946))

## [3.9.2](https://github.com/jaspero/jms/compare/v3.9.1...v3.9.2) (2020-11-27)

### Bug Fixes

- **client:** table populate working when parsing template ([06857d4](https://github.com/jaspero/jms/commit/06857d466758ce5723190fd34c94f981c494f8e9))

## [3.9.1](https://github.com/jaspero/jms/compare/v3.9.0...v3.9.1) (2020-11-27)

### Bug Fixes

- **functions:** added region to user triggers ([ee17d66](https://github.com/jaspero/jms/commit/ee17d66ef169e6aa175be544531a3b678752b125))

# [3.9.0](https://github.com/jaspero/jms/compare/v3.8.0...v3.9.0) (2020-11-27)

### Features

- **functions:** added static-config; added option for controlling functions region; ([74ed60c](https://github.com/jaspero/jms/commit/74ed60c46220e023e73b56a7d24c6e75119a1321))

# [3.8.0](https://github.com/jaspero/jms/compare/v3.7.1...v3.8.0) (2020-11-22)

### Features

- **client:** table columns can now be populated with data from sub-collections. ([edee4eb](https://github.com/jaspero/jms/commit/edee4eb8ec0ad02a0815837e640b60c90f1e6de6))

## [3.7.1](https://github.com/jaspero/jms/compare/v3.7.0...v3.7.1) (2020-11-18)

### Bug Fixes

- **setup:** created-on populates on load ([79d7d3f](https://github.com/jaspero/jms/commit/79d7d3ff37aa7791ed1ecd2e3ecf5c73f66fc9f9))

# [3.7.0](https://github.com/jaspero/jms/compare/v3.6.0...v3.7.0) (2020-11-17)

### Features

- incremented form-builder library ([63a3243](https://github.com/jaspero/jms/commit/63a32435b854f85708fd6f098f29537044aa2402))

# [3.6.0](https://github.com/jaspero/jms/compare/v3.5.0...v3.6.0) (2020-11-17)

### Features

- extended password reset to support action-controller ([5be6b3f](https://github.com/jaspero/jms/commit/5be6b3f98b2362057e077547eb335e3cc55f06cd))

# [3.5.0](https://github.com/jaspero/jms/compare/v3.4.0...v3.5.0) (2020-11-17)

### Features

- connected mfa :tada: closes [#192](https://github.com/jaspero/jms/issues/192) ([3d8d615](https://github.com/jaspero/jms/commit/3d8d615f5884aa5bff235cc3c80664bd5166b97f))
- connecting MFA :construction: [#192](https://github.com/jaspero/jms/issues/192) ([dd9fde7](https://github.com/jaspero/jms/commit/dd9fde74b1d667b5befb564bf791e275d1f1b677))

# [3.4.0](https://github.com/jaspero/jms/compare/v3.3.1...v3.4.0) (2020-11-14)

### Features

- **client:** made appearance outline default for mat form fields ([f8afbce](https://github.com/jaspero/jms/commit/f8afbcea4905fff8dc618666fe6b3014e4af4d1e))
- **client:** updated to angular v11 ([26e65bf](https://github.com/jaspero/jms/commit/26e65bfc3c5882b5fa295907ddab03c7e227da4a))
- **setup:** split out in to modules and collections and switched to typescript ([107e1ee](https://github.com/jaspero/jms/commit/107e1ee3ef1831dad289bfcd5c7995745aa5fd19))

## [3.3.1](https://github.com/jaspero/jms/compare/v3.3.0...v3.3.1) (2020-11-09)

### Bug Fixes

- **FileCreated:** removed space replace ([735f14f](https://github.com/jaspero/jms/commit/735f14f0ddf89ac65bcd9396bb5271b6d3cae64a))

# [3.3.0](https://github.com/jaspero/jms/compare/v3.2.3...v3.3.0) (2020-11-01)

### Features

- **client:** profile page closes [#171](https://github.com/jaspero/jms/issues/171) ([b3d846d](https://github.com/jaspero/jms/commit/b3d846d42f34756d6e1c15d619a56a9b65de6a7a))

## [3.2.3](https://github.com/jaspero/jms/compare/v3.2.2...v3.2.3) (2020-10-22)

### Bug Fixes

- get modules layout not defined ([7c80e1f](https://github.com/jaspero/jms/commit/7c80e1f056337eeac25926ddb21a8069870482ed))

## [3.2.2](https://github.com/jaspero/jms/compare/v3.2.1...v3.2.2) (2020-10-22)

### Bug Fixes

- replace space in image name ([829f5c4](https://github.com/jaspero/jms/commit/829f5c4588dde3347a8dfcef24a283e8cd85bb7c))

## [3.2.1](https://github.com/jaspero/jms/compare/v3.2.0...v3.2.1) (2020-10-20)

### Bug Fixes

- **client:** missing function parser for root navigation item ([e04c604](https://github.com/jaspero/jms/commit/e04c604ca08c13bb3ff0767d883777865aaa25b6))

# [3.2.0](https://github.com/jaspero/jms/compare/v3.1.0...v3.2.0) (2020-10-17)

### Bug Fixes

- **client:** buttons are type=button and have tabindex=-1 on password input in UserAddComponent ([1c31b09](https://github.com/jaspero/jms/commit/1c31b094a08556b6d97d6e95d8bb428a6517db65))

### Features

- **client:** allow toggling the type on password input in UserAddComponent, prevented autofill for email/password ([2b15f3a](https://github.com/jaspero/jms/commit/2b15f3ad18012812de7a0821f46518abaaf735e3))
- **client:** prevent login to dashboard for users without a role claim ([37743eb](https://github.com/jaspero/jms/commit/37743eb31a93f795f4aaa490179b84dc0d50bfd0))

# [3.1.0](https://github.com/jaspero/jms/compare/v3.0.0...v3.1.0) (2020-10-14)

### Features

- **client:** don't require layout.order on modules to fetch them ([4f3d748](https://github.com/jaspero/jms/commit/4f3d748d9a5f74fc6c76e3e2d4491d3639e44304))

# [3.0.0](https://github.com/jaspero/jms/compare/v2.1.4...v3.0.0) (2020-10-13)

### Features

- **client:** bumped version; implemented custom component duplicate component; ([d472343](https://github.com/jaspero/jms/commit/d4723432e83ce90b537329238ff78f5f8184d244))

### BREAKING CHANGES

- **client:** We removed the hideDuplicate property on ModuleInstance.

Features like "duplicate" are now implemented through custom components on the form.

## [2.1.4](https://github.com/jaspero/jms/compare/v2.1.3...v2.1.4) (2020-10-08)

### Bug Fixes

- don't use emulator in prod ([108655c](https://github.com/jaspero/jms/commit/108655c03ed042a1d52051f5322ab8b2bf92b4a6))

## [2.1.3](https://github.com/jaspero/jms/compare/v2.1.2...v2.1.3) (2020-10-08)

### Bug Fixes

- properly registering providers in FbModule ([7681bf0](https://github.com/jaspero/jms/commit/7681bf036ec03d301f08ce66204e2f57dbbbb287))

## [2.1.2](https://github.com/jaspero/jms/compare/v2.1.1...v2.1.2) (2020-10-08)

### Bug Fixes

- using AngularFireFunctions instead of firebase functions directly ([5e0acde](https://github.com/jaspero/jms/commit/5e0acde8147d1fe94b3b8b5f744edf0f2667d11d))

## [2.1.1](https://github.com/jaspero/jms/compare/v2.1.0...v2.1.1) (2020-10-06)

### Bug Fixes

- revert imports to afAuth ([c360a13](https://github.com/jaspero/jms/commit/c360a130738578cbfc22d577c937e538303ea54c))

# [2.1.0](https://github.com/jaspero/jms/compare/v2.0.1...v2.1.0) (2020-10-06)

### Bug Fixes

- removed pkgRoot from release in package.json ([cec11e4](https://github.com/jaspero/jms/commit/cec11e4fb27df2d4e7eb0ba145b97be7e8d6151d))

### Features

- added @semantic-release/npm to increment package.json version ([cc7b001](https://github.com/jaspero/jms/commit/cc7b00193a3d1dfe667091a5b737128ace45f819))

## [2.0.1](https://github.com/jaspero/jms/compare/v2.0.0...v2.0.1) (2020-10-06)

### Bug Fixes

- **functions:** export based on read not write permission ([92a34c3](https://github.com/jaspero/jms/commit/92a34c364cbbde3f64f065c44fab6047dcb520fa))

# [2.0.0](https://github.com/jaspero/jms/compare/v1.1.0...v2.0.0) (2020-10-03)

### Bug Fixes

- **client:** filter-tags not showing if value is false ([aad43ee](https://github.com/jaspero/jms/commit/aad43ee2d447be228dd69c702bf5e23241a5e411))

### Features

- export is now configurable and takes in account table setup on a module ([cedd9e2](https://github.com/jaspero/jms/commit/cedd9e24aef33994698fa5212668e876aec35e95))
- **client:** added url() method to DbService ([b519d00](https://github.com/jaspero/jms/commit/b519d009b952270a6d7865bd56fa96356de22767))
- **client:** adjustable columns in table :tada: closes [#190](https://github.com/jaspero/jms/issues/190) ([8b11bf2](https://github.com/jaspero/jms/commit/8b11bf206c90a157a4517911223771c3facd6af7))
- **functions:** export now looks at provided module for authorization, added filter and sort options ([19982ed](https://github.com/jaspero/jms/commit/19982edcd4cf4a897a9468590c4a7144f2395a58))

### BREAKING CHANGES

- **client:** we removed the restApi property from the environment. It's now costructed from the region and project in FbService.

# [1.1.0](https://github.com/jaspero/jms/compare/v1.0.1...v1.1.0) (2020-09-24)

### Features

- made env-config.ts public and added it to the source code ([457640d](https://github.com/jaspero/jms/commit/457640dddc9e63c649ef5e47bb51ad23be0e7e38))

## [1.0.1](https://github.com/jaspero/jms/compare/v1.0.0...v1.0.1) (2020-09-19)

### Bug Fixes

- change private to public of ioc property ([6ca3068](https://github.com/jaspero/jms/commit/6ca3068d808627f6e820022cb5bb44a657a0301f))

# 1.0.0 (2020-09-15)

### Features

- connected semantic-release, updated library version in client. ([6bd8626](https://github.com/jaspero/jms/commit/6bd8626d9f51bae0f33bef08124de3f47b187ad0))

### BREAKING CHANGES

- @jaspero/form-builder has been updated from 2.x to 3.x so forks of jms will need to go through the necessary changes to implement tinymce.
