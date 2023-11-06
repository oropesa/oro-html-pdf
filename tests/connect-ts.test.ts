import Ofn from 'oro-functions';
import { OHtmlPdf } from '../dist';

describe('new oHtmlPdf()', () => {
  test('new oHtmlPdf()', async () => {
    const oHtmlPdf = new OHtmlPdf();

    expect(Ofn.type(oHtmlPdf, true)).toBe('_OHtmlPdf');
  });

  test('oHtmlPdf.poolOpen-Close default', async () => {
    const oHtmlPdf = new OHtmlPdf();

    const poolOpened = await oHtmlPdf.poolOpen();
    const poolClosed = await oHtmlPdf.poolClose();

    expect(poolOpened).toEqual({ status: true, msg: 'Connected successfully.' });
    expect(poolClosed).toEqual({ status: true, msg: 'Disconnected successfully.' });
  });

  test('oHtmlPdf.poolOpen twice', async () => {
    const oHtmlPdf = new OHtmlPdf();

    const poolOpened = await oHtmlPdf.poolOpen();
    const poolOpened2 = await oHtmlPdf.poolOpen();
    const poolClosed = await oHtmlPdf.poolClose();

    expect(poolOpened).toEqual({ status: true, msg: 'Connected successfully.' });
    expect(poolOpened2).toEqual({ status: true, msg: 'Connected successfully.' });
    expect(poolClosed).toEqual({ status: true, msg: 'Disconnected successfully.' });
  });

  test('oHtmlPdf.poolClose twice', async () => {
    const oHtmlPdf = new OHtmlPdf();

    const poolOpened = await oHtmlPdf.poolOpen();
    const poolClosed = await oHtmlPdf.poolClose();
    const poolClosed2 = await oHtmlPdf.poolClose();

    expect(poolOpened).toEqual({ status: true, msg: 'Connected successfully.' });
    expect(poolClosed).toEqual({ status: true, msg: 'Disconnected successfully.' });
    expect(poolClosed2).toEqual({ status: true, msg: 'It is already disconnected.' });
  });
});
