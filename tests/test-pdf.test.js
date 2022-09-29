const fsExtra = require( 'fs-extra' );
const Ofn = require( 'oro-functions' );
const { OHtmlPdf } = require( '../index' );
const { PDFExtract } = require( 'pdf.js-extract' );

//

let DATA = Ofn.getFileJsonRecursivelySync( `${__dirname}/data.json` );
DATA.logo = DATA.logo.replace( 'file://', `file://${__dirname}/` );

//

describe('generatePdf', () => {

    test( 'generatePdf no-opened', async () => {
        let oHtmlPdf = new OHtmlPdf();

        const response = await oHtmlPdf.generatePdf();

        expect( response.status ).toBe( false );
        expect( response.error.msg ).toBe( 'OHtmlPdf is down.' );
    } );

    test( 'generatePdf args empty', async () => {
        let oHtmlPdf = new OHtmlPdf();

        await oHtmlPdf.poolOpen();
        const response = await oHtmlPdf.generatePdf();
        await oHtmlPdf.poolClose();

        const pdfStructure = await new PDFExtract().extractBuffer( response.buffer );
        const content = Ofn.arrayValuesByKey( pdfStructure.pages[ 0 ].content, 'str' ).join( '' );

        expect( response.status ).toBe( true );
        expect( response.file ).toBe( undefined );
        expect( Ofn.type( response.buffer ) ).toBe( 'uint' );
        expect( pdfStructure.meta.info.Creator ).toBe( 'Chromium' );
        expect( pdfStructure.pages[ 0 ].pageInfo ).toEqual(
            { num: 1, scale: 1, rotation: 0, offsetX: 0, offsetY: 0, width: 594.95996, height: 841.91998 } );
        expect( pdfStructure.pages[ 0 ].content ).toEqual( [] );
    } );

    test( 'generatePdf args no buffer', async () => {
        let oHtmlPdf = new OHtmlPdf();

        await oHtmlPdf.poolOpen();
        const response = await oHtmlPdf.generatePdf( { options: { buffer: false } } );
        await oHtmlPdf.poolClose();

        expect( response.status ).toBe( true );
        expect( response.file ).toBe( undefined );
        expect( response.buffer ).toBe( undefined );
    } );

    test( 'generatePdf args html-simple', async () => {
        let oHtmlPdf = new OHtmlPdf();

        await oHtmlPdf.poolOpen();
        const response = await oHtmlPdf.generatePdf( {
            template: {
                html: '<body><div style="font-size: .9em; color: red">chacho<br><small>tio</small> loco</div></body>'
            }
        } );
        await oHtmlPdf.poolClose();

        const pdfStructure = await new PDFExtract().extractBuffer( response.buffer );
        const content = Ofn.arrayValuesByKey( pdfStructure.pages[ 0 ].content, 'str' ).join( '' );

        expect( response.status ).toBe( true );
        expect( Ofn.type( response.buffer ) ).toBe( 'uint' );
        expect( pdfStructure.meta.info.Creator ).toBe( 'Chromium' );
        expect( pdfStructure.pages[ 0 ].pageInfo ).toEqual(
            { num: 1, scale: 1, rotation: 0, offsetX: 0, offsetY: 0, width: 594.95996, height: 841.91998 } );
        expect( content ).toBe( 'chachotio loco' );
    } );

    test( 'generatePdf args html-simple A5', async () => {
        let oHtmlPdf = new OHtmlPdf();

        await oHtmlPdf.poolOpen();
        const response = await oHtmlPdf.generatePdf( {
            template: {
                html: '<body><div style="font-size: .9em; color: red">chacho<br><small>tio</small></div></body>'
            },
            options: {
                pdf: { format: 'A5', landscape: true }
            }
        } );
        await oHtmlPdf.poolClose();

        const pdfStructure = await new PDFExtract().extractBuffer( response.buffer );
        const content = Ofn.arrayValuesByKey( pdfStructure.pages[ 0 ].content, 'str' ).join( '' );

        expect( response.status ).toBe( true );
        expect( Ofn.type( response.buffer ) ).toBe( 'uint' );
        expect( pdfStructure.meta.info.Creator ).toBe( 'Chromium' );
        expect( pdfStructure.pages[ 0 ].pageInfo ).toEqual(
            { num: 1, scale: 1, rotation: 0, offsetX: 0, offsetY: 0, width: 594.95996, height: 419.03998 } );
        expect( content ).toBe( 'chachotio' );
    } );

    test( 'generatePdf args html-simple wh-custom', async () => {
        let oHtmlPdf = new OHtmlPdf();

        const DELTA = 1 + ( 1 / 3 );

        await oHtmlPdf.poolOpen();
        const response = await oHtmlPdf.generatePdf( {
            template: {
                html: '<style>body{margin:0;padding:0}</style><body><div style="font-size: .9em; color: red">chacho<br><small>tio</small></div></body>'
            },
            options: {
                pdf: { width: 600 * DELTA, height: 300 * DELTA }
            }
        } );
        await oHtmlPdf.poolClose();

        const pdfStructure = await new PDFExtract().extractBuffer( response.buffer );
        const content = Ofn.arrayValuesByKey( pdfStructure.pages[ 0 ].content, 'str' ).join( '' );

        expect( response.status ).toBe( true );
        expect( Ofn.type( response.buffer ) ).toBe( 'uint' );
        expect( pdfStructure.meta.info.Creator ).toBe( 'Chromium' );
        expect( pdfStructure.pages[ 0 ].pageInfo ).toEqual(
            { num: 1, scale: 1, rotation: 0, offsetX: 0, offsetY: 0, width: 600, height: 300 } );
        expect( content ).toBe( 'chachotio' );
    } );

    test( 'generatePdf args url output', async () => {
        let oHtmlPdf = new OHtmlPdf();

        await oHtmlPdf.poolOpen();
        const response = await oHtmlPdf.generatePdf( {
            template: { url: 'https://oropensando.com/extrafiles/oro-html-pdf-test/test.html' },
            options: { output: `${__dirname}/pdf-url.pdf` }
        } );
        await oHtmlPdf.poolClose();

        const pdfStructure = await new PDFExtract().extractBuffer( response.buffer );
        const content = Ofn.arrayValuesByKey( pdfStructure.pages[ 0 ].content, 'str' ).join( '' );

        const pdfUrlTest = await new PDFExtract().extract( `${__dirname}/pdf-url-test.pdf` );
        const pdfContent = Ofn.arrayValuesByKey( pdfUrlTest.pages[ 0 ].content, 'str' ).join( '' );

        let pdfExists = await fsExtra.exists( `${__dirname}/pdf-url.pdf` );
        await fsExtra.unlink( `${__dirname}/pdf-url.pdf` );

        expect( response.status ).toBe( true );
        expect( response.filepath ).toBe( Ofn.sanitizePath( `${__dirname}/pdf-url.pdf` ) );
        expect( response.filename ).toBe( 'pdf-url.pdf' );
        expect( Ofn.type( response.buffer ) ).toBe( 'uint' );
        expect( pdfStructure.meta.info.Creator ).toBe( 'Chromium' );
        expect( content ).toBe( 'Test =P' );
        expect( content ).toBe( pdfContent );
        expect( pdfExists ).toBe( true );
    } );

    test( 'generatePdf args html data incomplete', async () => {
        let oHtmlPdf = new OHtmlPdf();

        await oHtmlPdf.poolOpen();
        const response = await oHtmlPdf.generatePdf( {
            template: {
                html: '<body>Hi {{company}}, my name is {{name}}.</body>'
            },
            data: { company: 'Oropensando' }
        } );
        await oHtmlPdf.poolClose();

        expect( response.status ).toBe( false );
        expect( response.error.msg ).toMatch( /(Error: "name" not defined in data)/ );
    } );

    test( 'generatePdf args html data incomplete no-strict', async () => {
        let oHtmlPdf = new OHtmlPdf();

        await oHtmlPdf.poolOpen();
        const response = await oHtmlPdf.generatePdf( {
            template: {
                html: '<body>Hi {{company}}, my name is {{name}}.</body>'
            },
            data: { company: 'Oropensando' },
            options: { handlebars: { strict: false } }
        } );
        await oHtmlPdf.poolClose();

        const pdfStructure = await new PDFExtract().extractBuffer( response.buffer );
        const content = Ofn.arrayValuesByKey( pdfStructure.pages[ 0 ].content, 'str' ).join( '' );

        expect( response.status ).toBe( true );
        expect( content ).toBe( 'Hi Oropensando, my name is .' );
    } );

    test( 'generatePdf args html data', async () => {
        let oHtmlPdf = new OHtmlPdf();

        await oHtmlPdf.poolOpen();
        const response = await oHtmlPdf.generatePdf( {
            template: {
                html: '<body>Hi {{company}}, my name is {{name}}.</body>'
            },
            data: { company: 'Oropensando', name: 'Carlos' }
        } );
        await oHtmlPdf.poolClose();

        const pdfStructure = await new PDFExtract().extractBuffer( response.buffer );
        const content = Ofn.arrayValuesByKey( pdfStructure.pages[ 0 ].content, 'str' ).join( '' );

        expect( response.status ).toBe( true );
        expect( content ).toBe( 'Hi Oropensando, my name is Carlos.' );
    } );

    test( 'generatePdf args html data img', async () => {
        let oHtmlPdf = new OHtmlPdf();
        await oHtmlPdf.poolOpen();
        const response = await oHtmlPdf.generatePdf( {
            template: {
                html: '<body>Hi {{company}}, my name is {{name}}.<br><img style="width:50px;height:50px" alt="chacho" src="{{{image}}}" /><br>Thanks.</body>'
            },
            data: { company: 'Oropensando', name: 'Carlos', image: `file://${__dirname}/oropensando.jpg` }
        } );
        await oHtmlPdf.poolClose();

        const pdfStructure = await new PDFExtract().extractBuffer( response.buffer );
        const content = Ofn.arrayValuesByKey( pdfStructure.pages[ 0 ].content, 'str' ).join( '' );

        expect( response.status ).toBe( true );
        expect( content ).toBe( 'Hi Oropensando, my name is Carlos.Thanks.' );
    } );

    test( 'generatePdf args html data img bad', async () => {
        let oHtmlPdf = new OHtmlPdf();
        await oHtmlPdf.poolOpen();
        const response = await oHtmlPdf.generatePdf( {
            template: {
                html: '<body>Hi {{company}}, my name is {{name}}.<br><img style="width:50px;height:50px" alt="chacho" src="{{{image}}}" /><br>Thanks.</body>'
            },
            data: { company: 'Oropensando', name: 'Carlos', image: `file://${__dirname}/oropensando.png` }
        } );
        await oHtmlPdf.poolClose();

        const pdfStructure = await new PDFExtract().extractBuffer( response.buffer );
        const content = Ofn.arrayValuesByKey( pdfStructure.pages[ 0 ].content, 'str' ).join( '' );

        expect( response.status ).toBe( true );
        expect( content ).toBe( 'Hi Oropensando, my name is Carlos.chachoThanks.' );
    } );

    test( 'generatePdf args html header footer', async () => {
        let oHtmlPdf = new OHtmlPdf();

        const headerFooterStyle = `<style>#header, #footer { padding: 0; margin: 0; font-size: 12px }</style>`;
        const brs = `<br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br> \
                     <br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br> \
                     <br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br>`;

        await oHtmlPdf.poolOpen();
        const response = await oHtmlPdf.generatePdf( {
            template: {
                html: `<body>Hi {{company}}, my name is {{name}}.${brs}Smile</body>`,
                header: `${headerFooterStyle}<div id="header"><img style="width:40px;height:40px" alt="chacho" src="{{{image}}}" /> Oropensando</div>`,
                footer: `${headerFooterStyle}<div id="footer">Thanks.</div>`
            },
            data: { company: 'Oropensando', name: 'Carlos', image: `file://${__dirname}/oropensando.jpg` },
            options: {
                pdf: { margin: { top: '70px', bottom: '40px' } }
            }
        } );
        await oHtmlPdf.poolClose();

        const pdfStructure = await new PDFExtract().extractBuffer( response.buffer );
        const content1 = Ofn.arrayValuesByKey( pdfStructure.pages[ 0 ].content, 'str' ).join( '' );
        const content2 = Ofn.arrayValuesByKey( pdfStructure.pages[ 1 ].content, 'str' ).join( '' );

        expect( response.status ).toBe( true );
        expect( content1 ).toBe( 'OropensandoThanks.Hi Oropensando, my name is Carlos.' );
        expect( content2 ).toBe( 'OropensandoThanks.Smile' );
    } );

    test( 'generatePdf args html header footer metadata', async () => {
        let oHtmlPdf = new OHtmlPdf();

        const headerFooterStyle = `<style>#header, #footer { padding: 0; margin: 0; font-size: 12px }</style>`;
        const brs = `<br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br> \
                     <br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br> \
                     <br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br>`;

        await oHtmlPdf.poolOpen();
        const response = await oHtmlPdf.generatePdf( {
            template: {
                html: `<body>Hi {{company}}, my name is {{name}}.${brs}Smile</body>`,
                header: `${headerFooterStyle}<div id="header"></div>`,
                footer: `${headerFooterStyle}<div id="footer"><div class="pageNumber"></div>/<div class="totalPages"></div>.</div>`
            },
            data: { company: 'Oropensando', name: 'Carlos', image: `file://${__dirname}/oropensando.jpg` },
            options: {
                pdf: { margin: { top: '70px', bottom: '40px' } }
            }
        } );
        await oHtmlPdf.poolClose();

        const pdfStructure = await new PDFExtract().extractBuffer( response.buffer );
        const content1 = Ofn.arrayValuesByKey( pdfStructure.pages[ 0 ].content, 'str' ).join( '' );
        const content2 = Ofn.arrayValuesByKey( pdfStructure.pages[ 1 ].content, 'str' ).join( '' );

        expect( response.status ).toBe( true );
        expect( content1 ).toBe( '1/2.Hi Oropensando, my name is Carlos.' );
        expect( content2 ).toBe( '2/2.Smile' );
    } );

    test( 'generatePdf args no change', async () => {
        let oHtmlPdf = new OHtmlPdf();

        const headerFooterStyle = `<style>#header, #footer { padding: 0; margin: 0; font-size: 12px }</style>`;
        const brs = `<br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br> \
                     <br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br> \
                     <br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br>`;

        let args = {
            template: {
                html: `<body>Hi {{company}}, my name is {{name}}.${brs}Smile</body>`,
                header: `${headerFooterStyle}<div id="header"></div>`,
                footer: `${headerFooterStyle}<div id="footer"><div class="pageNumber"></div>/<div class="totalPages"></div>.</div>`
            },
            data: { company: 'Oropensando', name: 'Carlos', image: `file://${__dirname}/oropensando.jpg` },
            options: {
                pdf: { margin: { top: '70px', bottom: '40px' } }
            }
        };

        let cloneArgs = Ofn.cloneObject( args );

        await oHtmlPdf.poolOpen();
        const response = await oHtmlPdf.generatePdf( args );
        await oHtmlPdf.poolClose();

        expect( args ).toEqual( cloneArgs );
    } );



    test( 'generatePdf several', async () => {
        let oHtmlPdf = new OHtmlPdf();

        const headerFooterStyle = `<style>#header, #footer { padding: 0; margin: 0; font-size: 12px }</style>`;
        const brs = `<br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br> \
                     <br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br> \
                     <br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br>`;

        let args1 = {
            template: {
                html: `<body>Hi {{company}}, my name is {{name}}.${brs}Smile</body>`,
                header: `${headerFooterStyle}<div id="header"></div>`,
                footer: `${headerFooterStyle}<div id="footer"><div class="pageNumber"></div>/<div class="totalPages"></div>.</div>`
            },
            data: { company: 'Oropensando', name: 'Carlos', image: `file://${__dirname}/oropensando.jpg` },
            options: {
                pdf: { margin: { top: '70px', bottom: '40px' } }
            }
        };

        let args2 = {
            template: {
                html: `<body>Ey {{name}}, my company is {{company}}.${brs}Baz</body>`,
                header: `${headerFooterStyle}<div id="header"></div>`,
                footer: `${headerFooterStyle}<div id="footer"><div class="pageNumber"></div>/<div class="totalPages"></div>.</div>`
            },
            data: { company: 'Foo', name: 'Bar' },
            options: {
                pdf: { margin: { top: '70px', bottom: '40px' } }
            }
        };

        await oHtmlPdf.poolOpen();

        const response1 = await oHtmlPdf.generatePdf( args1 );
        const response2 = await oHtmlPdf.generatePdf( args2 );

        await oHtmlPdf.poolClose();

        //await fsExtra.writeFile( `${__dirname}/pdf-sample.pdf`, response.buffer, 'binary' );

        const pdfStructure1 = await new PDFExtract().extractBuffer( response1.buffer );
        const content1_1 = Ofn.arrayValuesByKey( pdfStructure1.pages[ 0 ].content, 'str' ).join( '' );
        const content1_2 = Ofn.arrayValuesByKey( pdfStructure1.pages[ 1 ].content, 'str' ).join( '' );

        const pdfStructure2 = await new PDFExtract().extractBuffer( response2.buffer );
        const content2_1 = Ofn.arrayValuesByKey( pdfStructure2.pages[ 0 ].content, 'str' ).join( '' );
        const content2_2 = Ofn.arrayValuesByKey( pdfStructure2.pages[ 1 ].content, 'str' ).join( '' );

        expect( response1.status ).toBe( true );
        expect( content1_1 ).toBe( '1/2.Hi Oropensando, my name is Carlos.' );
        expect( content1_2 ).toBe( '2/2.Smile' );

        expect( response2.status ).toBe( true );
        expect( content2_1 ).toBe( '1/2.Ey Bar, my company is Foo.' );
        expect( content2_2 ).toBe( '2/2.Baz' );
    } );

    test( 'generatePdf args with registerHelper', async () => {
        let oHtmlPdf = new OHtmlPdf();
        await oHtmlPdf.poolOpen();
        const response1 = await oHtmlPdf.generatePdf( {
            template: {
                html: '<body>Hi {{company}}, my name is {{name}}.{{extra}}Thanks.</body>'
            },
            data: { company: 'Oropensando', name: 'Carlos', extra: '' }
        } );
        const response2 = await oHtmlPdf.generatePdf( {
            template: {
                html: '<body>Hi {{company}}, my name is {{name}}.{{#fillIfEmpty}}{{extra}}{{/fillIfEmpty}}Thanks.</body>'
            },
            data: { company: 'Oropensando', name: 'Carlos', extra: '' }
        } );
        await oHtmlPdf.poolClose();

        const pdfStructure1 = await new PDFExtract().extractBuffer( response1.buffer );
        const content1 = Ofn.arrayValuesByKey( pdfStructure1.pages[ 0 ].content, 'str' ).join( '' );

        const pdfStructure2 = await new PDFExtract().extractBuffer( response2.buffer );
        const content2 = Ofn.arrayValuesByKey( pdfStructure2.pages[ 0 ].content, 'str' ).join( '' );

        expect( response1.status ).toBe( true );
        expect( content1 ).toBe( 'Hi Oropensando, my name is Carlos.Thanks.' );

        expect( response2.status ).toBe( true );
        expect( content2 ).toBe( 'Hi Oropensando, my name is Carlos. Thanks.' );
    } );

    test( 'generatePdf args with custom registerHelper', async () => {
        let oHtmlPdf = new OHtmlPdf();
        await oHtmlPdf.poolOpen();
        const response1 = await oHtmlPdf.generatePdf( {
            template: {
                html: '<body>Hi {{company}}, my name is {{name}}.{{extra}}Thanks.</body>'
            },
            data: { company: 'Oropensando', name: 'Carlos', extra: '' }
        } );
        const response2 = await oHtmlPdf.generatePdf( {
            template: {
                html: '<body>Hi {{company}}, my name is {{name}}.{{#customIfEmpty}}{{extra}}{{/customIfEmpty}}Thanks.</body>'
            },
            data: { company: 'Oropensando', name: 'Carlos', extra: '' },
            options: {
                handlebars: {
                    registerHelpers: {
                        customIfEmpty: function( args ) {
                            let value = args.fn( this );
                            switch( Ofn.type( value ) ) {
                                case 'string' : return value.trim() === '' ? 'Custom!' : value;
                                case 'number' : case 'boolean': return value;
                                default       : return 'Custom!';
                            }
                        }
                    }
                }
            }
        } );
        await oHtmlPdf.poolClose();

        const pdfStructure1 = await new PDFExtract().extractBuffer( response1.buffer );
        const content1 = Ofn.arrayValuesByKey( pdfStructure1.pages[ 0 ].content, 'str' ).join( '' );

        const pdfStructure2 = await new PDFExtract().extractBuffer( response2.buffer );
        const content2 = Ofn.arrayValuesByKey( pdfStructure2.pages[ 0 ].content, 'str' ).join( '' );

        expect( response1.status ).toBe( true );
        expect( content1 ).toBe( 'Hi Oropensando, my name is Carlos.Thanks.' );

        expect( response2.status ).toBe( true );
        expect( content2 ).toBe( 'Hi Oropensando, my name is Carlos.Custom!Thanks.' );
    } );
});
