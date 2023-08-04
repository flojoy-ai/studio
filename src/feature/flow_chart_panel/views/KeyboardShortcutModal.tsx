import { memo } from "react";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
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
      <DialogContent className="h-[600px] max-w-5xl">
        <DialogHeader className="mb-2"></DialogHeader>
        <ScrollArea>
          <div data-testid="key_container" className="flex justify-center">
            {platforms.map((platform) => {
              return (
                <div className="w-full" key={platform.key}>
                  <div className=" mb-4 text-2xl font-bold">
                    <span className=" ml-2">For</span>{" "}
                    <span className=" text-blue-500">{platform.title}</span>
                  </div>

                  <div className="border-1 flex w-full flex-col items-start gap-2 rounded-lg border-solid border-modal bg-modal p-6 shadow-md">
                    {keyboardShortcuts.map((shortcut) => (
                      <div
                        className="flex w-full flex-row items-start justify-between rounded-sm p-3 shadow-lg"
                        key={shortcut.command}
                      >
                        <span>{shortcut.command}</span>
                        <span className="text-blue-500">
                          {shortcut.platforms[platform.key]}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default memo(KeyboardShortcutModal);

const platforms = [
  { title: "Windows", key: "windows" },
  { title: "MacOs", key: "macOs" },
];

const keyboardShortcuts = [
  {
    command: "Show/hide UI",
    platforms: {
      windows: "Ctrl \\",
      macOs: "⌘ z",
    },
  },
  {
    command: "Play",
    platforms: {
      windows: "Ctrl P",
      macOs: "⌘ P",
    },
  },
  {
    command: "Open Side Bar Panel",
    platforms: {
      windows: "Ctrl T",
      macOs: "⌘ T",
    },
  },
  {
    command: "Fit View",
    platforms: {
      windows: "Ctrl 1",
      macOs: "⌘ 1",
    },
  },
  {
    command: "Zoom In",
    platforms: {
      windows: "Ctrl +",
      macOs: "⌘ +",
    },
  },
  {
    command: "Zoom Out",
    platforms: {
      windows: "Ctrl -",
      macOs: "⌘ -",
    },
  },
  {
    command: "Layout Node",
    platforms: {
      windows: "Ctrl L",
      macOs: "⌘ L",
    },
  },
  {
    command: "Select All",
    platforms: {
      windows: "Ctrl A",
      macOs: "⌘ A",
    },
  },
  {
    command: "Deselect",
    platforms: {
      windows: "Alt C",
      macOs: "Option C",
    },
  },
  {
    command: "Close Node",
    platforms: {
      windows: "Ctrl W",
      macOs: "⌘ W",
    },
  },
  {
    command: "File Name",
    platforms: {
      windows: "Ctrl R",
      macOs: "⌘ R",
    },
  },
  {
    command: "Save",
    platforms: {
      windows: "Ctrl S",
      macOs: "⌘ S",
    },
  },
  {
    command: "Delete",
    platforms: {
      windows: "Ctrl D",
      macOs: "Backspace",
    },
  },
];
