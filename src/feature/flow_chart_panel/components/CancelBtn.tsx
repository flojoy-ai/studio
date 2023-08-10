import { Button } from "@mantine/core";
// import useKeyboardShortcut from "@src/hooks/useKeyboardShortcut";
import { Ban } from "lucide-react";

type CancelBtnProps = {
  cancelFC: () => void;
};

const CancelBtn = ({ cancelFC }: CancelBtnProps) => {
  // useKeyboardShortcut("ctrl", "c", cancelFC);
  // useKeyboardShortcut("meta", "c", cancelFC);

  return (
    <Button
      data-testid="btn-cancel"
      data-cy="btn-cancel"
      id="btn-cancel"
      onClick={cancelFC}
      className="gap-2"
      variant="ghost"
    >
      <Ban />
      Cancel
    </Button>
  );
};

export default CancelBtn;
