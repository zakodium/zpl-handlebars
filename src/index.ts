import * as Handlebars from 'handlebars';
import { Image } from 'image-js';

const compilerOptions = {
  noEscape: true,
  strict: true,
  preventIndent: true,
};

interface ZPLTemplateObject {
  data?: {
    [key: string]: any;
  };
  images?: {
    [key: string]: Image;
  };
}

interface ZPLHandlebarsTemplateObject {
  data: {
    [key: string]: any;
  };
  images: {
    [key: string]: string;
  };
}

export function compile<T extends ZPLTemplateObject>(
  template: string,
): ZPLTemplateDelegate<T> {
  return createDelegate<T>(Handlebars.compile(template, compilerOptions));
}

type ZPLTemplateDelegate<T> = (context: T) => string;

const zplHelpers = {};

function createDelegate<T extends ZPLTemplateObject>(
  delegate: Handlebars.TemplateDelegate,
): ZPLTemplateDelegate<T> {
  return function zplTemplateDelegate(context: T): string {
    const hContext: ZPLHandlebarsTemplateObject = {
      data: context.data || {},
      images: {},
    };
    if (context.images) {
      const imageDefs: string[] = [];
      let imageId = 0;
      for (const imgKey of Object.keys(context.images)) {
        const image = context.images[imgKey];
        const imageName = `${String(imageId++).padStart(8, '0')}.GRF`;
        const converted = convertImage(image, imageName);
        imageDefs.push(converted);
        hContext.images[imgKey] = imageName;
      }
      const str = delegate(hContext, zplHelpers);
      return `${imageDefs.join('\n')}\n${str}`;
    } else {
      return delegate(hContext, zplHelpers);
    }
  };
}

function convertImage(image: Image, name: string): string {
  if (image.width % 8 !== 0) {
    throw new Error('images must have a width divisible by eight');
  }
  if (image.bitDepth > 1) {
    if (image.bitDepth !== 8 || image.channels > 1) {
      // @ts-ignore
      image = image.rgba8().grey();
    }
    // Convert image to binary
    image = image.mask({ algorithm: 'threshold', threshold: 128 });
  }
  const totalBytes = (image.width * image.height) / 8;
  const bytesPerRow = image.width / 8;
  const hexData: string[] = [];
  for (const value of image.data) {
    hexData.push(value.toString(16).padStart(2, '0'));
  }
  return `~DGR:${name},${totalBytes},${bytesPerRow},${hexData.join('')}`;
}
