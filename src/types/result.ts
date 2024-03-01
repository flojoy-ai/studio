import { Result as TSResult, Ok, Err } from "ts-results-es";
import { z } from "zod";

export type Result<T, E = Error> = TSResult<T, E>;

export function tryParse<Z extends z.ZodTypeAny>(
  z: Z,
): (val: unknown) => Result<z.infer<Z>, z.ZodError> {
  return (val: unknown) => {
    const res = z.safeParse(val);
    if (res.success) {
      return Ok(res.data as z.infer<Z>);
    }
    return Err(res.error);
  };
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

export async function fromPromise<T, E = Error>(
  p: Promise<T>,
): Promise<Result<T, E>> {
  try {
    return Ok(await p);
  } catch (e) {
    return Err(e as E);
  }
}

export { Ok, Err };
