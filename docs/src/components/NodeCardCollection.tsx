import React from "react";
import CardCollection from "../components/CardCollection";

const nodeDescriptions = {};

const nodeSections = [];
type NodeCardCollectionProps = { category: string; manufacturer: string };

function NodeCardCollection({
  category,
  manufacturer,
}: NodeCardCollectionProps) {
  const sectionIDs: Array<string> = [];
  const sectionContentData: Record<string, string> = {};

  if (category == "OSCILLOSCOPES" && manufacturer == "TEKTRONIX") {
    sectionIDs.push("I/O > Oscilloscopes > Tektronix");
  }

  sectionIDs.push("I/O > Protocols > SCPI");

  sectionIDs.map((sectionID) => {
    let cardData = [];

    nodeSections[sectionID]?.map((nodePath) => {
      let cd: Object = {};
      const nodeID = nodePath.split("/").slice(-1).toString();

      let nodeHint = "";
      if (nodeID in nodeDescriptions) {
        nodeHint = nodeDescriptions[nodeID];
      }

      let nodePageLink = nodePath.split("/");
      nodePageLink.pop();
      nodePageLink = "/" + nodePageLink.join("/");

      if (nodeHint.indexOf(" node ") > 0) {
        nodeHint = nodeHint.split(" node ");
        nodeHint.shift();
        nodeHint = nodeHint[0];
        nodeHint = nodeHint.charAt(0).toUpperCase() + nodeHint.slice(1);
      } else if (nodeHint.trim().length == 0) {
        nodeHint = "❗ This node has no docstring description yet.";
      }

      cd["cardContent"] = nodeHint;
      cd["cardHeader"] = nodeID.replaceAll("_", " ");
      cd["cardLink"] = nodePageLink;
      cd["cardEmoji"] = "📻";

      if (nodePath.includes("PROTOCOLS")) {
        cd["cardEmoji"] = "📄";
      } else if (nodePath.includes("MOTION")) {
        cd["cardEmoji"] = "🛞";
      } else if (nodePath.includes("OSCILLOSCOPES")) {
        cd["cardEmoji"] = "📟";
      }

      cardData.push(cd);

      sectionContentData[sectionID] = cardData;
    });
  });

  const setID = [];

  return (
    <>
      {setID.map((sID) => {
        return (
          <>
            <h2 className="mb-10 mt-10">{sID.replace("I/O > ", "")}</h2>
            <div className="flex flex-col items-center">
              <CardCollection
                cardData={sectionContentData[sID]}
                displayWide={true}
              />
            </div>
          </>
        );
      })}
    </>
  );
}

export default NodeCardCollection;
