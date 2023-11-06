const fsExtra = require('fs-extra');
const { Ofn } = require('oro-functions');
const { OHtmlPdf } = require('../dist');
const { PDFExtract } = require('pdf.js-extract');

//

describe('generatePdfOnce', () => {
  test('generatePdfOnce args empty', async () => {
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
      width: 595.91998,
      height: 842.88,
    });
    expect(pdfStructure.pages[0].content).toEqual([]);
  });

  test('generatePdfOnce args html header footer metadata', async () => {
    const headerFooterStyle = `<style>#header, #footer { padding: 0; margin: 0; font-size: 12px }</style>`;
    const brs = `<br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br> \
                     <br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br> \
                     <br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br>`;

    const input = {
      template: {
        html: `<body>Hi {{company}}, my name is {{name}}.${brs}Smile</body>`,
        header: `${headerFooterStyle}<div id="header"><img style="width:50px;height:50px" alt="chacho" src="{{{image}}}" />{{company}}</div>`,
        footer: `${headerFooterStyle}<div id="footer"><div class="pageNumber"></div>/<div class="totalPages"></div>.</div>`,
      },
      data: {
        company: 'Oropensando',
        name: 'Carlos',
        image: `file://${__dirname}/assets/oropensando.jpg`,
      },
      options: {
        output: `${__dirname}/pdf-once.pdf`,
        pdf: { margin: { top: '70px', bottom: '40px' } },
      },
    };

    const response = await OHtmlPdf.generatePdfOnce(input);

    const pdfExists = await fsExtra.exists(`${__dirname}/pdf-once.pdf`);
    await fsExtra.unlink(`${__dirname}/pdf-once.pdf`);

    expect(pdfExists).toBe(true);
    expect(response.status).toBe(true);

    if (!response.status) {
      return;
    }

    const pdfStructure = await new PDFExtract().extractBuffer(response.buffer);
    const content1 = Ofn.arrayValuesByKey(pdfStructure.pages[0].content, 'str').join('');
    const content2 = Ofn.arrayValuesByKey(pdfStructure.pages[1].content, 'str').join('');

    expect(content1).toBe('Oropensando1/2.Hi Oropensando, my name is Carlos.');
    expect(content2).toBe('Oropensando2/2.Smile');
  });
});
