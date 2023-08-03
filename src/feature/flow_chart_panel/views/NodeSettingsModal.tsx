import {
  Dialog,
  DialogContent,
  DialogOverlay,
} from "@src/components/ui/dialog";
import { Input } from "@src/components/ui/input";
import { useSettings } from "@src/hooks/useSettings";

interface NodeSettingsModalProps {
  handleNodeSettingsModalOpen: (open: boolean) => void;
  isNodeSettingsModalOpen: boolean;
}

export const NodeSettingsModal = ({
  handleNodeSettingsModalOpen,
  isNodeSettingsModalOpen,
}: NodeSettingsModalProps) => {
  const { settingsList, updateSettingList } = useSettings();

  return (
    <Dialog
      open={isNodeSettingsModalOpen}
      onOpenChange={handleNodeSettingsModalOpen}
    >
      <DialogOverlay className="z-30 flex items-center justify-center">
        <DialogContent
          data-testid="settings-container"
          className="h-[50vh] max-w-4xl rounded-lg"
        >
          <div className="mt-4 flex w-full flex-col items-start gap-2 rounded-lg border-2 bg-modal p-6 shadow-md">
            {settingsList.map((setting) => (
              <div
                key={`settings-modal-${setting.key}`}
                className="mb-4 flex w-full flex-row items-start justify-between rounded-sm border-[1px] p-4 align-middle shadow-md"
              >
                <div>{setting.title}:</div>
                {setting.type === "numerical-input" && (
                  <Input
                    className=" mt-2 rounded-sm"
                    data-testid="settings-input"
                    placeholder="Search"
                    type="number"
                    value={setting.value}
                    onChange={(e) =>
                      updateSettingList(setting.key, Number(e.target.value))
                    }
                  />
                )}
              </div>
            ))}
          </div>
        </DialogContent>
      </DialogOverlay>
    </Dialog>
  );
};
