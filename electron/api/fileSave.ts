import { writeFileSync, existsSync } from "fs";

export function fileExists(path: string) {
  return existsSync(path);
}

export function saveFile(path: string, data: string) {
  writeFileSync(path, data);
}
