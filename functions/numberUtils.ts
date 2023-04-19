// numberUtils.ts

/**
 * This TypeScript function adds commas to a number to make it more readable.
 * @param  - The function `numberWithCommas` takes in an object with a single property `x`, which is a
 * number. The function returns a string representation of the number with commas added as thousands
 * separators.
 * @returns A function that takes in an object with a property `x` of type `number` and returns a
 * string with commas added as thousands separators to the `x` value.
 */
export function numberWithCommas({ x }: { x: number; }): string {
  return x?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

