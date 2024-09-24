## 2.1.2 / 2024-09-24

- Apply `prettier --write` in the whole project (with `endOfLine: 'lf'`).
- Fix eslint `@typescript-eslint/no-unused-expressions` rule in code.
- Update typescript _target_ to `ES2020`.
- Update `eslint` _breakpoint version_ (v8 to v9).
- Updated libs:
  - `axios` from `v1.7.2` to `v1.7.7`.
  - `oro-functions` from `v2.3.1` to `v2.3.2`.
  - `puppeteer` from `v22.13.0` to `v23.4.0`.
- Updated _dev_ libs:
  - `@babel/core` from `v7.24.9` to `v7.25.2`.
  - `@babel/preset-env` from `v7.24.8` to `v7.25.4`.
  - `@eslint/js` from `v9.7.0` to `v9.11.1`.
  - `@types/jest` from `v29.5.12` to `v29.5.13`.
  - `eslint` from `v8.56.0` to `v9.11.1`.
  - `eslint-plugin-jest` from `v28.6.0` to `v28.8.3`.
  - `eslint-plugin-unicorn` from `v54.0.0` to `v55.0.0`.
  - `globals` from `v15.8.0` to `v15.9.0`.
  - `husky` from `v9.0.11` to `v9.1.6`.
  - `nodemon` from `v3.1.4` to `v3.1.7`.
  - `oro-timer` from `v2.1.1` to `v2.2.1`.
  - `tsup` from `v8.1.0` to `v8.3.0`.
  - `typescript` from `v5.5.3` to `v5.5.4`.
  - `typescript-eslint` from `v7.16.1` to `v8.7.0`.

## 2.1.1 / 2024-07-16

- Updated libs:
  - `axios` from `v1.6.8` to `v1.7.2`.
  - `oro-functions` from `v2.3.0` to `v2.3.1`.
  - `puppeteer` from `v22.9.0` to `v22.13.0`.
- Updated _dev_ libs:
  - `@babel/core` from `v7.24.5` to `v7.24.9`.
  - `@babel/preset-env` from `v7.24.5` to `v7.24.8`.
  - `@babel/preset-typescript` from `v7.24.1` to `v7.24.7`.
  - `@eslint/js` from `v9.3.0` to `v9.7.0`.
  - `eslint-plugin-jest` from `v28.5.0` to `v28.6.0`.
  - `eslint-plugin-unicorn` from `v53.0.0` to `v54.0.0`.
  - `globals` from `v15.2.0` to `v15.8.0`.
  - `nodemon` from `v3.1.0` to `v3.1.4`.
  - `oro-timer` from `v2.1.0` to `v2.1.1`.
  - `prettier` from `v3.2.5` to `v3.3.3`.
  - `tsup` from `v8.0.2` to `v8.1.0`.
  - `typescript` from `v5.4.5` to `v5.5.3`.
  - `typescript-eslint` from `v7.9.0` to `v7.16.1`.

## 2.1.0 / 2024-06-02

- Improved _github cicd_ replacing `actions/--@v3` by `actions/--@v4`, and replacing `npm install` to `npm ci`.
- Moved _tests_ inside `src` and simplified `*.test.js` to have only the _special-js_ cases.
- Updated _eslint_ to flat `eslint.config.js`.
- Simplified `tsup.config.ts`.
- Re-init `package-lock.json`.
- Enhanced _prettier_ adding import-sorter.
- Added coverage, right now it's on `80%`.
- Updated libs:
  - `axios` from `v1.6.7` to `v1.6.8`.
  - `oro-functions` from `v2.0.3` to `v2.3.0`.
  - `puppeteer` from `v22.0.0` to `v22.9.0`.
- Updated _dev_ libs:
  - `@babel` from `v7.23.9` to `v7.24.5`.
  - `@babel` from `v7.23.9` to `v7.24.5`.
  - `@babel` from `v7.23.3` to `v7.24.1`.
  - `eslint-plugin-unicorn` from `v51.0.1` to `v53.0.0`.
  - `oro-timer` from `v2.0.6` to `v2.1.0`.
  - `typescript` from `v5.3.3` to `v5.4.5`.
- Added _dev_ libs:
  - `@eslint/js` added `v9.3.0`.
  - `@trivago/prettier-plugin-sort-imports` added `v4.3.0`.
  - `eslint-plugin-jest` added `v28.5.0`.
  - `globals` added `v15.2.0`.
  - `nodemon` added `v3.1.0`.
  - `typescript-eslint` added `v7.9.0`.
- Removed _dev_ libs:
  - `@typescript-eslint/eslint-plugin` removed.
  - `@typescript-eslint/parser` removed.
  - `eslint-config-alloy` removed.

## 2.0.2 / 2024-02-15

- Increase jest test timeout to 25s.
- Updated libs:
  - `axios` from `v1.6.2` to `v1.6.7`.
  - `fs-extra` from `v11.1.1` to `v11.2.0`.
  - `oro-functions` from `v2.0.2` to `v2.0.3`.
  - `puppeteer` from `v21.5.2` to `v22.0.0`.
- Updated _dev_ libs:
  - `@babel/core` from `v7.23.3` to `v7.23.9`.
  - `@babel/preset-env` from `v7.23.3` to `v7.23.9`.
  - `@types/jest` from `v29.5.10` to `v29.5.12`.
  - `@typescript-eslint/eslint-plugin` from `v6.12.0` to `v7.0.1`.
  - `@typescript-eslint/parser` from `v6.12.0` to `v7.0.1`.
  - `eslint` from `v8.54.0` to `v8.56.0`.
  - `eslint-plugin-unicorn` from `v49.0.0` to `v51.0.1`.
  - `husky` from `v8.0.3` to `v9.0.11`.
  - `oro-timer` from `v2.0.5` to `v2.0.6`.
  - `prettier` from `v3.1.0` to `v3.2.5`.
  - `tsup` from `v8.0.1` to `v8.0.2`.
  - `typescript` from `v5.2.2` to `v5.3.3`.

## 2.0.1 / 2023-11-22

- Fixed _github action_ `npm_publish_on_pr_merge_to_master`.
- Updated libs:
  - `axios` from `v1.6.0` to `v1.6.2`.
  - `oro-functions` from `v2.0.1` to `v2.0.2`.
  - `puppeteer` from `v21.5.0` to `v21.5.2`.
- Updated _dev_ libs:
  - `@babel/core` from `v7.23.2` to `v7.23.3`.
  - `@babel/preset-env` from `v7.23.2` to `v7.23.3`.
  - `@babel/preset-typescript` from `v7.23.2` to `v7.23.3`.
  - `@types/fs-extra` from `v11.0.3` to `v11.0.4`.
  - `@types/jest` from `v29.5.7` to `v29.5.10`.
  - `@typescript-eslint/eslint-plugin` from `v6.9.1` to `v6.12.0`.
  - `@typescript-eslint/parser` from `v6.9.1` to `v6.12.0`.
  - `eslint` from `v8.52.0` to `v8.54.0`.
  - `oro-timer` from `v2.0.4` to `v2.0.5`.
  - `prettier` from `v3.0.3` to `v3.1.0`.
  - `tsup` from `v7.2.0` to `v8.0.1`.

## 2.0.0 / 2023-11-06

- Refactored `./index.js` to `./src/*.ts`.
- Updated _package_ as `type: "module"`.
- Added `tsup` and now _package_ is compiled to `cjs` _(common)_ and `mjs` _(module)_.
- Added _github actions_:
  - `validate_pr_to_master`
  - `npm_publish_on_pr_merge_to_master`.
- Added `TS` support.
  - Added _ts tests_.
- Added `package-lock.json`.
- Improved _tests_.
- Improved _readme_.
- Added `husky` (to ensure only valid commits).
- Added `eslint` (and applied it).
- Added `prettier` (and applied it).
- Updated libs:
  - `axios` from `v0.27.2` to `v1.6.0`.
  - `fs-extra` from `v10.1.0` to `v11.1.1`.
  - `handlebars` from `v4.7.7` to `v4.7.8`.
  - `oro-functions` from `v1.2.1` to `v2.0.1`.
  - `puppeteer` from `v18.0.5` to `v21.5.0`.
- Updated _dev_ libs:
  - `jest` from `v29.1.1` to `v29.7.0`.
  - `pdf.js-extract` from `v0.2.0` to `v0.2.1`.

## 1.0.2 / 2022-09-29

- Fixed the use of `handlebars.registerHelper` the function `fullIfEmpty`.
- Updated in `options.handlebars` the possibility to add _custom_ `registerHelper`
- Updated lib `oro-functions` to `v1.2.1`.
- Updated lib `puppeteer` to `v18.0.5`.
- Updated lib-dev `jest` to `v29.1.1`.

## 1.0.1 / 2022-06-21

- Updated lib `oro-functions` to `v1.1.6`.
- Updated lib `puppeteer` to `v14.4.1`.

## 1.0.0 / 2022-06-13

- Added `MIT License`.
- Added _unit testing_ `Jest`.
- Added _package_ in `github.com` & `npmjs.com`.
- Changed the way to cast `data:images` to `base64` using `fs-extra`, instead of `express`.
- Changed _function names_:
  - `processOpen` to `poolOpen`.
  - `processClose` to `poolClose`.
  - `processPdf` to `generatePdf`.
  - `generatePdf` to `generatePdfOnce`.
- Updated _export_, now is `{ OHtmlPdf, processTemplate, castData }`.
- Updated lib `axios` to `v0.27.2`.
- Updated lib `oro-functions` to `v1.1.5`.
- Updated lib `puppeteer` to `v14.3.0`.

## 0.1.12 / 2021-11-19

- Fixed `Handlebars.registerHelper( 'fillIfEmpty' )` force `value` to be an string
- Update `oro-functions` to `1.0.1`.

## 0.1.11 / 2021-11-04

- Updated trying to use new _port_ is `config.port` is not available.

## 0.1.10 / 2021-08-24

- Update `oro-functions` to `1.0.0`.

## 0.1.9 / 2021-08-12

- Added new handlebar helper to fill empty values in html.

## 0.1.8 & 0.1.7 / 2021-07-20

- Fixed check _port_ is available with `Ofn.isPortAvailable`.

## 0.1.6 / 2021-07-20

- Uninstalling `findPort` module.

## 0.1.5 & 0.1.4 / 2021-07-19

- Fixed `port` reference.
- FIX added module `findPort` to check ports usage properly.

## 0.1.3 / 2021-07-19

- The `processClose` method executed synchronously.
- All browser pages closed before close the browser.

## 0.1.2 / 2021-05-17

- Fixed _Readme.md_ information.

## 0.1.1 / 2021-03-25

- Added changelog.
- Change function `generatePdf` as class, with separated methods:<br> `processOpen`, `processPdf`, `processClose`, to allow process several pdfs.
