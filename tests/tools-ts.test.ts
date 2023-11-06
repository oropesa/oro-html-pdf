import { Ofn } from 'oro-functions';
import { processTemplate, castData } from '../dist';
// @ts-ignore
import { TEMPLATE, DATA, LOGO_BASE64, LOGO_SMALL_BASE64 } from './utils';

//

describe('castData', () => {
  // test('castData null', async () => {
  //   expect(await castData(null)).toBe(null);
  // });

  // test('castData string', async () => {
  //   expect(await castData('chacho')).toBe('chacho');
  // });

  test('castData array empty', async () => {
    expect(await castData([])).toEqual([]);
  });

  test('castData obj empty', async () => {
    expect(await castData({})).toEqual({});
  });

  test('castData obj simple', async () => {
    const data = await castData({ chacho: 'loco', tio: 1 });
    expect(data).toEqual({ chacho: 'loco', tio: 1 });
  });

  test('castData obj data', async () => {
    const cloneData = Ofn.cloneObject(DATA);
    const data = await castData(DATA);

    expect(DATA).toEqual(cloneData);
    expect(data).toEqual({
      name: 'Oropesa',
      project: 'Test',
      image: 'oropensando.jpg',
      logo: LOGO_BASE64,
      logosmall: LOGO_SMALL_BASE64,
    });
  });

  test('castData obj data child', async () => {
    const cloneData = Ofn.cloneObject(DATA);
    (cloneData as any).chacho = { loco: DATA.logo };

    const data = await castData(cloneData);

    expect(data).toEqual({
      name: 'Oropesa',
      project: 'Test',
      image: 'oropensando.jpg',
      logo: LOGO_BASE64,
      logosmall: LOGO_SMALL_BASE64,
      chacho: { loco: LOGO_BASE64 },
    });
  });
});

describe('processTemplate', () => {
  // test('processTemplate null', async () => {
  //   expect(processTemplate(null)).toEqual({
  //     status: false,
  //     error: {
  //       type: 'ProcessTemplateFailed',
  //       msg: 'param:html is string required.',
  //     },
  //   });
  // });

  test('processTemplate html null', async () => {
    expect(processTemplate('chacho')).toEqual({ status: true, html: 'chacho' });
  });

  test('processTemplate no-html no-data', async () => {
    expect(processTemplate('chacho', { chacho: 'loco' })).toEqual({ status: true, html: 'chacho' });
  });

  test('processTemplate template no-data', async () => {
    const response = processTemplate(TEMPLATE.html, { chacho: 'loco' });
    expect(response.status).toBe(false);

    if (response.status) {
      return;
    }

    expect(response.error.type).toMatch('ProcessTemplateFailed');
    expect(response.error.msg).toMatch(/(Error: "name" not defined in data)/);
  });

  test('processTemplate template no-data no-strict', async () => {
    const response = processTemplate(TEMPLATE.html, { chacho: 'loco' }, { strict: false });
    expect(response).toEqual({
      status: true,
      html: `<style>/* ... */</style><div>Hi, <br><img alt="" src="" /></div>`,
    });
  });

  test('processTemplate template data (bad)', async () => {
    const response = processTemplate(TEMPLATE.html, DATA);
    expect(response).toEqual({
      status: true,
      html: `<style>/* ... */</style><div>Hi, Oropesa<br><img alt="" src="${DATA.logo}" /></div>`,
    });
  });

  test('processTemplate template castData', async () => {
    const response = processTemplate(TEMPLATE.html, await castData(DATA));
    expect(response).toEqual({
      status: true,
      html: `<style>/* ... */</style><div>Hi, Oropesa<br><img alt="" src="${LOGO_BASE64}" /></div>`,
    });
  });
});
