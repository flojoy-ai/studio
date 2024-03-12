export type Nullish<T> = T | null | undefined;

type Entries<T> = {
  [K in keyof T]: [K, T[K]];
}[keyof T][];

export const getEntries = <T extends object>(obj: T) =>
  Object.entries(obj) as Entries<T>;

export const typedObjectKeys = <T extends object>(object: T) => {
  return Object.keys(object) as (keyof typeof object)[];
};

export type DeepMutable<T> = {
  -readonly [P in keyof T]: DeepMutable<T[P]>;
};

export type FilteredKeys<T> = {
  [K in keyof T]: T[K] extends never ? never : K;
}[keyof T];

export type RemoveNever<T> = {
  [K in FilteredKeys<T>]: T[K];
};

export type ValuesOf<T> = T[keyof T];
