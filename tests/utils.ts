import { Ofn } from 'oro-functions';
import fsExtra from 'fs-extra';

// eslint-disable-next-line unicorn/prefer-module
export const DIRNAME = __dirname;

interface Template {
  html: string;
  header: string;
  footer: string;
}

interface Data {
  name: string;
  project: string;
  image: string;
  logo: string;
  logosmall: string;
}

export const TEMPLATE = Ofn.getFileJsonRecursivelySync<Template>(`${DIRNAME}/assets/template.json`);
export const DATA = Ofn.getFileJsonRecursivelySync<Data>(`${DIRNAME}/assets/data.json`);
Ofn.objIsNotEmpty(DATA) && (DATA.logo = DATA.logo.replace('file://', `file://${DIRNAME}/`));

export const LOGO_BASE64 = fsExtra.readFileSync(`${DIRNAME}/assets/oropensando.jpg.txt`, 'utf8');
export const LOGO_SMALL_BASE64 = fsExtra.readFileSync(
  `${DIRNAME}/assets/oropensando32.png.txt`,
  'utf8',
);
