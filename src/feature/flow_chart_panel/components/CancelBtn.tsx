import { IconButton } from "@src/feature/common/IconButton";
// import useKeyboardShortcut from "@src/hooks/useKeyboardShortcut";
import { Ban } from "lucide-react";

type CancelBtnProps = {
  cancelFC: () => void;
};

const CancelBtn = ({ cancelFC }: CancelBtnProps) => {
  // useKeyboardShortcut("ctrl", "c", cancelFC);
  // useKeyboardShortcut("meta", "c", cancelFC);

  return (
    <IconButton
      icon={Ban}
      size="sm"
      variant="default"
      data-cy="btn-cancel"
      id="btn-cancel"
      onClick={cancelFC}
    >
      Cancel
    </IconButton>
  );
};

export default CancelBtn;
