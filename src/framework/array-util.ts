export function arrIndices<T>(arr: T[]): number[] {
  return arr.map((_, i) => i);
}

export function arrRandElem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}