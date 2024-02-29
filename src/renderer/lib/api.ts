import { captain } from "./ky";
import { HTTPError } from "ky";
import {
  BlockManifest,
  BlockMetadata,
  blockManifestSchema,
  blockMetadataSchema,
} from "@/renderer/types/manifest";
import { tryCatchPromise, tryParse } from "@/renderer/types/result";
import { Result } from "ts-results";
import { ZodError } from "zod";

export const getManifest = async (): Promise<
  Result<BlockManifest, Error | ZodError>
> => {
  const res = await tryCatchPromise<unknown, HTTPError>(() =>
    captain.get("blocks/manifest").json(),
  );
  return res.andThen(tryParse(blockManifestSchema));
};

export const getMetadata = async (): Promise<
  Result<BlockMetadata, Error | ZodError>
> => {
  const res = await tryCatchPromise<unknown, HTTPError>(() =>
    captain.get("blocks/metadata").json(),
  );
  return res.andThen(tryParse(blockMetadataSchema));
};
