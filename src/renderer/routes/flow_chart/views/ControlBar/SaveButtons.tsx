import { MenubarItem, MenubarShortcut } from "@src/components/ui/menubar";
import { useFlowChartGraph } from "@src/hooks/useFlowChartGraph";
import { projectAtom, projectPathAtom } from "@src/hooks/useFlowChartState";
import { useHasUnsavedChanges } from "@src/hooks/useHasUnsavedChanges";
import { useSave } from "@src/hooks/useSave";
import { saveFileAs } from "@src/lib/save";
import { useSetAtom, useAtomValue } from "jotai";
import { toast } from "sonner";

export const SaveButton = () => {
  const handleSave = useSave();

  return (
    <MenubarItem data-testid="btn-save" onClick={handleSave}>
      {/* TODO: Add logo for windows and linux */}
      Save <MenubarShortcut>⌘S</MenubarShortcut>
    </MenubarItem>
  );
};

export const SaveAsButton = () => {
  const { nodes, edges, textNodes } = useFlowChartGraph();
  const { setHasUnsavedChanges } = useHasUnsavedChanges();
  const setProjectPath = useSetAtom(projectPathAtom);
  const project = useAtomValue(projectAtom);

  const handleSave = async () => {
    try {
      const path = await saveFileAs(project, nodes, edges, textNodes);

      setProjectPath(path);
      setHasUnsavedChanges(false);

      const message = path
        ? `Saved app to ${path}!`
        : "Saved app successfully!";
      toast.success(message);
    } catch {
      // exception just means user cancelled save
    }
  };

  return (
    <MenubarItem data-testid="btn-saveas" onClick={handleSave}>
      Save As{" "}
    </MenubarItem>
  );
};
