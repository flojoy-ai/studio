import { memo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@src/components/ui/scroll-area";

interface KeyboardShortcutProps {
  handleKeyboardShortcutModalOpen: (open: boolean) => void;
  isKeyboardShortcutModalOpen: boolean;
}

const KeyboardShortcutModal = ({
  handleKeyboardShortcutModalOpen,
  isKeyboardShortcutModalOpen,
}: KeyboardShortcutProps) => {
  return (
    <Dialog
      open={isKeyboardShortcutModalOpen}
      onOpenChange={handleKeyboardShortcutModalOpen}
    >
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Keyboard Shortcuts</DialogTitle>
        </DialogHeader>
        <ScrollArea>
          <div data-testid="key_container" className="flex justify-center">
            <div className="w-full">
              <div className="flex flex-col gap-2">
                {keyboardShortcuts.map((shortcut) => (
                  <div
                    className="flex w-full flex-row py-2"
                    key={shortcut.command}
                  >
                    <span>{shortcut.command}</span>
                    <div className="grow" />
                    <span className="text-blue-500">{shortcut.key}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default memo(KeyboardShortcutModal);

const keyboardShortcuts = [
  {
    command: "Play",
    key: "Ctrl/⌘ P",
  },
  {
    command: "Open Side Bar Panel",
    key: "Ctrl/⌘ K",
  },
  {
    command: "Zoom In",
    key: "Ctrl/⌘ +",
  },
  {
    command: "Zoom Out",
    key: "Ctrl/⌘ -",
  },
  {
    command: "Save",
    key: "Ctrl/⌘ S",
  },
];
