## 2.0.0 / 2023-11-06
* Refactored `./index.js` to `./src/*.ts`.
* Updated _package_ as `type: "module"`.
* Added `tsup` and now _package_ is compiled to `cjs` _(common)_ and `mjs` _(module)_.
* Added _github actions_:
  * `validate_pr_to_master`
  * `npm_publish_on_pr_merge_to_master`.
* Added `TS` support.
  * Added _ts tests_.
* Added `package-lock.json`.
* Improved _tests_.
* Improved _readme_.
* Added `husky` (to ensure only valid commits).
* Added `eslint` (and applied it).
* Added `prettier` (and applied it).
* Updated libs:
  * `axios` from `v0.27.2` to `v1.6.0`.
  * `fs-extra` from `v10.1.0` to `v11.1.1`.
  * `handlebars` from `v4.7.7` to `v4.7.8`.
  * `oro-functions` from `v1.2.1` to `v2.0.1`.
  * `puppeteer` from `v18.0.5` to `v21.5.0`.
* Updated _dev_ libs:
  * `jest` from `v29.1.1` to `v29.7.0`.
  * `pdf.js-extract` from `v0.2.0` to `v0.2.1`.

## 1.0.2 / 2022-09-29
* Fixed the use of `handlebars.registerHelper` the function `fullIfEmpty`.
* Updated in `options.handlebars` the possibility to add _custom_ `registerHelper`
* Updated lib `oro-functions` to `v1.2.1`.
* Updated lib `puppeteer` to `v18.0.5`.
* Updated lib-dev `jest` to `v29.1.1`.

## 1.0.1 / 2022-06-21
* Updated lib `oro-functions` to `v1.1.6`.
* Updated lib `puppeteer` to `v14.4.1`.

## 1.0.0 / 2022-06-13
* Added `MIT License`.
* Added _unit testing_ `Jest`.
* Added _package_ in `github.com` & `npmjs.com`.
* Changed the way to cast `data:images` to `base64` using `fs-extra`, instead of `express`.
* Changed _function names_:
  * `processOpen` to `poolOpen`.
  * `processClose` to `poolClose`.
  * `processPdf` to `generatePdf`.
  * `generatePdf` to `generatePdfOnce`.
* Updated _export_, now is `{ OHtmlPdf, processTemplate, castData }`.
* Updated lib `axios` to `v0.27.2`.
* Updated lib `oro-functions` to `v1.1.5`.
* Updated lib `puppeteer` to `v14.3.0`.

## 0.1.12 / 2021-11-19
* Fixed `Handlebars.registerHelper( 'fillIfEmpty' )` force `value` to be an string
* Update `oro-functions` to `1.0.1`.

## 0.1.11 / 2021-11-04
* Updated trying to use new _port_ is `config.port` is not available.

## 0.1.10 / 2021-08-24
* Update `oro-functions` to `1.0.0`.

## 0.1.9 / 2021-08-12
* Added new handlebar helper to fill empty values in html.

## 0.1.8 & 0.1.7 / 2021-07-20
* Fixed check _port_ is available with `Ofn.isPortAvailable`.

## 0.1.6 / 2021-07-20
* Uninstalling `findPort` module.

## 0.1.5 & 0.1.4 / 2021-07-19
* Fixed `port` reference.
* FIX added module `findPort` to check ports usage properly.

## 0.1.3 / 2021-07-19
* The `processClose` method executed synchronously.
* All browser pages closed before close the browser.

## 0.1.2 / 2021-05-17
* Fixed _Readme.md_ information.

## 0.1.1 / 2021-03-25
* Added changelog.
* Change function `generatePdf` as class, with separated methods:<br> `processOpen`, `processPdf`, `processClose`, to allow process several pdfs.
