import axios from 'axios';
import fsExtra from 'fs-extra';
import Ofn from 'oro-functions';

export async function castData<T extends Record<string | number, any>>(data: T): Promise<T> {
  if (!Ofn.isObject(data) && !Ofn.isArray(data)) {
    return data;
  }

  const cloneData = Ofn.cloneObject(data);

  const keys = Ofn.isArray(cloneData) ? cloneData.map((_, index) => index) : Object.keys(cloneData);

  for (const key of keys) {
    const value = cloneData[key];

    if (Ofn.isObject(value) || Ofn.isArray(value)) {
      // @ts-ignore
      cloneData[key] = await castData(value);
      continue;
    }

    // only string that start with 'http' or 'file://'
    if (!Ofn.isString(value) || !/^(https?|file):\/\/.*\.(jpg|jpeg|png)$/.test(value)) {
      continue;
    }

    // cast 2 base64
    if (value.indexOf('file:') === 0) {
      const responseImage = await fsExtra
        .readFile(value.replace('file://', ''))
        .then((buffer) => Ofn.setResponseOK({ buffer }))
        .catch((error) => Ofn.setResponseKO({ error }));

      if (responseImage.status) {
        // @ts-ignore
        cloneData[key] = `data:image/${Ofn.getFilenameExtByName(value)};base64,${Buffer.from(
          responseImage.buffer,
        ).toString('base64')}`;
      }
    } else {
      const responseImage = await axios
        .get(value, { responseType: 'arraybuffer' })
        .catch((error) => error);

      if (responseImage.status === 200) {
        // @ts-ignore
        cloneData[key] = `data:image/${Ofn.getFilenameExtByName(value)};base64,${Buffer.from(
          responseImage.data,
        ).toString('base64')}`;
      }
    }
  }

  return cloneData;
}
