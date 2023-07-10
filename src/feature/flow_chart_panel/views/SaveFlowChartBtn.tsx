import SaveIconSVG from "@src/assets/SaveIconSVG";
import * as htmlToImage from "html-to-image";

const downloadBlob = (blob: Blob, filename: string) => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

const SaveFlowChartBtn = () => {
  const downloadResult = async () => {
    const flowChartDiv = document.getElementById("react-flow-chart");
    if (!flowChartDiv) {
      alert("No flow chart found on current page!");
      return;
    }
    const dataUrl = await htmlToImage.toJpeg(flowChartDiv);
    const res = await fetch(dataUrl);
    const blob = await res.blob();

    if ("showSaveFilePicker" in window) {
      const handle = await window.showSaveFilePicker({
        suggestedName: "output.jpeg",
        types: [
          {
            description: "JPEG file",
            accept: { "img/jpeg": [".jpeg"] },
          },
        ],
      });
      const writableStream = await handle.createWritable();

      await writableStream.write(blob);
      await writableStream.close();
    } else {
      downloadBlob(blob, "output.jpeg");
    }
  };

  return (
    <button onClick={downloadResult} style={{ display: "flex", gap: 11 }}>
      <SaveIconSVG />
      Save Flowchart as JPEG
    </button>
  );
};

export default SaveFlowChartBtn;
