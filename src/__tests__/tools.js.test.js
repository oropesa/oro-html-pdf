const { castData } = require('../cast-data');
const { processTemplate } = require('../process-template');

//

describe('castData', () => {
  test('castData null', async () => {
    expect(await castData(null)).toBe(null);
  });

  test('castData string', async () => {
    expect(await castData('chacho')).toBe('chacho');
  });
});

describe('processTemplate', () => {
  test('processTemplate null', async () => {
    expect(processTemplate(null)).toEqual({
      status: false,
      error: {
        type: 'ProcessTemplateFailed',
        msg: 'param:html is string required.',
      },
    });
  });
});
