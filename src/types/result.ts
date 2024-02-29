import { Result as TSResult, Ok, Err } from "ts-results-es";
import { z } from "zod";

export type Result<T, E = Error> = TSResult<T, E>;

export function tryParse<Z extends z.ZodTypeAny>(z: Z) {
  return (val: unknown) => {
    const res = z.safeParse(val);
    if (res.success) {
      return Ok(res.data as z.infer<Z>);
    }
    return Err(res.error);
  };
}

export function tryCatch<T, E = Error>(fn: () => T) {
  try {
    return Ok(fn());
  } catch (e) {
    return Err(e as E);
  }
}

export async function tryCatchPromise<T, E = Error>(fn: () => Promise<T>) {
  try {
    return Ok(await fn());
  } catch (e) {
    return Err(e as E);
  }
}

export async function fromPromise<T, E = Error>(p: Promise<T>) {
  try {
    return Ok(await p);
  } catch (e) {
    return Err(e as E);
  }
}

export { Ok, Err };
