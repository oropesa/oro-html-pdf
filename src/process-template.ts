import Handlebars from 'handlebars';
import type { HelperDelegate, compile as handlebarsCompile } from 'handlebars';
import Ofn from 'oro-functions';
import type { SResponseKOObjectSimple, SResponseOKObject } from 'oro-functions';

// Parameters<typeof handlebarsCompile>[1] === CompileOptions
export type HandlebarsOptions = Parameters<typeof handlebarsCompile>[1] & {
  registerHelpers?: Record<string, HelperDelegate>;
};

export interface ProcessTemplateError {
  type: 'ProcessTemplateFailed';
  handlebarsError?: any;
}

export interface ProcessTemplateObject {
  html: string;
}

export type ProcessTemplateResponse =
  | SResponseOKObject<ProcessTemplateObject>
  | SResponseKOObjectSimple<ProcessTemplateError>;

export function processTemplate<T extends Record<string, any>>(
  html: string,
  data?: T,
  options: HandlebarsOptions = {},
): ProcessTemplateResponse {
  if (!Ofn.isString(html)) {
    return Ofn.setResponseKO('param:html is string required.', { type: 'ProcessTemplateFailed' });
  }
  if (!Ofn.isObject(data) || Ofn.objIsEmpty(data)) {
    return Ofn.setResponseOK({ html });
  }

  const { registerHelpers, ...opts } = Ofn.cloneObject(Ofn.isObject(options) ? options : {});
  if (opts.strict === undefined) {
    opts.strict = true;
  }

  try {
    const template = Handlebars.compile(html, opts);

    // Helpers
    Handlebars.registerHelper('fillIfEmpty', function (args: { fn: (context: any) => string }) {
      // @ts-expect-error: "this" is required here
      const value = args.fn(this);
      switch (Ofn.type(value)) {
        case 'string':
          return value.trim() === '' ? '&nbsp;' : value;
        case 'number':
        case 'boolean':
          return value;
        default:
          return '&nbsp;';
      }
    });

    if (Ofn.isObject(registerHelpers)) {
      const keys = Object.keys(registerHelpers);
      for (const registerHelperName of keys) {
        Handlebars.registerHelper(registerHelperName, registerHelpers[registerHelperName]);
      }
    }

    return Ofn.setResponseOK({ html: template(data) });
  } catch (error: any) {
    let msg: string = error.toString().split('\r\n')[0].replace(/\n/g, ' ');
    msg = msg.replace('[object Object]', 'data');

    return Ofn.setResponseKO(msg, { type: 'ProcessTemplateFailed', handlebarsError: error });
  }
}
