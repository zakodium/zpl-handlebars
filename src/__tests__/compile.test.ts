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
  // prettier-ignore
  const image1 = new Image(8, 4, [
    0, 0, 0, 0, 0, 0, 0, 0,
    255, 0, 255, 255, 0, 255, 255, 255,
    255, 255, 0, 255, 255, 255, 255, 0,
    255, 255, 255, 255, 255, 255, 255, 255
    // @ts-ignore
  ], { kind: 'GREY' });

  // @ts-ignore
  const image2 = new Image(8, 1, { kind: 'BINARY' });
  image2.setBitXY(2, 0);

  const image3 = new Image(8, 1);

  const compiled = compile(
    'TEST\n{{images.image1}}\n{{images.image2}}\n{{images.image3}}',
  );
  expect(compiled({ images: { image1, image2, image3 } }))
    .toBe(`~DGR:00000000.GRF,4,1,
FF
48
21
00
~DGR:00000001.GRF,1,1,
DF
~DGR:00000002.GRF,1,1,
FF
TEST
00000000.GRF
00000001.GRF
00000002.GRF`);
});

test('should work with image width not multiple of 8 for bad image size', () => {
  // @ts-ignore
  const image1 = new Image(2, 5, { kind: 'BINARY' });
  image1.setBitXY(1, 0);
  image1.setBitXY(0, 1);
  image1.setBitXY(0, 3);
  image1.setBitXY(1, 3);
  image1.setBitXY(0, 4);
  image1.setBitXY(1, 4);

  const compiled = compile('TEST\n{{images.image1}}');
  expect(compiled({ images: { image1 } })).toBe(`~DGR:00000000.GRF,5,1,
BF
7F
FF
3F
3F
TEST
00000000.GRF`);
});
