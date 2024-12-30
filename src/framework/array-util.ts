export function arrIndices<T>(arr: T[]): number[] {
  return arr.map((_, i) => i);
}

export function arrRandElem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function arrShuffle<T>(array: T[]) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }

  return array;
}