import { BoardSetupTemplate } from "./BoardSetupTemplate";
import { RP2Setup } from "./RP2Setup";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@src/components/ui/dialog";
import { Button } from "@src/components/ui/button";
import { useState } from "react";

const BOARD_TYPES = {
  RP2: RP2Setup,
  // Add other board types here as needed
};

export type BoardFirmwareModalProps = {
  handleBoardFirmwareModalOpen: (open: boolean) => void;
  isBoardFirmwareModalOpen: boolean;
  title: string;
  description: string;
};

export const FirmwareBoardSelectModal = ({
  handleBoardFirmwareModalOpen,
  isBoardFirmwareModalOpen,
  title,
  description,
}: BoardFirmwareModalProps) => {
  const [isBoardSetupOpen, setIsBoardSetupOpen] = useState(false);
  const [selectedBoardTypeKey, setSelectedBoardTypeKey] = useState<string | null>(null);

  const handleClick = (boardTypeKey: string) => {
    handleBoardFirmwareModalOpen(false);
    setSelectedBoardTypeKey(boardTypeKey);
    setIsBoardSetupOpen(true);
  };

  const SelectedBoardSetupComponent = selectedBoardTypeKey ? BOARD_TYPES[selectedBoardTypeKey] : null;

  return (
    <>
      {SelectedBoardSetupComponent && (
        <BoardSetupTemplate
          title={selectedBoardTypeKey}
          description={`Setup for ${selectedBoardTypeKey}`}
          content={<SelectedBoardSetupComponent />}
          isSetupModalOpen={isBoardSetupOpen}
          handleIsSetupModalOpen={setIsBoardSetupOpen}
          handleBackClick={() => {
            setIsBoardSetupOpen(false);
            handleBoardFirmwareModalOpen(true);
          }}
        />
      )}

      <Dialog open={isBoardFirmwareModalOpen} onOpenChange={handleBoardFirmwareModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader className="text-left">
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>{description}</DialogDescription>
          </DialogHeader>
          Please select the board type:
          <p style={{ fontSize: 13 }}>
            <i>Only currently supported board types are listed.</i>
          </p>
          {Object.keys(BOARD_TYPES).map((boardTypeKey) => (
            <div key={boardTypeKey}>
              <Button onClick={() => handleClick(boardTypeKey)}>{boardTypeKey}</Button>
            </div>
          ))}
        </DialogContent>
      </Dialog>
    </>
  );
};
