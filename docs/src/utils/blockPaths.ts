import fs, { existsSync } from "fs";
import path from "path";

const sectionToBlocksMap: Record<string, { path: string; docs: string }[]> = {};
export const getBlocksPathsWithDocstring = (sectionPath: string) => {
  if (
    Object.keys(sectionToBlocksMap).length > 0 &&
    sectionPath in sectionToBlocksMap
  ) {
    return sectionToBlocksMap[sectionPath] as { path: string; docs: string }[];
  }
  const resolveSectionPath = path.join(process.cwd(), "../blocks", sectionPath);
  if (!existsSync(resolveSectionPath)) {
    return [];
  }
  const allBlockFiles = getAllFiles(resolveSectionPath, ".py");
  const mapping = allBlockFiles.map((blockFile) => {
    const section = sectionPath.replaceAll("\\", "/").split("/")[0];
    const blockDir = blockFile
      .replaceAll("\\", "/")
      .split("/")
      .slice(0, -1)
      .join("/");
    const docJsonPath = path.join(blockDir, "block_data.json");
    const docJson = JSON.parse(fs.readFileSync(docJsonPath).toString());
    return {
      path: blockDir.slice(blockDir.indexOf(section)),
      docs: docJson["docstring"]["short_description"] as string,
    };
  });
  sectionToBlocksMap[sectionPath] = mapping;

  return sectionToBlocksMap[sectionPath];
};

const getAllFiles = (dirPath: string, subString: string) => {
  const allFiles: string[] = [];
  const dirs = fs.readdirSync(dirPath).sort();
  for (const dirName of dirs) {
    const childDirPath = path.join(dirPath, dirName);
    if (fs.statSync(childDirPath).isDirectory()) {
      const files = getAllFiles(childDirPath, subString);
      allFiles.push(...files);
    } else {
      if (childDirPath.endsWith(subString)) {
        allFiles.push(childDirPath);
      }
      continue;
    }
  }
  return allFiles;
};
