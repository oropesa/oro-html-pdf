import fsExtra from 'fs-extra';
import { Ofn } from 'oro-functions';
import { OHtmlPdf } from '../dist';
import { PDFExtract } from 'pdf.js-extract';
// @ts-ignore
import { DIRNAME } from './utils';

//

describe('generatePdfOnce', () => {
  test('generatePdfOnce args empty', async () => {
    const response = await OHtmlPdf.generatePdfOnce({});

    expect(response.status).toBe(true);

    if (!response.status) {
      return;
    }

    const pdfStructure = await new PDFExtract().extractBuffer(response.buffer);

    expect(response.status).toBe(true);
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
        image: `file://${DIRNAME}/assets/oropensando.jpg`,
      },
      options: {
        output: `${DIRNAME}/pdf-once-ts.pdf`,
        pdf: { margin: { top: '70px', bottom: '40px' } },
      },
    };

    const response = await OHtmlPdf.generatePdfOnce(input);

    expect(response.status).toBe(true);

    if (!response.status) {
      return;
    }

    const pdfExists = await fsExtra.exists(`${DIRNAME}/pdf-once-ts.pdf`);
    await fsExtra.unlink(`${DIRNAME}/pdf-once-ts.pdf`);

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
