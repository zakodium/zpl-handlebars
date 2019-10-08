# zpl-handlebars

[![NPM version][npm-image]][npm-url]
[![build status][travis-image]][travis-url]
[![Test coverage][codecov-image]][codecov-url]
[![npm download][download-image]][download-url]

ZPL label templating using Handlebars.

## Installation

`$ npm i zpl-handlebars`

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

const myImage = new Image(8, 4, { kind: 'GREY' }); // Or load any image with Image.load()
myImage.setPixelXY(2, 0, [255]);
myImage.setPixelXY(3, 1, [255]);

const zpl = compiled({ data: { value1: 'TEST' }, images: { myImage } });
/*
~DGR:00000000.GRF,4,1,20100000
^XA
^FO150,125^ADN,36,20^FDTEST^FS
^FO100,100^XGR:00000000.GRF,1,1^FS
^XZ
*/
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
