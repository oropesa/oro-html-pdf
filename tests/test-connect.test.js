const fsExtra = require( 'fs-extra' );
const Ofn = require( 'oro-functions' );
const { OHtmlPdf } = require( '../index' );

//

const TEMPLATE = Ofn.getFileJsonRecursivelySync( `${__dirname}/template.json` );
let DATA = Ofn.getFileJsonRecursivelySync( `${__dirname}/data.json` );
DATA.logo = DATA.logo.replace( 'file://', `file://${__dirname}/` );

let logoBase64 = fsExtra.readFileSync( `${__dirname}/oropensando.jpg.txt`, 'utf8' );
let simbolBase64 = fsExtra.readFileSync( `${__dirname}/oropensando32.png.txt`, 'utf8' );

//

describe('new oHtmlPdf()', () => {
    test( 'new oHtmlPdf()', async () => {
        let oHtmlPdf = new OHtmlPdf();

        expect( Ofn.type( oHtmlPdf, true ) ).toBe( 'OHtmlPdf' );
    } );

    test( 'oHtmlPdf.poolOpen-Close default', async () => {
        let oHtmlPdf = new OHtmlPdf();

        const poolOpened = await oHtmlPdf.poolOpen();
        const poolClosed = await oHtmlPdf.poolClose();

        expect( poolOpened ).toEqual( { status: true, msg: 'Connected successfully.' } );
        expect( poolClosed ).toEqual( { status: true, msg: 'Disconnected successfully.' } );
    } );

    test( 'oHtmlPdf.poolOpen twice', async () => {
        let oHtmlPdf = new OHtmlPdf();

        const poolOpened = await oHtmlPdf.poolOpen();
        const poolOpened2 = await oHtmlPdf.poolOpen();
        const poolClosed = await oHtmlPdf.poolClose();

        expect( poolOpened ).toEqual( { status: true, msg: 'Connected successfully.' } );
        expect( poolOpened2 ).toEqual( { status: true, msg: 'Connected successfully.' } );
        expect( poolClosed ).toEqual( { status: true, msg: 'Disconnected successfully.' } );
    } );

    test( 'oHtmlPdf.poolClose twice', async () => {
        let oHtmlPdf = new OHtmlPdf();

        const poolOpened = await oHtmlPdf.poolOpen();
        const poolClosed = await oHtmlPdf.poolClose();
        const poolClosed2 = await oHtmlPdf.poolClose();

        expect( poolOpened ).toEqual( { status: true, msg: 'Connected successfully.' } );
        expect( poolClosed ).toEqual( { status: true, msg: 'Disconnected successfully.' } );
        expect( poolClosed2 ).toEqual( { status: true, msg: 'Is already disconnected.' } );
    } );
});
