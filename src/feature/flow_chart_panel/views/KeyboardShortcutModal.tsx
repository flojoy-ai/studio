import { createStyles, Modal } from "@mantine/core";
import { memo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { platform } from "os";
import { ScrollArea } from "@src/components/ui/scroll-area";

interface KeyboardShortcutProps {
  handleKeyboardShortcutModalOpen: (open: boolean) => void;
  isKeyboardShortcutModalOpen: boolean;
}

//all existing styles in this file should be made using createStyles

const useStyles = createStyles((theme) => ({
  content: {
    borderRadius: "8px",
    height: "85vh",
    width: "max(400px,936px)",
    position: "relative",
    inset: 0,
    padding: 0,
  },
  overlay: {
    zIndex: 100,
    top: 0,
    left: 0,
    height: "100%",
    width: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  closeButton: {
    position: "absolute",
    backgroundColor: "transparent",
    border: 0,
    cursor: "pointer",
    top: 15,
    right: 10,
    padding: 0,
    color: theme.colors.accent1[0],
  },
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: 43,
    height: "100%",
    width: "100%",
    padding: 24,
    backgroundColor: theme.colors.modal[0],
  },
  column: {
    width: "100%",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    fontFamily: "Inter",
    marginBottom: 10,
  },
  platformName: {
    color: "#3d7ff2",
  },
  list: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    padding: theme.spacing.md, // 24px
    gap: theme.spacing.xs, // 8px
    boxShadow: "0px 0px 20px rgba(0, 0, 0, 0.15)",
    borderRadius: theme.radius.md, // 8px
    backgroundColor: theme.colors.modal[0],
    color: theme.colors.text[0],
    border: `1px solid ${theme.colors.modal[0]}`,
    width: "100%",
  },
  listItem: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    padding: theme.spacing.xs, // 8px
    width: "100%",
    boxShadow: "0px 0px 20px rgba(0, 0, 0, 0.1)",
    borderRadius: theme.radius.xs, // 2px
  },
  commandKey: {
    color: "#3d7ff2",
  },
}));

const KeyboardShortcutModal = ({
  handleKeyboardShortcutModalOpen,
  isKeyboardShortcutModalOpen,
}: KeyboardShortcutProps) => {
  const { classes } = useStyles();
  // const [isKeyboardShortcutModalOpen, setIsKeyboardShortcutOpen] =
  //   useState<boolean>(false);

  // return (
  //   <Modal
  //     data-testid="keyboard_shortcut_modal"
  //     opened={isOpen}
  //     onClose={onClose}
  //     size={1030}
  //   >
  //     <Button
  //       data-testid="keyboard_shortcut-closebtn"
  //       onClick={onClose}
  //       className={classes.closeButton}
  //     ></Button>

  //     <div data-testid="key_container" className={classes.container}>
  //       {platforms.map((platform) => {
  //         return (
  //           <div className={classes.column} key={platform.key}>
  //             <div className={classes.title}>
  //               For{" "}
  //               <span className={classes.platformName}>{platform.title}</span>
  //             </div>

  //             <div className={classes.list}>
  //               {keyboardShortcuts.map((shortcut) => (
  //                 <div className={classes.listItem} key={shortcut.command}>
  //                   <span>{shortcut.command}</span>
  //                   <span className={classes.commandKey}>
  //                     {shortcut.platforms[platform.key]}
  //                   </span>
  //                 </div>
  //               ))}
  //             </div>
  //           </div>
  //         );
  //       })}
  //     </div>
  //   </Modal>
  // );
  return (
    <Dialog
      open={isKeyboardShortcutModalOpen}
      onOpenChange={handleKeyboardShortcutModalOpen}
    >
      <DialogContent className="h-[560px] max-w-5xl">
        <DialogHeader className="mb-2"></DialogHeader>
        <ScrollArea>
          <div data-testid="key_container" className="flex justify-center">
            {platforms.map((platform) => {
              return (
                <div className="w-full" key={platform.key}>
                  <div className=" mb-4 text-2xl font-bold">
                    <span className=" text-gray-200">For</span>{" "}
                    <span className=" text-blue-500">{platform.title}</span>
                  </div>

                  <div className="border-1 flex w-full flex-col items-start gap-2 rounded-lg border-solid border-modal bg-modal p-6 text-gray-200 shadow-lg">
                    {keyboardShortcuts.map((shortcut) => (
                      <div
                        className="flex w-full flex-row items-start justify-between rounded-sm p-3 shadow-xl"
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
