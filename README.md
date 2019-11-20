# zpl-handlebars

[![NPM version][npm-image]][npm-url]
[![build status][travis-image]][travis-url]
[![Test coverage][codecov-image]][codecov-url]
[![npm download][download-image]][download-url]

ZPL label templating using Handlebars.

## Installation

`$ npm i zpl-handlebars`

## ZPL References

- [Specification](https://www.zebra.com/content/dam/zebra/manuals/printers/common/programming/zpl-zbi2-pm-en.pdf).
- [Cheat sheet](./ZPL_CHEAT_SHEET.md)

## Usage

```js
import { compile } from 'zpl-handlebars';
import { Image } from 'image-js';

const template = `
^XA
^FO150,125^ADN,36,20^FD{{data.value1}}^FS
^FO100,100^XGR:{{images.myImage}},1,1^FS
^XZ
`;

const compiled = compile(template);

// prettier-ignore
const myImage = new Image(8, 4, [ // Or load any image with Image.load()
    0,   0,   0,   0,   0,   0,   0,   0,
  255,   0, 255, 255,   0, 255, 255, 255,
  255, 255,   0, 255, 255, 255, 255,   0,
  255, 255, 255, 255, 255, 255, 255, 255
  // @ts-ignore
], { kind: 'GREY' });

const zpl = compiled({ data: { value1: 'TEST' }, images: { myImage } });
/*
~DGR:00000000.GRF,4,1,
FF
48
21
00
^XA
^FO150,125^ADN,36,20^FDTEST^FS
^FO100,100^XGR:00000000.GRF,1,1^FS
^XZ
*/
```

## Helpers

### toFixed

Formats a value using `Number(value).toFixed(decimals)`.  
The `decimals` parameter is optional and defaults to `2`.

```
{{toFixed data.value}}
{{toFixed data.value 3}}
```

## License

[MIT](./LICENSE)

[npm-image]: https://img.shields.io/npm/v/zpl-handlebars.svg?style=flat-square
[npm-url]: https://www.npmjs.com/package/zpl-handlebars
[travis-image]: https://img.shields.io/travis/com/zakodium/zpl-handlebars/master.svg?style=flat-square
[travis-url]: https://travis-ci.com/zakodium/zpl-handlebars
[codecov-image]: https://img.shields.io/codecov/c/github/zakodium/zpl-handlebars.svg?style=flat-square
[codecov-url]: https://codecov.io/gh/zakodium/zpl-handlebars
[download-image]: https://img.shields.io/npm/dm/zpl-handlebars.svg?style=flat-square
[download-url]: https://www.npmjs.com/package/zpl-handlebars
