import * as Handlebars from 'handlebars';
import { Image } from 'image-js';

import { toFixed } from './helpers/numberFormat';

const runtimeOptions = {
  helpers: {
    toFixed,
  },
};

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
      const str = delegate(hContext, runtimeOptions);
      return `${imageDefs.join('\n')}\n${str}`;
    } else {
      return delegate(hContext, runtimeOptions);
    }
  };
}

function convertImage(image: Image, name: string): string {
  if (image.bitDepth > 1) {
    if (image.bitDepth !== 8 || image.channels > 1) {
      // @ts-ignore
      image = image.rgba8().grey();
    }
    // Convert image to binary
    image = image.mask({
      algorithm: 'threshold',
      threshold: 128,
      invert: true,
    });
  } else {
    image = image.invert();
  }
  let totalBytes = 0;
  const bytesPerRow = Math.ceil(image.width / 8);
  const hexData: string[] = [];
  for (let y = 0; y < image.height; y++) {
    hexData.push('\n');
    for (let x = 0; x < image.width; x += 8) {
      let byte = 0;
      for (let i = 0; i < 8; i++) {
        if (x + i < image.width) {
          byte = (byte << 1) | image.getBitXY(x + i, y);
        } else {
          byte = (byte << 1) | 1;
        }
      }
      hexData.push(
        byte
          .toString(16)
          .toUpperCase()
          .padStart(2, '0'),
      );
      totalBytes++;
      byte = 0;
    }
  }
  return `~DGR:${name},${totalBytes},${bytesPerRow},${hexData.join('')}`;
}
