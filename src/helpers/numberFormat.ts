export function toFixed(value: any, arg1: number, options: any): string {
  let decimals = 2;
  if (options !== undefined) {
    decimals = arg1;
  } else {
    options = arg1;
  }
  return Number(value).toFixed(decimals);
}
