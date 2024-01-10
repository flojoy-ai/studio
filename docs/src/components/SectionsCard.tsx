import { Fragment } from "react";
import BlocksCardCollection from "./BlocksCardCollection";
import { getBlocksPathsWithDocstring } from "@/utils/blockPaths";

type SectionsCardProps = { category: string; manufacturer: string };

function SectionsCard({ category, manufacturer }: SectionsCardProps) {
  const sectionPaths = ["HARDWARE/PROTOCOLS/SCPI"];
  if (
    category.toUpperCase() == "OSCILLOSCOPES" &&
    manufacturer.toUpperCase() == "TEKTRONIX"
  ) {
    sectionPaths.unshift("HARDWARE/OSCILLOSCOPES/TEKTRONIX");
  }

  return (
    <>
      {sectionPaths.map((sectionPath) => {
        const blockFiles = getBlocksPathsWithDocstring(sectionPath);
        const sectionTitle = sectionPath
          .replaceAll("\\", "/")
          .replace("HARDWARE/", "")
          .split("/")
          .join(" > ");
        return (
          <Fragment key={sectionPath}>
            <h2 className="mb-10 mt-10">{sectionTitle}</h2>
            <div className="flex flex-col items-center">
              <BlocksCardCollection blocks={blockFiles} />
            </div>
          </Fragment>
        );
      })}
    </>
  );
}

export default SectionsCard;
