import { Button } from "@src/components/ui/button";
import useKeyboardShortcut from "@src/hooks/useKeyboardShortcut";
import { Ban } from "lucide-react";

type CancelBtnProps = {
  cancelFC: () => void;
};

const CancelBtn = ({ cancelFC }: CancelBtnProps) => {
  useKeyboardShortcut("ctrl", "c", cancelFC);
  useKeyboardShortcut("meta", "c", cancelFC);

  return (
    <Button size="sm" variant="destructive" onClick={cancelFC}>
      <Ban size="20" />
      <div className="px-1"></div>
      <div>Cancel</div>
    </Button>
  );
};

export default CancelBtn;
