import { MenubarItem } from "@/renderer/components/ui/menubar";
import { sendEventToMix } from "@/renderer/services/MixpanelServices";
import saveAs from "file-saver";
import * as htmlToImage from "html-to-image";

const SaveFlowChartBtn = () => {
  const downloadResult = async () => {
    const flowChartDiv = document.getElementById("flow-chart");
    if (!flowChartDiv) {
      alert("No flow chart found on current page!");
      return;
    }
    const dataUrl = await htmlToImage.toJpeg(flowChartDiv);
    const res = await fetch(dataUrl);
    const blob = await res.blob();

    sendEventToMix("Result downloaded");
    saveAs(blob, "output.jpeg");
  };

  return (
    <MenubarItem onClick={downloadResult}>Save Flowchart as JPEG</MenubarItem>
  );
};

export default SaveFlowChartBtn;
