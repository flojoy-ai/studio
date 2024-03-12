import { DeepMutable } from "@/renderer/types/util";

export const deepMutableClone = <T>(obj: T): DeepMutable<T> => {
  return JSON.parse(JSON.stringify(obj)) as DeepMutable<T>;
};
