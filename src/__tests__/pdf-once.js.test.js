const { Ofn } = require('oro-functions');
const { OHtmlPdf } = require('../oro-html-pdf');
const { PDFExtract } = require('pdf.js-extract');

const { DIN_A4_DEFAULT_WIDTH, DIN_A4_DEFAULT_HEIGHT } = require('./_consts.mocks');

//

describe('generatePdfOnce', () => {
  test('generatePdfOnce args empty undefined', async () => {
    const response = await OHtmlPdf.generatePdfOnce();

    const pdfStructure = await new PDFExtract().extractBuffer(response.buffer);
    const content = Ofn.arrayValuesByKey(pdfStructure.pages[0].content, 'str').join('');

    expect(response.status).toBe(true);
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
