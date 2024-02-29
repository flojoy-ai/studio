import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { z } from "zod";
import * as E from "fp-ts/Either";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function tryParse<Z extends z.ZodTypeAny>(z: Z) {
  return (val: unknown) => {
    const res = z.safeParse(val);
    if (res.success) {
      return E.right(res.data as z.infer<Z>);
    }
    return E.left(res.error);
  };
}
