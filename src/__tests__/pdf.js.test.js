const fsExtra = require('fs-extra');
const { OHtmlPdf } = require('../oro-html-pdf');
const { Ofn } = require('oro-functions');
const { PDFExtract } = require('pdf.js-extract');

const { DIN_A4_DEFAULT_WIDTH, DIN_A4_DEFAULT_HEIGHT } = require('./_consts.mocks');

//

describe('generatePdf', () => {
  test('generatePdf no-opened undefined', async () => {
    const oHtmlPdf = new OHtmlPdf();

    const response = await oHtmlPdf.generatePdf();

    expect(response.status).toBe(false);
    expect(response.error.type).toBe('OHtmlPdfDown');
    expect(response.error.msg).toBe('OHtmlPdf is closed.');
  });

  test('generatePdf args empty undefined', async () => {
    const oHtmlPdf = new OHtmlPdf();
    await oHtmlPdf.poolOpen();
    const response = await oHtmlPdf.generatePdf();
    await oHtmlPdf.poolClose();

    expect(response.status).toBe(true);

    if (!response.status) {
      return;
    }

    const pdfStructure = await new PDFExtract().extractBuffer(response.buffer);

    expect(response.filename).toBe(undefined);
    expect(response.filepath).toBe(undefined);
    expect(Ofn.type(response.buffer)).toBe('uint');
    expect(pdfStructure.pages[0].pageInfo).toEqual({
      num: 1,
      scale: 1,
      rotation: 0,
      offsetX: 0,
      offsetY: 0,
      width: DIN_A4_DEFAULT_WIDTH,
      height: DIN_A4_DEFAULT_HEIGHT,
    });
    expect(pdfStructure.pages[0].content).toEqual([]);
  });
});
