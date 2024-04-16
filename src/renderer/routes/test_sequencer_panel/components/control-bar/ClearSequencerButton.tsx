import { MenubarItem } from "@/renderer/components/ui/menubar";
import { useSequencerState } from "@/renderer/hooks/useTestSequencerState";

export const ClearSequencerButton = () => {
  const { clearSequencer } = useSequencerState();

  return (
    <MenubarItem
      onClick={clearSequencer}
      id="close-app-btn"
      data-testid="close-app-btn"
    >
      Close sequences
    </MenubarItem>
  );
};
