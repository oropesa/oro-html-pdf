import fsExtra from 'fs-extra';
import { Ofn } from 'oro-functions';

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
if (Ofn.objIsNotEmpty(DATA)) {
  DATA.logo = DATA.logo.replace('file://', `file://${DIRNAME}/`);
}

export const LOGO_BASE64 = fsExtra.readFileSync(`${DIRNAME}/assets/oropensando.jpg.txt`, 'utf8');
export const LOGO_SMALL_BASE64 = fsExtra.readFileSync(`${DIRNAME}/assets/oropensando32.png.txt`, 'utf8');

export const DIN_A4_DEFAULT_WIDTH = 595.91998;
export const DIN_A4_DEFAULT_HEIGHT = 841.91998;
export const DIN_A5_DEFAULT_HEIGHT = 420;
