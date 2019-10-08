import { Image } from 'image-js';

import { compile } from '..';

test('should compile without interpolation', () => {
  const compiled = compile('TEST');
  expect(compiled({})).toBe('TEST');
});

test('should compile and interpolate data', () => {
  const compiled = compile('TEST {{data.x}} - {{data.y}}');
  expect(compiled({ data: { x: 'a', y: 'b' } })).toBe('TEST a - b');
});

test('should error if some data is missing', () => {
  const compiled = compile('TEST {{data.x}}');
  expect(() => compiled({ data: {} })).toThrow(/"x" not defined/);
});

test('should be type safe', () => {
  const compiled = compile<{ data: { custom: number } }>('{{data.custom}}');
  expect(compiled({ data: { custom: 1 } })).toBe('1');
});

test('should encode images', () => {
  // @ts-ignore
  const image1 = new Image(8, 4, { kind: 'GREY' });
  image1.setPixelXY(2, 0, [255]);
  image1.setPixelXY(3, 1, [255]);

  // @ts-ignore
  const image2 = new Image(8, 1, { kind: 'BINARY' });
  image2.setBitXY(0, 1);

  const compiled = compile('TEST\n{{images.image1}}\n{{images.image2}}');
  expect(compiled({ images: { image1, image2 } }))
    .toBe(`~DGR:00000000.GRF,4,1,20100000
~DGR:00000001.GRF,1,1,00
TEST
00000000.GRF
00000001.GRF`);
});

test('should throw for bad image size', () => {
  // @ts-ignore
  const image1 = new Image(2, 5, { kind: 'GREY' });
  image1.setPixelXY(0, 2, [255]);
  image1.setPixelXY(1, 3, [255]);

  const compiled = compile('TEST\n{{images.image1}}');
  expect(() => compiled({ images: { image1 } })).toThrow(
    /images must have a width divisible by eight/,
  );
});
