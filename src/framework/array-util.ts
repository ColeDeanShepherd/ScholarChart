export function arrIndices<T>(arr: T[]): number[] {
  return arr.map((_, i) => i);
}