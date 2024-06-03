# Oro Html PDF

- [Overview](#overview)
- [Installation](#installation)
- [Example](#example)
- [Template advises](#template-advises)
- [Methods](#methods)

## Overview

**Oro Html PDF** Generates PDFs through headless Chromium using Handlebars & HTML template.

## Installation

```shell
npm install oro-html-pdf
```

## Example:

First declare _template_, _data_ and _options_:

```js
// cjs
const { OHtmlPdf } = require( 'oro-html-pdf' );

// mjs, ts
import { OHtmlPdf } from 'oro-html-pdf';

//

const data = {
  name: 'Oropesa',
  project: 'Test',
  logo: 'file://C://absolute/dir/to/img/logo.png'
}

const template = {
  html: `<style>/* ... */</style> \
    <body><div>Hi, {{name}}<br><img alt="{{project}}" src="{{{logo}}}" /></div></body`,
  header: `<style>/* ... */</style> \
    <div id="header">Header {{project}}</div>`,
  footer: `<style>/* ... */</style> \
    <div id="footer">Footer {{project}}</div>`
};

const options = {
  output: 'file.pdf',
  pdf: {
    format: 'A4',
    margin: { top: '50px', bottom: '50px', left: '20px', right: '20px' }
  }
}
```

To generate only 1 pdf:

```js
const responsePdf = await OHtmlPdf.generatePdfOnce({ template, data, options });
// -> {
//   status: true,
//   filename: 'file.pdf',
//   filepath: '/absolute/dir/file.pdf',
//   buffer: <ArrayBuffer>
// }
```

To generate several pdfs:

```js
const oHtmlPdf = new OHtmlPdf();

const poolOpen = await oHtmlPdf.poolOpen( options );
if( ! poolOpen.status ) { return poolOpen; }

const responsePdf = await oHtmlPdf.generatePdf( { template, data, options } );
// const responsePdf2 = await oHtmlPdf.generatePdf( { template, data2, options } );
// const responsePdf3 = await oHtmlPdf.generatePdf( { template, data3, options } );
// ...

await oHtmlPdf.poolClose( options );
// Note: don't forget to close it!

```

## Template advises

#### HEADER / FOOTER.

To use `template.header`, `template.footer`, define the style `<style>...</style>` of each one inside the template.
<br>For example:

```js
const template = {
  html: '<style><!-- Affected only in content --></style><body>...</body>',
  header: '<style><!-- Affected only in header --></style><div id="header">...</div>',
  footer: '<style><!-- Affected only in footer --></style><div id="footer">...</div>',
};
```

#### IMAGES.

To use images in _template-data_, all of _image-data_ are casted to _base64_.

So to fix _HandleBars escape issues_, use triple brace `{{{image}}}` in _template_.

⚠️ wrong:<br>`<img src={{image}} />`,<br>
✔️ use the triple brace instead:<br>`<img src={{{image}}} />`

```js
const data = {
  image: 'file://C://absolute/dir/to/img/image.jpg',
  //...
}

// Correct
const template = {
  html: '<style>...</style><body><div> <img alt="img" src="{{{image}}}" /> </div></body>',
}

// Incorrect
const template = {
  html: '<style>...</style><body><div> <img alt="img" src="{{image}}" /> </div></body>',
}
```

## Methods

<hr>

- [await poolOpen](#await-poolopen)
- [await poolClose](#await-poolclose)
- [await generatePdf](#await-generatepdf)
- [static await generatePdfOnce](#static-await-generatepdfonce)
- [Helper functions](#helper-functions)
  - [await castData](#await-castdata)
  - [processTemplate](#processtemplate)

<hr>

### await poolOpen()

```ts
await poolOpen(args: OHtmlPdfPoolOpenOptions = {}) => Promise<OHtmlPdfPoolOpenResponse>

interface OHtmlPdfPoolOpenOptions {
  oTimer?: OTimer;
  oTimerOpen?: string;
  launch?: PuppeteerLaunchOptions;
}

type OHtmlPdfPoolOpenResponse =
  | SResponseOKBasic
  | SResponseKOObjectSimple<OHtmlPdfPoolOpenError>;

interface SResponseOKBasic {
  status: true,
}

interface SResponseKOObjectSimple {
  status: false,
  error: {
    type: 'PoolOpen';
    msg: string,
    launch: PuppeteerLaunchOptions;
    puppeteerError: Error;
  }
}

interface OHtmlPdfPoolOpenError {
  type: 'PoolOpen';
  launch: PuppeteerLaunchOptions;
  puppeteerError: Error;
}
```

```js
const oHtmlPdf = new OHtmlPdf();

const response = await oHtmlPdf.poolOpen();
// -> { status: true }
```

<hr>

### await poolClose()

```ts
await poolClose(args: OHtmlPdfPoolCloseOptions = {}) => Promise<SResponseOKBasic>

interface OHtmlPdfPoolCloseOptions {
  oTimer?: OTimer;
  oTimerClose?: string;
}

interface SResponseOKBasic {
  status: true,
}
```

```js
const oHtmlPdf = new OHtmlPdf();

const response = await oHtmlPdf.poolClose();
// -> { status: true }
```

<hr>

### await generatePdf()

```ts
await generatePdf<T extends Record<string, any> = {}>(
  args: OHtmlPdfGeneratePdfInput<T>
) => Promise<OHtmlPdfGeneratePdfResponse>

interface OHtmlPdfGeneratePdfInput<T extends Record<string, any> = {}> {
  template?: OHtmlPdfGeneratePdfTemplate;
  data?: T;
  options?: OHtmlPdfGeneratePdfOptions;
}

interface OHtmlPdfGeneratePdfTemplate {
  html?: string;
  header?: string;
  footer?: string;
  url?: string;
}

interface OHtmlPdfGeneratePdfOptions {
  oTimer?: OTimer;
  oTimerExec?: string;
  output?: string;
  handlebars?: HandlebarsOptions;
  hbars?: HandlebarsOptions;
  castData?: boolean;
  buffer?: boolean;
  page?: GoToOptions; // puppeteer
  pdf?: PDFOptions;   // puppeteer
}

//

type OHtmlPdfGeneratePdfResponse =
  | SResponseOKObject<OHtmlPdfGeneratePdfObject>
  | SResponseKOObjectSimple<ProcessTemplateError>
  | SResponseKOObjectSimple<OHtmlPdfGeneratePdfErrorDown>
  | SResponseKOObjectSimple<OHtmlPdfGeneratePdfErrorPage>;

interface SResponseOKObject {
  msg: string;
  filename?: string;
  filepath?: string;
  buffer?: Buffer;
}

interface OHtmlPdfGeneratePdfObject {
  filename?: string;
  filepath?: string;
  buffer?: Buffer;
}

interface SResponseKOObjectSimple {
  status: false,
  error:
    | ProcessTemplateError
    | OHtmlPdfGeneratePdfErrorDown
    | OHtmlPdfGeneratePdfErrorPage
}

interface ProcessTemplateError {
  type: 'ProcessTemplateFailed';
  msg: string;
  handlebarsError?: Error;
}

interface OHtmlPdfGeneratePdfErrorDown {
  type: 'OHtmlPdfDown';
  msg: string;
}

interface OHtmlPdfGeneratePdfErrorPage {
  type: 'PageFailed';
  msg: string;
  page: GoToOptions;
  pdf: PDFOptions;
  puppeteerError: Error;
}
```

```js
const oHtmlPdf = new OHtmlPdf();

const data = {
  name: 'Oropesa',
  project: 'Test',
  logo: 'file://C://absolute/dir/to/img/logo.png'
}

const template = {
  html: `<style>/* ... */</style> \
    <body><div>Hi, {{name}}<br><img alt="{{project}}" src="{{{logo}}}" /></div></body`,
};

// To return only file

const options: OHtmlPdfGeneratePdfOptionsOnlyFile = {
  output: 'file.pdf',
  buffer: false,
}

const response: OHtmlPdfGeneratePdfObjectOnlyFile = await oHtmlPdf.generatePdf();
// -> {
//   status: true,
//   filename: 'file.pdf',
//   filepath: '/absolute/path/file.pdf',
// }


// To return only buffer

const options: OHtmlPdfGeneratePdfOptionsOnlyBuffer = {
  output?: undefined,
  buffer?: true,
}

const response: OHtmlPdfGeneratePdfObjectOnlyBuffer = await oHtmlPdf.generatePdf();
// -> {
//   status: true,
//   buffer: Buffer,
// }


// To return buffer & file

const options: OHtmlPdfGeneratePdfOptionsBufferFile = {
  output: 'file.pdf',
  buffer?: true,
}

const response: OHtmlPdfGeneratePdfObjectBufferFile = await oHtmlPdf.generatePdf();
// -> {
//   status: true,
//   filename: 'file.pdf',
//   filepath: '/absolute/path/file.pdf',
//   buffer: Buffer,
// }
```

<hr>

### static await generatePdfOnce()

```ts
static await generatePdfOnce<T extends Record<string, any>>(
  args: OHtmlPdfGeneratePdfOnceInput<T>,
): Promise<OHtmlPdfGeneratePdfOnceResponse>

interface OHtmlPdfGeneratePdfOnceInput<T extends Record<string, any>> {
  template?: OHtmlPdfGeneratePdfTemplate;
  data?: T;
  options?: OHtmlPdfGeneratePdfOptions & OHtmlPdfPoolOpenOptions & OHtmlPdfPoolCloseOptions;
}

// poolOpen & generatePdf & poolClose
```

```js
const response = await OHtmlPdf.generatePdfOnce( { ... } );
// -> {
//   status: true,
//   filename: 'output.pdf',
//   filepath: '/absolute/path/output.pdf',
//   buffer: Buffer,
// }
```

<hr>

### Helper functions

<hr>

#### await castData

```ts
await castData<T extends Record<string | number, any>>(data: T): Promise<T>
```

```js
const rawData = {
  project: 'Test',
  logo: 'file://assets/oropensando.jpg',
  logosmall: 'https://oropensando.com/extrafiles/oro-html-pdf-test/oropensando32.png',
};

const data = await castData(rawData);
// -> {
//   project: "Test",
//   logo: "...",     // base64 image string
//   logosmall: "..." // base64 image string
// }
```

<hr>

#### processTemplate

```ts
processTemplate<T extends Record<string, any>>(
  html: string,
  data?: T,
  options: HandlebarsOptions = {},
) => ProcessTemplateResponse

type HandlebarsOptions = CompileOptions & {
  registerHelpers?: Record<string, HelperDelegate>;
};

type ProcessTemplateResponse =
  | SResponseOKObject<ProcessTemplateObject>
  | SResponseKOObjectSimple<ProcessTemplateError>

interface SResponseOKObject {
  status: true,
  html: string;
}

interface ProcessTemplateObject {
  html: string;
}

interface SResponseKOObjectSimple {
  status: false,
  error: {
    type: 'ProcessTemplateFailed';
    msg: string;
    handlebarsError?: any;
  }
}

interface ProcessTemplateError {
  type: 'ProcessTemplateFailed';
  msg: string;
  handlebarsError?: any;
}
```
