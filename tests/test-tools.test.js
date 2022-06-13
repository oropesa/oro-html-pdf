const fsExtra = require( 'fs-extra' );
const Ofn = require( 'oro-functions' );
const { processTemplate, castData } = require( '../index' );

//

const TEMPLATE = Ofn.getFileJsonRecursivelySync( `${__dirname}/template.json` );
let DATA = Ofn.getFileJsonRecursivelySync( `${__dirname}/data.json` );
DATA.logo = DATA.logo.replace( 'file://', `file://${__dirname}/` );

let logoBase64 = fsExtra.readFileSync( `${__dirname}/oropensando.jpg.txt`, 'utf8' );
let logosmallBase64 = fsExtra.readFileSync( `${__dirname}/oropensando32.png.txt`, 'utf8' );

//

describe('castData', () => {
    test( 'castData null', async () => {
        expect( await castData( null ) ).toBe( null );
    } );

    test( 'castData string', async () => {
        expect( await castData( 'chacho' ) ).toBe( 'chacho' );
    } );

    test( 'castData array empty', async () => {
        expect( await castData( [] ) ).toEqual( [] );
    } );

    test( 'castData obj empty', async () => {
        expect( await castData( {} ) ).toEqual( {} );
    } );

    test( 'castData obj simple', async () => {
        let data = await castData( { chacho: 'loco', tio: 1 } );
        expect( data ).toEqual( { chacho: 'loco', tio: 1 } );
    } );

    test( 'castData obj data', async () => {
        let cloneData = Ofn.cloneObject( DATA );
        let data = await castData( DATA );

        expect( DATA ).toEqual( cloneData );
        expect( data ).toEqual( {
            name: 'Oropesa',
            project: 'Test',
            image: 'oropensando.jpg',
            logo: logoBase64,
            logosmall: logosmallBase64
        } );
    } );

    test( 'castData obj data child', async () => {
        let cloneData = Ofn.cloneObject( DATA );
        cloneData.chacho = { loco: DATA.logo };

        let data = await castData( cloneData );

        expect( data ).toEqual( {
            name: 'Oropesa',
            project: 'Test',
            image: 'oropensando.jpg',
            logo: logoBase64,
            logosmall: logosmallBase64,
            chacho: { loco: logoBase64 }
        } );
    } );
});

describe('processTemplate', () => {
    test( 'processTemplate null', async () => {
        expect( processTemplate( null ) ).toEqual( { status: false, error: { msg: 'param:html is string required.' } } );
    } );

    test( 'processTemplate html null', async () => {
        expect( processTemplate( 'chacho' ) ).toEqual( { status: true, html: 'chacho' } );
    } );

    test( 'processTemplate no-html no-data', async () => {
        expect( processTemplate( 'chacho', { chacho: 'loco' } ) ).toEqual( { status: true, html: 'chacho' } );
    } );

    test( 'processTemplate template no-data', async () => {
        let response = processTemplate( TEMPLATE.html, { chacho: 'loco' } );
        expect( response.status ).toBe( false );
        expect( response.error.msg ).toMatch( /(Error: "name" not defined in data)/ );
    } );

    test( 'processTemplate template no-data no-strict', async () => {
        let response = processTemplate( TEMPLATE.html, { chacho: 'loco' }, { strict: false } );
        expect( response ).toEqual( { status: true, html: `<style>/* ... */</style><div>Hi, <br><img alt="" src="" /></div>` } );
    } );

    test( 'processTemplate template data (bad)', async () => {
        let response = processTemplate( TEMPLATE.html, DATA );
        expect( response ).toEqual( { status: true, html: `<style>/* ... */</style><div>Hi, Oropesa<br><img alt="" src="${DATA.logo}" /></div>` } );
    } );

    test( 'processTemplate template castData', async () => {
        let response = processTemplate( TEMPLATE.html, await castData( DATA ) );
        expect( response ).toEqual( { status: true, html: `<style>/* ... */</style><div>Hi, Oropesa<br><img alt="" src="${logoBase64}" /></div>` } );
    } );
});