export function filterMap<T, U>(
  arr: Array<T>,
  mapPred: (x: T) => U | undefined | null,
) {
  return arr.reduce((acc: Array<U>, x: T) => {
    const val = mapPred(x);
    if (val !== undefined && val !== null) {
      acc.push(val);
    }

    return acc;
  }, []);
}
