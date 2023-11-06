import fsExtra from 'fs-extra';
import { OHtmlPdf } from '../dist';
import { Ofn } from 'oro-functions';
import { PDFExtract } from 'pdf.js-extract';
import type { OHtmlPdfGeneratePdfInputNone, OHtmlPdfGeneratePdfInputOnlyBuffer } from '../dist';
// @ts-ignore
import { DIRNAME } from './utils';

//

describe('generatePdf', () => {
  test('generatePdf no-opened', async () => {
    const oHtmlPdf = new OHtmlPdf();

    const response = await oHtmlPdf.generatePdf({});

    expect(response.status).toBe(false);

    if (response.status) {
      return;
    }

    expect(response.error.type).toBe('OHtmlPdfDown');
    expect(response.error.msg).toBe('OHtmlPdf is closed.');
  });

  test('generatePdf args empty', async () => {
    const oHtmlPdf = new OHtmlPdf();
    await oHtmlPdf.poolOpen();
    const response = await oHtmlPdf.generatePdf({});
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
      width: 595.919_98,
      height: 842.88,
    });
    expect(pdfStructure.pages[0].content).toEqual([]);
  });

  test('generatePdf args no buffer', async () => {
    const input: OHtmlPdfGeneratePdfInputNone = { options: { buffer: false } };

    const oHtmlPdf = new OHtmlPdf();
    await oHtmlPdf.poolOpen();
    const response = await oHtmlPdf.generatePdf(input);
    await oHtmlPdf.poolClose();

    expect(response.status).toBe(true);

    if (!response.status) {
      return;
    }

    expect(response.filename).toBe(undefined);
    expect(response.filepath).toBe(undefined);
    expect(response.buffer).toBe(undefined);
  });

  test('generatePdf args html-simple', async () => {
    const input = {
      template: {
        html: '<body><div style="font-size: .9em; color: red">chacho<br><small>tio</small> loco</div></body>',
      },
    };

    const oHtmlPdf = new OHtmlPdf();
    await oHtmlPdf.poolOpen();
    const response = await oHtmlPdf.generatePdf(input);
    await oHtmlPdf.poolClose();

    expect(response.status).toBe(true);

    if (!response.status) {
      return;
    }

    const pdfStructure = await new PDFExtract().extractBuffer(response.buffer);
    const content = Ofn.arrayValuesByKey(pdfStructure.pages[0].content, 'str').join('');

    expect(Ofn.type(response.buffer)).toBe('uint');
    expect(pdfStructure.pages[0].pageInfo).toEqual({
      num: 1,
      scale: 1,
      rotation: 0,
      offsetX: 0,
      offsetY: 0,
      width: 595.919_98,
      height: 842.88,
    });
    expect(content).toBe('chachotio loco');
  });

  test('generatePdf args html-simple A5', async () => {
    const input: OHtmlPdfGeneratePdfInputOnlyBuffer = {
      template: {
        html: '<body><div style="font-size: .9em; color: red">chacho<br><small>tio</small></div></body>',
      },
      options: {
        pdf: { format: 'A5', landscape: true },
      },
    };

    const oHtmlPdf = new OHtmlPdf();
    await oHtmlPdf.poolOpen();
    const response = await oHtmlPdf.generatePdf(input);
    await oHtmlPdf.poolClose();

    expect(response.status).toBe(true);

    if (!response.status) {
      return;
    }

    const pdfStructure = await new PDFExtract().extractBuffer(response.buffer);
    const content = Ofn.arrayValuesByKey(pdfStructure.pages[0].content, 'str').join('');

    expect(Ofn.type(response.buffer)).toBe('uint');
    expect(pdfStructure.pages[0].pageInfo).toEqual({
      num: 1,
      scale: 1,
      rotation: 0,
      offsetX: 0,
      offsetY: 0,
      width: 595.919_98,
      height: 420,
    });
    expect(content).toBe('chachotio');
  });

  test('generatePdf args html-simple wh-custom', async () => {
    const DELTA = 1 + 1 / 3;
    const input = {
      template: {
        html: '<style>body{margin:0;padding:0}</style><body><div style="font-size: .9em; color: red">chacho<br><small>tio</small></div></body>',
      },
      options: {
        pdf: { width: 600 * DELTA, height: 300 * DELTA },
      },
    };

    const oHtmlPdf = new OHtmlPdf();
    await oHtmlPdf.poolOpen();
    const response = await oHtmlPdf.generatePdf(input);
    await oHtmlPdf.poolClose();

    expect(response.status).toBe(true);

    if (!response.status) {
      return;
    }

    const pdfStructure = await new PDFExtract().extractBuffer(response.buffer);
    const content = Ofn.arrayValuesByKey(pdfStructure.pages[0].content, 'str').join('');

    expect(Ofn.type(response.buffer)).toBe('uint');
    expect(pdfStructure.pages[0].pageInfo).toEqual({
      num: 1,
      scale: 1,
      rotation: 0,
      offsetX: 0,
      offsetY: 0,
      width: 600,
      height: 300,
    });
    expect(content).toBe('chachotio');
  });

  test('generatePdf args url output', async () => {
    const input = {
      template: { url: 'https://oropensando.com/extrafiles/oro-html-pdf-test/test.html' },
      options: { output: `${DIRNAME}/pdf-url-ts.pdf` },
    };

    const oHtmlPdf = new OHtmlPdf();
    await oHtmlPdf.poolOpen();
    const response = await oHtmlPdf.generatePdf(input);
    await oHtmlPdf.poolClose();

    expect(response.status).toBe(true);

    if (!response.status) {
      return;
    }

    const pdfStructure = await new PDFExtract().extractBuffer(response.buffer);
    const content = Ofn.arrayValuesByKey(pdfStructure.pages[0].content, 'str').join('');

    const pdfUrlTest = await new PDFExtract().extract(`${DIRNAME}/assets/pdf-url-test.pdf`);
    const pdfContent = Ofn.arrayValuesByKey(pdfUrlTest.pages[0].content, 'str').join('');

    const pdfExists = await fsExtra.exists(`${DIRNAME}/pdf-url-ts.pdf`);
    await fsExtra.unlink(`${DIRNAME}/pdf-url-ts.pdf`);

    expect(response.filepath).toBe(Ofn.sanitizePath(`${DIRNAME}/pdf-url-ts.pdf`));
    expect(response.filename).toBe('pdf-url-ts.pdf');
    expect(Ofn.type(response.buffer)).toBe('uint');
    expect(content).toBe('Test =P');
    expect(content).toBe(pdfContent);
    expect(pdfExists).toBe(true);
  });

  test('generatePdf args html data incomplete', async () => {
    const input = {
      template: {
        html: '<body>Hi {{company}}, my name is {{name}}.</body>',
      },
      data: { company: 'Oropensando' },
    };

    const oHtmlPdf = new OHtmlPdf();
    await oHtmlPdf.poolOpen();
    const response = await oHtmlPdf.generatePdf(input);
    await oHtmlPdf.poolClose();

    expect(response.status).toBe(false);

    if (response.status) {
      return;
    }

    expect(response.error.type).toMatch('ProcessTemplateFailed');
    expect(response.error.msg).toMatch(/^(Error: "name" not defined in data)/);
  });

  test('generatePdf args html data incomplete no-strict', async () => {
    const input = {
      template: {
        html: '<body>Hi {{company}}, my name is {{name}}.</body>',
      },
      data: { company: 'Oropensando' },
      options: { handlebars: { strict: false } },
    };

    const oHtmlPdf = new OHtmlPdf();
    await oHtmlPdf.poolOpen();
    const response = await oHtmlPdf.generatePdf(input);
    await oHtmlPdf.poolClose();

    expect(response.status).toBe(true);

    if (!response.status) {
      return;
    }

    const pdfStructure = await new PDFExtract().extractBuffer(response.buffer);
    const content = Ofn.arrayValuesByKey(pdfStructure.pages[0].content, 'str').join('');

    expect(content).toBe('Hi Oropensando, my name is .');
  });

  test('generatePdf args html data', async () => {
    const input = {
      template: {
        html: '<body>Hi {{company}}, my name is {{name}}.</body>',
      },
      data: { company: 'Oropensando', name: 'Carlos' },
    };

    const oHtmlPdf = new OHtmlPdf();
    await oHtmlPdf.poolOpen();
    const response = await oHtmlPdf.generatePdf(input);
    await oHtmlPdf.poolClose();

    expect(response.status).toBe(true);

    if (!response.status) {
      return;
    }

    const pdfStructure = await new PDFExtract().extractBuffer(response.buffer);
    const content = Ofn.arrayValuesByKey(pdfStructure.pages[0].content, 'str').join('');

    expect(content).toBe('Hi Oropensando, my name is Carlos.');
  });

  test('generatePdf args html data img', async () => {
    const input = {
      template: {
        html: '<body>Hi {{company}}, my name is {{name}}.<br><img style="width:50px;height:50px" alt="chacho" src="{{{image}}}" /><br>Thanks.</body>',
      },
      data: {
        company: 'Oropensando',
        name: 'Carlos',
        image: `file://${DIRNAME}/assets/oropensando.jpg`,
      },
    };

    const oHtmlPdf = new OHtmlPdf();
    await oHtmlPdf.poolOpen();
    const response = await oHtmlPdf.generatePdf(input);
    await oHtmlPdf.poolClose();

    expect(response.status).toBe(true);

    if (!response.status) {
      return;
    }

    const pdfStructure = await new PDFExtract().extractBuffer(response.buffer);
    const content = Ofn.arrayValuesByKey(pdfStructure.pages[0].content, 'str').join('');

    expect(content).toBe('Hi Oropensando, my name is Carlos.Thanks.');
  });

  test('generatePdf args html data img bad', async () => {
    const input = {
      template: {
        html: '<body>Hi {{company}}, my name is {{name}}.<br><img style="width:50px;height:50px" alt="chacho" src="{{{image}}}" /><br>Thanks.</body>',
      },
      data: {
        company: 'Oropensando',
        name: 'Carlos',
        image: `file://${DIRNAME}/assets/oropensando.png`,
      },
    };

    const oHtmlPdf = new OHtmlPdf();
    await oHtmlPdf.poolOpen();
    const response = await oHtmlPdf.generatePdf(input);
    await oHtmlPdf.poolClose();

    expect(response.status).toBe(true);

    if (!response.status) {
      return;
    }

    const pdfStructure = await new PDFExtract().extractBuffer(response.buffer);
    const content = Ofn.arrayValuesByKey(pdfStructure.pages[0].content, 'str').join('');

    expect(content).toBe('Hi Oropensando, my name is Carlos.chachoThanks.');
  });

  test('generatePdf args html header footer', async () => {
    const headerFooterStyle = `<style>#header, #footer { padding: 0; margin: 0; font-size: 12px }</style>`;
    const brs = `<br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br> \
                     <br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br> \
                     <br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br>`;

    const input = {
      template: {
        html: `<body>Hi {{company}}, my name is {{name}}.${brs}Smile</body>`,
        header: `${headerFooterStyle}<div id="header"><img style="width:40px;height:40px" alt="chacho" src="{{{image}}}" /> Oropensando</div>`,
        footer: `${headerFooterStyle}<div id="footer">Thanks.</div>`,
      },
      data: {
        company: 'Oropensando',
        name: 'Carlos',
        image: `file://${DIRNAME}/assets/oropensando.jpg`,
      },
      options: {
        pdf: { margin: { top: '70px', bottom: '40px' } },
      },
    };

    const oHtmlPdf = new OHtmlPdf();
    await oHtmlPdf.poolOpen();
    const response = await oHtmlPdf.generatePdf(input);
    await oHtmlPdf.poolClose();

    expect(response.status).toBe(true);

    if (!response.status) {
      return;
    }

    const pdfStructure = await new PDFExtract().extractBuffer(response.buffer);
    const content1 = Ofn.arrayValuesByKey(pdfStructure.pages[0].content, 'str').join('');
    const content2 = Ofn.arrayValuesByKey(pdfStructure.pages[1].content, 'str').join('');

    expect(content1).toBe('OropensandoThanks.Hi Oropensando, my name is Carlos.');
    expect(content2).toBe('OropensandoThanks.Smile');
  });

  test('generatePdf args html header footer metadata', async () => {
    const headerFooterStyle = `<style>#header, #footer { padding: 0; margin: 0; font-size: 12px }</style>`;
    const brs = `<br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br> \
                     <br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br> \
                     <br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br>`;

    const input = {
      template: {
        html: `<body>Hi {{company}}, my name is {{name}}.${brs}Smile</body>`,
        header: `${headerFooterStyle}<div id="header"></div>`,
        footer: `${headerFooterStyle}<div id="footer"><div class="pageNumber"></div>/<div class="totalPages"></div>.</div>`,
      },
      data: {
        company: 'Oropensando',
        name: 'Carlos',
        image: `file://${DIRNAME}/assets/oropensando.jpg`,
      },
      options: {
        pdf: { margin: { top: '70px', bottom: '40px' } },
      },
    };

    const oHtmlPdf = new OHtmlPdf();
    await oHtmlPdf.poolOpen();
    const response = await oHtmlPdf.generatePdf(input);
    await oHtmlPdf.poolClose();

    expect(response.status).toBe(true);

    if (!response.status) {
      return;
    }

    const pdfStructure = await new PDFExtract().extractBuffer(response.buffer);
    const content1 = Ofn.arrayValuesByKey(pdfStructure.pages[0].content, 'str').join('');
    const content2 = Ofn.arrayValuesByKey(pdfStructure.pages[1].content, 'str').join('');

    expect(content1).toBe('1/2.Hi Oropensando, my name is Carlos.');
    expect(content2).toBe('2/2.Smile');
  });

  test('generatePdf args no change', async () => {
    const headerFooterStyle = `<style>#header, #footer { padding: 0; margin: 0; font-size: 12px }</style>`;
    const brs = `<br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br> \
                     <br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br> \
                     <br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br>`;

    const input = {
      template: {
        html: `<body>Hi {{company}}, my name is {{name}}.${brs}Smile</body>`,
        header: `${headerFooterStyle}<div id="header"></div>`,
        footer: `${headerFooterStyle}<div id="footer"><div class="pageNumber"></div>/<div class="totalPages"></div>.</div>`,
      },
      data: {
        company: 'Oropensando',
        name: 'Carlos',
        image: `file://${DIRNAME}/assets/oropensando.jpg`,
      },
      options: {
        pdf: { margin: { top: '70px', bottom: '40px' } },
      },
    };

    const cloneInput = Ofn.cloneObject(input);

    const oHtmlPdf = new OHtmlPdf();
    await oHtmlPdf.poolOpen();
    await oHtmlPdf.generatePdf(input);
    await oHtmlPdf.poolClose();

    expect(input).toEqual(cloneInput);
  });

  test('generatePdf several', async () => {
    const headerFooterStyle = `<style>#header, #footer { padding: 0; margin: 0; font-size: 12px }</style>`;
    const brs = `<br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br> \
                     <br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br> \
                     <br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br>`;

    const input1 = {
      template: {
        html: `<body>Hi {{company}}, my name is {{name}}.${brs}Smile</body>`,
        header: `${headerFooterStyle}<div id="header"></div>`,
        footer: `${headerFooterStyle}<div id="footer"><div class="pageNumber"></div>/<div class="totalPages"></div>.</div>`,
      },
      data: {
        company: 'Oropensando',
        name: 'Carlos',
        image: `file://${DIRNAME}/assets/oropensando.jpg`,
      },
      options: {
        pdf: { margin: { top: '70px', bottom: '40px' } },
      },
    };

    const input2 = {
      template: {
        html: `<body>Ey {{name}}, my company is {{company}}.${brs}Baz</body>`,
        header: `${headerFooterStyle}<div id="header"></div>`,
        footer: `${headerFooterStyle}<div id="footer"><div class="pageNumber"></div>/<div class="totalPages"></div>.</div>`,
      },
      data: { company: 'Foo', name: 'Bar' },
      options: {
        pdf: { margin: { top: '70px', bottom: '40px' } },
      },
    };

    const oHtmlPdf = new OHtmlPdf();
    await oHtmlPdf.poolOpen();
    const response1 = await oHtmlPdf.generatePdf(input1);
    const response2 = await oHtmlPdf.generatePdf(input2);
    await oHtmlPdf.poolClose();

    expect(response1.status).toBe(true);
    expect(response2.status).toBe(true);

    if (!response1.status || !response2.status) {
      return;
    }

    const pdfStructure1 = await new PDFExtract().extractBuffer(response1.buffer);
    const content1_1 = Ofn.arrayValuesByKey(pdfStructure1.pages[0].content, 'str').join('');
    const content1_2 = Ofn.arrayValuesByKey(pdfStructure1.pages[1].content, 'str').join('');

    const pdfStructure2 = await new PDFExtract().extractBuffer(response2.buffer);
    const content2_1 = Ofn.arrayValuesByKey(pdfStructure2.pages[0].content, 'str').join('');
    const content2_2 = Ofn.arrayValuesByKey(pdfStructure2.pages[1].content, 'str').join('');

    expect(content1_1).toBe('1/2.Hi Oropensando, my name is Carlos.');
    expect(content1_2).toBe('2/2.Smile');

    expect(content2_1).toBe('1/2.Ey Bar, my company is Foo.');
    expect(content2_2).toBe('2/2.Baz');
  });

  test('generatePdf args with registerHelper', async () => {
    const input1 = {
      template: {
        html: '<body>Hi {{company}}, my name is {{name}}.{{extra}}Thanks.</body>',
      },
      data: { company: 'Oropensando', name: 'Carlos', extra: '' },
    };

    const input2 = {
      template: {
        html: '<body>Hi {{company}}, my name is {{name}}.{{#fillIfEmpty}}{{extra}}{{/fillIfEmpty}}Thanks.</body>',
      },
      data: { company: 'Oropensando', name: 'Carlos', extra: '' },
    };

    const oHtmlPdf = new OHtmlPdf();
    await oHtmlPdf.poolOpen();
    const response1 = await oHtmlPdf.generatePdf(input1);
    const response2 = await oHtmlPdf.generatePdf(input2);
    await oHtmlPdf.poolClose();

    expect(response1.status).toBe(true);
    expect(response2.status).toBe(true);

    if (!response1.status || !response2.status) {
      return;
    }

    const pdfStructure1 = await new PDFExtract().extractBuffer(response1.buffer);
    const content1 = Ofn.arrayValuesByKey(pdfStructure1.pages[0].content, 'str').join('');

    const pdfStructure2 = await new PDFExtract().extractBuffer(response2.buffer);
    const content2 = Ofn.arrayValuesByKey(pdfStructure2.pages[0].content, 'str').join('');

    expect(content1).toBe('Hi Oropensando, my name is Carlos.Thanks.');
    expect(content2).toBe('Hi Oropensando, my name is Carlos. Thanks.');
  });

  test('generatePdf args with custom registerHelper', async () => {
    const input1 = {
      template: {
        html: '<body>Hi {{company}}, my name is {{name}}.{{extra}}Thanks.</body>',
      },
      data: { company: 'Oropensando', name: 'Carlos', extra: '' },
    };

    const input2 = {
      template: {
        html: '<body>Hi {{company}}, my name is {{name}}.{{#customIfEmpty}}{{extra}}{{/customIfEmpty}}Thanks.</body>',
      },
      data: { company: 'Oropensando', name: 'Carlos', extra: '' },
      options: {
        handlebars: {
          registerHelpers: {
            customIfEmpty: function (args: any) {
              const value = args.fn(this);
              switch (Ofn.type(value)) {
                case 'string':
                  return value.trim() === '' ? 'Custom!' : value;
                case 'number':
                case 'boolean':
                  return value;
                default:
                  return 'Custom!';
              }
            },
          },
        },
      },
    };

    const oHtmlPdf = new OHtmlPdf();
    await oHtmlPdf.poolOpen();
    const response1 = await oHtmlPdf.generatePdf(input1);
    const response2 = await oHtmlPdf.generatePdf(input2);
    await oHtmlPdf.poolClose();

    expect(response1.status).toBe(true);
    expect(response2.status).toBe(true);

    if (!response1.status || !response2.status) {
      return;
    }

    const pdfStructure1 = await new PDFExtract().extractBuffer(response1.buffer);
    const content1 = Ofn.arrayValuesByKey(pdfStructure1.pages[0].content, 'str').join('');

    const pdfStructure2 = await new PDFExtract().extractBuffer(response2.buffer);
    const content2 = Ofn.arrayValuesByKey(pdfStructure2.pages[0].content, 'str').join('');

    expect(content1).toBe('Hi Oropensando, my name is Carlos.Thanks.');
    expect(content2).toBe('Hi Oropensando, my name is Carlos.Custom!Thanks.');
  });
});
