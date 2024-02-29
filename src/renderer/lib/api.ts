import { captain } from "./ky";
import { HTTPError } from "ky";
import {
  blockManifestSchema,
  blockMetadataSchema,
} from "@/renderer/types/manifest";
import * as E from "fp-ts/TaskEither";
import { pipe } from "fp-ts/function";
import { tryParse } from "./utils";

export const getManifest = async () => {
  return await pipe(
    E.tryCatch(
      () => captain.get("blocks/manifest").json(),
      (e) => e as HTTPError,
    ),
    E.flatMapEither(tryParse(blockManifestSchema)),
  )();
};

export const getMetadata = async () => {
  return await pipe(
    E.tryCatch(
      () => captain.get("blocks/metadata").json(),
      (e) => e as HTTPError,
    ),
    E.flatMapEither(tryParse(blockMetadataSchema)),
  )();
};
