const axios = require( 'axios' );
const { resolve } = require( 'path' );
const fsExtra = require( 'fs-extra' );
const Ofn = require( 'oro-functions' );
const puppeteer = require( 'puppeteer' );
const Handlebars = require( 'handlebars' );

async function castData( data ) {
    if( ! [ 'object', 'array' ].includes( Ofn.type( data ) ) || Ofn.objIsEmpty( data ) ) { return data; }

    let cloneData = Ofn.cloneObject( data );

    for( const key of Object.keys( cloneData ) ) {
        if( [ 'object', 'array' ].includes( Ofn.type( cloneData[ key ] ) ) ) {
            cloneData[ key ] = await castData( cloneData[ key ] );
            continue;
        }

        //only string that start with 'http' or 'file://'
        if( ! Ofn.isString( cloneData[ key ] ) ) { continue; }
        if( ! ( /^(http[s]?|file):\/\/.*\.(jpg|jpeg|png)$/ ).test( cloneData[ key ] ) ) { continue; }

        //cast 2 base64
        if( cloneData[ key ].indexOf( 'file:' ) === 0 ) {
            let responseImage = await fsExtra.readFile( cloneData[ key ].replace( 'file://', '' ) ).catch( err => Ofn.setResponseKO( { err } ) );
            if( responseImage.status === undefined ) {
                cloneData[ key ] = `data:image/${Ofn.getFilenameExtByName( cloneData[ key ] )};base64,${Buffer.from( responseImage ).toString( 'base64' )}`;
            }
        }
        else {
            let responseImage = await axios.get( cloneData[ key ], { responseType: 'arraybuffer' } ).catch( e => e );
            if( responseImage.status === 200 ) {
                cloneData[ key ] = `data:image/${Ofn.getFilenameExtByName( cloneData[ key ] )};base64,${Buffer.from( responseImage.data ).toString( 'base64' )}`
            }
        }
    }

    return cloneData;
}

function processTemplate( html, data, options = {} ) {
    if( ! Ofn.isString( html ) ) { return Ofn.setResponseKO( 'param:html is string required.' ) }
    if( ! Ofn.isObject( data ) || Ofn.objIsEmpty( data ) ) { return Ofn.setResponseOK( { html } ) }

    let opts = Ofn.cloneObject( Ofn.isObject( options ) ? options : {} );
    opts.strict === undefined && ( opts.strict = true );

    try {
        const template = Handlebars.compile( html, opts );

        // Helpers
        Handlebars.registerHelper( 'fillIfEmpty' , function( args ) {
            let value = args.fn( this );
            switch( Ofn.type( value ) ) {
                case 'string' : return value.trim() === '' ?  '&nbsp;' : value;
                case 'number' : case 'boolean': return value;
                default       : return '&nbsp;';
            }
        });

        if( options && options.registerHelpers && Ofn.isObject( options.registerHelpers ) ) {
            console.log( Object.keys( options.registerHelpers ) );
            for( const registerHelperName of Object.keys( options.registerHelpers ) ) {
                Handlebars.registerHelper( registerHelperName, options.registerHelpers[ registerHelperName ] );
            }
        }

        //

        return Ofn.setResponseOK( { html: template( data ) } );
    }
    catch( err ) {
        let msg = err.toString().split( '\r\n' )[ 0 ].replace( '\n', ' ' );
        msg = msg.replace( '[object Object]', 'data' );

        return Ofn.setResponseKO( msg, { handlebarsError: err } );
    }
}

class OHtmlPdf {

    #browser;

    async poolOpen( args = {} ) {
        if( !! this.#browser ) {
            let poolClosed = await this.poolClose( args );
            if( ! poolClosed.status ) { return poolClosed; }
        }
        if( args.oTimer ) { args.oTimer.step( args.oTimerOpen || 'OHtmlPdfPoolOpen' ); }

        //

        let launch = { args: [ '--no-sandbox', '--disable-setuid-sandbox' ] };
        args.launch && ( launch = args.launch );

        try {
            this.#browser = await puppeteer.launch( launch );
            return Ofn.setResponseOK( 'Connected successfully.' );
        }
        catch( e ) {
            return Ofn.setResponseKO( `Puppetter failed.`, { launch, puppeteerError: e } )
        }
    }

    async poolClose( args = {} ) {
        if( args.oTimer ) { args.oTimer.step( args.oTimerClose || 'OHtmlPdfPoolClose' ); }
        if( ! this.#browser ) { return Ofn.setResponseOK( 'Is already disconnected.' ); }

        if( !! this.#browser ) {
            let pages = await this.#browser.pages();
            await Promise.all( pages.map( page => page.close() ) );
            await this.#browser.close();
            this.#browser = null;
        }

        return Ofn.setResponseOK( 'Disconnected successfully.' );
    }

    async generatePdf( { template, data, options } = {} ) {
        if( options && options.oTimer ) { options.oTimer.step( options.oTimerExec || 'OHtmlPdfGeneratePdf' ); }
        if( ! this.#browser ) { return Ofn.setResponseKO( 'OHtmlPdf is down.' ); }

        options === undefined && ( options = {} );
        //save optHBars before clone because registerHelpers functions get broken.
        const optHBars = options.handlebars || options.hbars || {};

        let cloneOptions = Ofn.cloneObject( options );
        let cloneTemplate = Ofn.cloneObject( template );
        let cloneData = Ofn.cloneObject( data );

        if( cloneOptions.castData !== false ) {
            cloneData = await castData( cloneData );
        }

        //

        if( cloneTemplate.html ) {
            let htmlProcessed = processTemplate( cloneTemplate.html, cloneData, optHBars );
            if( ! htmlProcessed.status ) { return htmlProcessed; }
            cloneTemplate.html = htmlProcessed.html;
        }

        if( cloneTemplate.header ) {
            let htmlProcessed = processTemplate( cloneTemplate.header, cloneData, optHBars );
            if( ! htmlProcessed.status ) { return htmlProcessed; }
            cloneTemplate.header = htmlProcessed.html;
        }

        if( cloneTemplate.footer ) {
            let htmlProcessed = processTemplate( cloneTemplate.footer, cloneData, optHBars );
            if( ! htmlProcessed.status ) { return htmlProcessed; }
            cloneTemplate.footer = htmlProcessed.html;
        }

        let page = { waitUntil: 'networkidle2' };
        cloneOptions.page && ( page = cloneOptions.page );

        let pdf = { format: "A4", printBackground: true };
        cloneOptions.pdf && ( pdf = cloneOptions.pdf );

        ! pdf.headerTemplate && cloneTemplate.header && ( pdf.headerTemplate = cloneTemplate.header );
        ! pdf.footerTemplate && cloneTemplate.footer && ( pdf.footerTemplate = cloneTemplate.footer );

        if( !! pdf.headerTemplate || !! pdf.footerTemplate ) {
            pdf.displayHeaderFooter = true;
        }

        ! pdf.path && cloneOptions.output && ( pdf.path = cloneOptions.output );
        pdf.path && ( pdf.path = resolve( pdf.path ) );

        //

        let response;

        try {
            const page = await this.#browser.newPage();
            await page.goto( cloneTemplate.url ? cloneTemplate.url : `data:text/html,${cloneTemplate.html || ''}`, page );
            response = await page.pdf( pdf );
        }
        catch( err ) {
            return Ofn.setResponseKO( `Puppetter Page failed.`, { page, pdf, puppeteerError: err } );
        }

        let output = {};
        pdf.path && ( output.filename = Ofn.getFilenameByPath( pdf.path ) );
        pdf.path && ( output.filepath = Ofn.sanitizePath( pdf.path ) );
        cloneOptions.buffer !== false && ( output.buffer = Buffer.from( Object.values( response ) ) );

        return Ofn.setResponseOK( output );
    }

    //

    static async generatePdfOnce( { template, data, options } = {} ) {
        let oHtmlPdf = new OHtmlPdf();

        let poolOpen = await oHtmlPdf.poolOpen( options );
        if( ! poolOpen.status ) { return poolOpen; }

        let response = await oHtmlPdf.generatePdf( { template, data, options } );

        let poolClose = await oHtmlPdf.poolClose( options );
        if( ! poolClose.status ) { return poolClose; }

        return response;
    }
}

module.exports = { OHtmlPdf, processTemplate, castData };