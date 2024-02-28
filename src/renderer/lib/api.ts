import { Ok, Err, tryCatchPromise, Result } from "@/types/result";
import { captain } from "./ky";
import { HTTPError } from "ky";
import {
  blockManifestSchema,
  BlockManifest,
  BlockMetadata,
  blockMetadataSchema,
} from "@/renderer/types/manifest";
import { ZodError } from "zod";

export const getManifest = async (): Promise<
  Result<BlockManifest, HTTPError | ZodError>
> => {
  const res = await tryCatchPromise<unknown, HTTPError>(() =>
    captain.get("blocks/manifest").json(),
  );
  if (!res.ok) {
    return res;
  }
  const validateResult = blockManifestSchema.safeParse(res.value);
  if (!validateResult.success) {
    return Err(validateResult.error);
  }

  return Ok(validateResult.data);
};

export const getMetadata = async (): Promise<
  Result<BlockMetadata, HTTPError | ZodError>
> => {
  const res = await tryCatchPromise<unknown, HTTPError>(() =>
    captain.get("blocks/metadata").json(),
  );
  if (!res.ok) {
    return res;
  }

  const validateResult = blockMetadataSchema.safeParse(res.value);
  if (!validateResult.success) {
    return Err(validateResult.error);
  }

  return Ok(validateResult.data);
};
