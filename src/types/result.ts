import { Result, ok, err } from "neverthrow";
import { z } from "zod";

export function tryParse<Z extends z.ZodTypeAny>(
  z: Z,
): (val: unknown) => Result<z.infer<Z>, z.ZodError> {
  return (val: unknown) => {
    const res = z.safeParse(val);
    if (res.success) {
      return ok(res.data as z.infer<Z>);
    }
    return err(res.error);
  };
}

export function pass() {}
