import { compile } from '../..';

describe('toFixed', () => {
  it('should use 2 decimals by default', () => {
    const tpl = compile('X {{toFixed data.value}} X');
    expect(tpl({ data: { value: 12.3456 } })).toBe('X 12.35 X');
  });

  it('should use 3 decimals if specified', () => {
    const tpl = compile('X {{toFixed data.value 3}} X');
    expect(tpl({ data: { value: 12.3456 } })).toBe('X 12.346 X');
  });
});
