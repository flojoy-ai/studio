import { MenubarItem } from "@/components/ui/menubar";
import { useSocket } from "@src/hooks/useSocket";
import saveAs from "file-saver";

export const ExportResultButton = () => {
  const { states } = useSocket();
  const { programResults } = states;

  const exportResultDisabled = programResults.length == 0;

  const downloadResult = async () => {
    if (!programResults.length) return;
    const json = JSON.stringify(programResults, null, 2);
    const blob = new Blob([json], { type: "text/plain;charset=utf-8" });

    saveAs(blob, "output.json");
  };

  return (
    <MenubarItem
      onClick={downloadResult}
      className={exportResultDisabled ? "disabled" : ""}
      disabled={exportResultDisabled}
    >
      Export Result
    </MenubarItem>
  );
};
