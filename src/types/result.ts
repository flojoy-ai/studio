interface Ok<T> {
  ok: true;
  value: T;
}

interface Err<E> {
  ok: false;
  error: E;
}

export type Result<T, E = Error> = Ok<T> | Err<E>;

export function Ok<T, E = Error>(value: T): Result<T, E> {
  return { ok: true, value };
}

export function Err<T, E = Error>(error: E): Result<T, E> {
  return { ok: false, error };
}

export function tryCatch<T, E = Error>(fn: () => T): Result<T, E> {
  try {
    return Ok(fn());
  } catch (e) {
    return Err(e as E);
  }
}

export async function tryCatchPromise<T, E = Error>(
  fn: () => Promise<T>,
): Promise<Result<T, E>> {
  try {
    return Ok(await fn());
  } catch (e) {
    return Err(e as E);
  }
}
