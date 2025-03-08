import path from 'node:path';
import Ofn, { isString } from 'oro-functions';
import type { SResponseKOObjectSimple, SResponseOKBasic, SResponseOKObject } from 'oro-functions';
import type { OTimer } from 'oro-timer';
import puppeteer from 'puppeteer';
import type { Browser, GoToOptions, LaunchOptions, PDFOptions, Page } from 'puppeteer';

import { castData } from './cast-data';
import { processTemplate } from './process-template';
import type { HandlebarsOptions, ProcessTemplateError } from './process-template';

//

export interface OHtmlPdfPoolOpenOptions {
  oTimer?: OTimer;
  oTimerOpen?: string;
  launch?: LaunchOptions;
}

export interface OHtmlPdfPoolOpenError {
  type: 'PoolOpen';
  launch: LaunchOptions;
  puppeteerError: any;
}

export type OHtmlPdfPoolOpenResponse = SResponseOKBasic | SResponseKOObjectSimple<OHtmlPdfPoolOpenError>;

//

export interface OHtmlPdfPoolCloseOptions {
  oTimer?: OTimer;
  oTimerClose?: string;
}

//

export interface OHtmlPdfGeneratePdfTemplate {
  html?: string;
  header?: string;
  footer?: string;
  url?: string;
}

export interface OHtmlPdfGeneratePdfOptions {
  oTimer?: OTimer;
  oTimerExec?: string;
  output?: string;
  handlebars?: HandlebarsOptions;
  hbars?: HandlebarsOptions;
  castData?: boolean;
  buffer?: boolean;
  page?: GoToOptions;
  pdf?: PDFOptions;
}

export interface OHtmlPdfGeneratePdfOptionsOnlyFile {
  oTimer?: OTimer;
  oTimerExec?: string;
  output: string;
  handlebars?: HandlebarsOptions;
  hbars?: HandlebarsOptions;
  castData?: boolean;
  buffer: false;
  page?: GoToOptions;
  pdf?: PDFOptions;
}

export interface OHtmlPdfGeneratePdfOptionsOnlyBuffer {
  oTimer?: OTimer;
  oTimerExec?: string;
  output?: undefined;
  handlebars?: HandlebarsOptions;
  hbars?: HandlebarsOptions;
  castData?: boolean;
  buffer?: true | undefined;
  page?: GoToOptions;
  pdf?: PDFOptions;
}

export interface OHtmlPdfGeneratePdfOptionsBufferFile {
  oTimer?: OTimer;
  oTimerExec?: string;
  output: string;
  handlebars?: HandlebarsOptions;
  hbars?: HandlebarsOptions;
  castData?: boolean;
  buffer?: true | undefined;
  page?: GoToOptions;
  pdf?: PDFOptions;
}

export interface OHtmlPdfGeneratePdfOptionsNone {
  oTimer?: OTimer;
  oTimerExec?: string;
  output?: undefined;
  handlebars?: HandlebarsOptions;
  hbars?: HandlebarsOptions;
  castData?: boolean;
  buffer: false;
  page?: GoToOptions;
  pdf?: PDFOptions;
}

export interface OHtmlPdfGeneratePdfInput<T extends Record<string, any> = object> {
  template?: OHtmlPdfGeneratePdfTemplate;
  data?: T;
  options?: OHtmlPdfGeneratePdfOptions;
}

export interface OHtmlPdfGeneratePdfInputOnlyFile<T extends Record<string, any> = object> {
  template?: OHtmlPdfGeneratePdfTemplate;
  data?: T;
  options: OHtmlPdfGeneratePdfOptionsOnlyFile;
}

export interface OHtmlPdfGeneratePdfInputOnlyBuffer<T extends Record<string, any> = object> {
  template?: OHtmlPdfGeneratePdfTemplate;
  data?: T;
  options?: OHtmlPdfGeneratePdfOptionsOnlyBuffer;
}

export interface OHtmlPdfGeneratePdfInputBufferFile<T extends Record<string, any> = object> {
  template?: OHtmlPdfGeneratePdfTemplate;
  data?: T;
  options: OHtmlPdfGeneratePdfOptionsBufferFile;
}

export interface OHtmlPdfGeneratePdfInputNone<T extends Record<string, any> = object> {
  template?: OHtmlPdfGeneratePdfTemplate;
  data?: T;
  options: OHtmlPdfGeneratePdfOptionsNone;
}

export interface OHtmlPdfGeneratePdfObjectOnlyBuffer {
  buffer: Buffer;
  filename?: undefined;
  filepath?: undefined;
}

export interface OHtmlPdfGeneratePdfObjectOnlyFile {
  filename: string;
  filepath: string;
  buffer?: undefined;
}

export interface OHtmlPdfGeneratePdfObjectBufferFile {
  filename: string;
  filepath: string;
  buffer: Buffer;
}

export interface OHtmlPdfGeneratePdfObjectNone {
  filename?: undefined;
  filepath?: undefined;
  buffer?: undefined;
}

export interface OHtmlPdfGeneratePdfObject {
  filename?: string;
  filepath?: string;
  buffer?: Buffer;
}

export interface OHtmlPdfGeneratePdfErrorDown {
  type: 'OHtmlPdfDown';
}

export interface OHtmlPdfGeneratePdfErrorPage {
  type: 'PageFailed';
  page: GoToOptions;
  pdf: PDFOptions;
  puppeteerError: any;
}

export type OHtmlPdfGeneratePdfResponse =
  | SResponseOKObject<OHtmlPdfGeneratePdfObject>
  | SResponseKOObjectSimple<ProcessTemplateError>
  | SResponseKOObjectSimple<OHtmlPdfGeneratePdfErrorDown>
  | SResponseKOObjectSimple<OHtmlPdfGeneratePdfErrorPage>;

export type OHtmlPdfGeneratePdfResponseOnlyFile =
  | SResponseOKObject<OHtmlPdfGeneratePdfObjectOnlyFile>
  | SResponseKOObjectSimple<ProcessTemplateError>
  | SResponseKOObjectSimple<OHtmlPdfGeneratePdfErrorDown>
  | SResponseKOObjectSimple<OHtmlPdfGeneratePdfErrorPage>;

export type OHtmlPdfGeneratePdfResponseOnlyBuffer =
  | SResponseOKObject<OHtmlPdfGeneratePdfObjectOnlyBuffer>
  | SResponseKOObjectSimple<ProcessTemplateError>
  | SResponseKOObjectSimple<OHtmlPdfGeneratePdfErrorDown>
  | SResponseKOObjectSimple<OHtmlPdfGeneratePdfErrorPage>;

export type OHtmlPdfGeneratePdfResponseBufferFile =
  | SResponseOKObject<OHtmlPdfGeneratePdfObjectBufferFile>
  | SResponseKOObjectSimple<ProcessTemplateError>
  | SResponseKOObjectSimple<OHtmlPdfGeneratePdfErrorDown>
  | SResponseKOObjectSimple<OHtmlPdfGeneratePdfErrorPage>;

export type OHtmlPdfGeneratePdfResponseNone =
  | SResponseOKObject<OHtmlPdfGeneratePdfObjectNone>
  | SResponseKOObjectSimple<ProcessTemplateError>
  | SResponseKOObjectSimple<OHtmlPdfGeneratePdfErrorDown>
  | SResponseKOObjectSimple<OHtmlPdfGeneratePdfErrorPage>;

//

export interface OHtmlPdfGeneratePdfOnceInput<T extends Record<string, any>> {
  template?: OHtmlPdfGeneratePdfTemplate;
  data?: T;
  options?: OHtmlPdfGeneratePdfOptions & OHtmlPdfPoolOpenOptions & OHtmlPdfPoolCloseOptions;
}

export interface OHtmlPdfGeneratePdfOnceInputOnlyFile<T extends Record<string, any>> {
  template?: OHtmlPdfGeneratePdfTemplate;
  data?: T;
  options: OHtmlPdfGeneratePdfOptionsOnlyFile & OHtmlPdfPoolOpenOptions & OHtmlPdfPoolCloseOptions;
}

export interface OHtmlPdfGeneratePdfOnceInputOnlyBuffer<T extends Record<string, any>> {
  template?: OHtmlPdfGeneratePdfTemplate;
  data?: T;
  options?: OHtmlPdfGeneratePdfOptionsOnlyBuffer & OHtmlPdfPoolOpenOptions & OHtmlPdfPoolCloseOptions;
}

export interface OHtmlPdfGeneratePdfOnceInputBufferFile<T extends Record<string, any>> {
  template?: OHtmlPdfGeneratePdfTemplate;
  data?: T;
  options?: OHtmlPdfGeneratePdfOptionsBufferFile & OHtmlPdfPoolOpenOptions & OHtmlPdfPoolCloseOptions;
}

export interface OHtmlPdfGeneratePdfOnceInputNone<T extends Record<string, any>> {
  template?: OHtmlPdfGeneratePdfTemplate;
  data?: T;
  options: OHtmlPdfGeneratePdfOptionsNone & OHtmlPdfPoolOpenOptions & OHtmlPdfPoolCloseOptions;
}

export type OHtmlPdfGeneratePdfOnceResponse =
  | OHtmlPdfGeneratePdfResponse
  | SResponseKOObjectSimple<OHtmlPdfPoolOpenError>;

export type OHtmlPdfGeneratePdfOnceResponseOnlyFile =
  | OHtmlPdfGeneratePdfResponseOnlyFile
  | SResponseKOObjectSimple<OHtmlPdfPoolOpenError>;

export type OHtmlPdfGeneratePdfOnceResponseOnlyBuffer =
  | OHtmlPdfGeneratePdfResponseOnlyBuffer
  | SResponseKOObjectSimple<OHtmlPdfPoolOpenError>;

export type OHtmlPdfGeneratePdfOnceResponseBufferFile =
  | OHtmlPdfGeneratePdfResponseBufferFile
  | SResponseKOObjectSimple<OHtmlPdfPoolOpenError>;

export type OHtmlPdfGeneratePdfOnceResponseNone =
  | OHtmlPdfGeneratePdfResponseNone
  | SResponseKOObjectSimple<OHtmlPdfPoolOpenError>;

export class OHtmlPdf {
  public static async generatePdfOnce<T extends Record<string, any>>(
    args: OHtmlPdfGeneratePdfOnceInputOnlyFile<T>,
  ): Promise<OHtmlPdfGeneratePdfOnceResponseOnlyFile>;
  public static async generatePdfOnce<T extends Record<string, any>>(
    args: OHtmlPdfGeneratePdfOnceInputOnlyBuffer<T>,
  ): Promise<OHtmlPdfGeneratePdfOnceResponseOnlyBuffer>;
  public static async generatePdfOnce<T extends Record<string, any>>(
    args: OHtmlPdfGeneratePdfOnceInputBufferFile<T>,
  ): Promise<OHtmlPdfGeneratePdfOnceResponseBufferFile>;
  public static async generatePdfOnce<T extends Record<string, any>>(
    args: OHtmlPdfGeneratePdfOnceInputNone<T>,
  ): Promise<OHtmlPdfGeneratePdfOnceResponseNone>;
  public static async generatePdfOnce<T extends Record<string, any>>(
    args: OHtmlPdfGeneratePdfOnceInput<T>,
  ): Promise<OHtmlPdfGeneratePdfOnceResponse> {
    const { template, data, options } = args ?? {};

    const oHtmlPdf = new OHtmlPdf();

    const poolOpen = await oHtmlPdf.poolOpen(options);
    if (!poolOpen.status) {
      return poolOpen;
    }

    let response: OHtmlPdfGeneratePdfOnceResponse;

    if (options?.buffer === false && isString(options.output)) {
      response = await oHtmlPdf.generatePdf({
        template,
        data,
        options: options as OHtmlPdfGeneratePdfOptionsOnlyFile,
      });
    } else if (options?.buffer === false && options.output === undefined) {
      response = await oHtmlPdf.generatePdf({
        template,
        data,
        options: options as OHtmlPdfGeneratePdfOptionsNone,
      });
    } else if (options?.buffer !== false && isString(options?.output)) {
      response = await oHtmlPdf.generatePdf({
        template,
        data,
        options: options as OHtmlPdfGeneratePdfOptionsBufferFile,
      });
    } else {
      response = await oHtmlPdf.generatePdf({
        template,
        data,
        options: options as OHtmlPdfGeneratePdfOptionsOnlyBuffer,
      });
    }

    await oHtmlPdf.poolClose(options);

    return response;
  }

  #browser?: Browser;

  public async poolOpen(args: OHtmlPdfPoolOpenOptions = {}): Promise<OHtmlPdfPoolOpenResponse> {
    if (this.#browser) {
      const poolClosed = await this.poolClose(args);
      if (!poolClosed.status) {
        return poolClosed;
      }
    }

    if (args.oTimer) {
      args.oTimer.step(args.oTimerOpen || 'OHtmlPdfPoolOpen');
    }

    //

    const launch = args.launch ?? { args: ['--no-sandbox', '--disable-setuid-sandbox'] };
    if (launch.headless === undefined) {
      launch.headless = true;
    }

    try {
      this.#browser = await puppeteer.launch(launch);
      return Ofn.setResponseOK('Connected successfully.');
    } catch (error) {
      return Ofn.setResponseKO(`Puppetter failed.`, {
        type: 'PoolOpen',
        launch,
        puppeteerError: error,
      });
    }
  }

  public async poolClose(args: OHtmlPdfPoolCloseOptions = {}): Promise<SResponseOKBasic> {
    if (args.oTimer) {
      args.oTimer.step(args.oTimerClose || 'OHtmlPdfPoolClose');
    }

    if (!this.#browser) {
      return Ofn.setResponseOK('It is already disconnected.');
    }

    if (this.#browser) {
      const pages = await this.#browser.pages();
      await Promise.all(pages.map((page) => page.close()));
      await this.#browser.close();
      this.#browser = undefined;
    }

    return Ofn.setResponseOK('Disconnected successfully.');
  }

  public async generatePdf<T extends Record<string, any> = object>(
    args: OHtmlPdfGeneratePdfInputOnlyFile<T>,
  ): Promise<OHtmlPdfGeneratePdfResponseOnlyFile>;
  public async generatePdf<T extends Record<string, any> = object>(
    args: OHtmlPdfGeneratePdfInputOnlyBuffer<T>,
  ): Promise<OHtmlPdfGeneratePdfResponseOnlyBuffer>;
  public async generatePdf<T extends Record<string, any> = object>(
    args: OHtmlPdfGeneratePdfInputBufferFile<T>,
  ): Promise<OHtmlPdfGeneratePdfResponseBufferFile>;
  public async generatePdf<T extends Record<string, any> = object>(
    args: OHtmlPdfGeneratePdfInputNone<T>,
  ): Promise<OHtmlPdfGeneratePdfResponseNone>;
  public async generatePdf<T extends Record<string, any> = object>(
    args: OHtmlPdfGeneratePdfInput<T>,
  ): Promise<OHtmlPdfGeneratePdfResponse> {
    const { template, data, options } = args ?? {};

    if (options?.oTimer) {
      options.oTimer.step(options.oTimerExec ?? 'OHtmlPdfGeneratePdf');
    }

    if (!this.#browser) {
      return Ofn.setResponseKO('OHtmlPdf is closed.', { type: 'OHtmlPdfDown' });
    }

    const responseTemplate = await setTemplateData({ template, data, options });
    if (!responseTemplate.status) {
      return responseTemplate;
    }

    const cloneTemplate = responseTemplate.template;

    //

    const cloneOptions = Ofn.cloneObject(options);

    const goToOptions = cloneOptions.page ?? { waitUntil: 'networkidle2' };
    const pdfOptions = cloneOptions.pdf ?? { format: 'A4', printBackground: true };

    pdfOptions.headerTemplate = pdfOptions.headerTemplate ?? cloneTemplate.header;
    pdfOptions.footerTemplate = pdfOptions.footerTemplate ?? cloneTemplate.footer;
    pdfOptions.displayHeaderFooter = !!pdfOptions.headerTemplate || !!pdfOptions.footerTemplate;

    pdfOptions.path = pdfOptions.path ?? cloneOptions.output;
    if (pdfOptions.path) {
      pdfOptions.path = path.resolve(pdfOptions.path);
    }

    //

    let response;
    let page: Page;

    try {
      page = await this.#browser.newPage();
    } catch (error) {
      return Ofn.setResponseKO(`Puppetter Page.New failed.`, {
        type: 'PageFailed',
        page: goToOptions,
        pdf: pdfOptions,
        puppeteerError: error,
      });
    }

    try {
      await page.goto(cloneTemplate.url ?? `data:text/html,${cloneTemplate.html || ''}`, goToOptions);
    } catch (error) {
      return Ofn.setResponseKO(`Puppetter Page.GoTo failed.`, {
        type: 'PageFailed',
        page: goToOptions,
        pdf: pdfOptions,
        puppeteerError: error,
      });
    }

    try {
      response = await page.pdf(pdfOptions);
    } catch (error) {
      return Ofn.setResponseKO(`Puppetter Page.PDF failed.`, {
        type: 'PageFailed',
        page: goToOptions,
        pdf: pdfOptions,
        puppeteerError: error,
      });
    }

    const output: OHtmlPdfGeneratePdfObject = {};

    if (pdfOptions.path) {
      output.filename = Ofn.getFilenameByPath(pdfOptions.path);
      output.filepath = Ofn.sanitizePath(pdfOptions.path);
    }
    if (cloneOptions.buffer !== false) {
      output.buffer = Buffer.from(Object.values(response));
    }

    return Ofn.setResponseOK(output);
  }
}

//

interface SetTemplateDataInput<T> {
  template?: OHtmlPdfGeneratePdfTemplate;
  data?: T;
  options?: Pick<OHtmlPdfGeneratePdfOptions, 'handlebars' | 'hbars' | 'castData'>;
}

type SetTemplateDataResponse =
  | SResponseOKObject<{ template: OHtmlPdfGeneratePdfTemplate }>
  | SResponseKOObjectSimple<ProcessTemplateError>;

async function setTemplateData<T extends Record<string, any>>({
  template,
  data,
  options,
}: SetTemplateDataInput<T>): Promise<SetTemplateDataResponse> {
  // note: save handlebarsOptions before clone because registerHelpers functions get broken.
  const handlebarsOptions = options?.handlebars ?? options?.hbars ?? {};

  const cloneTemplate = Ofn.cloneObject(template);

  let cloneData = Ofn.cloneObject(data);
  if (options?.castData !== false) {
    cloneData = await castData(cloneData);
  }

  if (cloneTemplate.html) {
    const htmlProcessed = processTemplate<T>(cloneTemplate.html, cloneData, handlebarsOptions);
    if (!htmlProcessed.status) {
      return htmlProcessed;
    }

    cloneTemplate.html = htmlProcessed.html;
  }

  if (cloneTemplate.header) {
    const htmlProcessed = processTemplate(cloneTemplate.header, cloneData, handlebarsOptions);
    if (!htmlProcessed.status) {
      return htmlProcessed;
    }

    cloneTemplate.header = htmlProcessed.html;
  }

  if (cloneTemplate.footer) {
    const htmlProcessed = processTemplate(cloneTemplate.footer, cloneData, handlebarsOptions);
    if (!htmlProcessed.status) {
      return htmlProcessed;
    }
    cloneTemplate.footer = htmlProcessed.html;
  }

  return Ofn.setResponseOK({ template: cloneTemplate });
}
