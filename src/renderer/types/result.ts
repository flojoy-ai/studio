export type Result<T, E = string> =
  | { data: T; ok: true }
  | { error: E; ok: false };
