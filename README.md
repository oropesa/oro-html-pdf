# Oro Html PDF

Generate PDFs through headless Chromium using Handlebars & HTML template.

```shell
npm install oro-html-pdf
```

Example:

First declare _data_ and _config_:
```js
const { OHtmlPdf } = require( 'oro-html-pdf' );

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
const responsePdf = await OHtmlPdf.generatePdfOnce( { template, data, options } );
// { status: true, filename: 'file.pdf', filepath: '/absolute/dir/file.pdf', buffer: <ArrayBuffer> }
```

To generate several pdfs:
```js
let oHtmlPdf = new OHtmlPdf();

const poolOpen = await oHtmlPdf.poolOpen( options );
if( ! poolOpen.status ) { return poolOpen; }

const responsePdf = await oHtmlPdf.generatePdf( { template, data, options } );
//const responsePdf2 = await oHtmlPdf.generatePdf( { template, data2, options } );

const poolClose = oHtmlPdf.poolClose( options );
if( ! poolClose.status ) { return poolClose; }

```

### Template advises

#### HEADER / FOOTER. 
To use `template.header`, `template.footer`, define the style `<style>...</style>` of each one inside the template. 
<br>For example:
```js
const template = {
    html: '<style><!-- Affected only in html --></style><body>...</body>',
    header: '<style><!-- Affected only in header --></style><div id="header">...</div>',
    footer: '<style><!-- Affected only in footer --></style><div id="footer">...</div>'
} 
```

#### IMAGES.
To use images in _template-data_ (i.e. `<img src={{{image}}} />`), all of _image-data_ are casted to _base64_.

So to fix _HandleBars escape issues_, use triple brace `{{{image}}}` in _template_ (not `{{image}}`).
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