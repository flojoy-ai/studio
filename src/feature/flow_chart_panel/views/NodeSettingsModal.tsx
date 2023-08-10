import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@src/components/ui/dialog";
import { Input } from "@src/components/ui/input";
import { Label } from "@src/components/ui/label";
import { Separator } from "@src/components/ui/separator";
import { useSettings } from "@src/hooks/useSettings";

interface NodeSettingsModalProps {
  handleNodeSettingsModalOpen: (open: boolean) => void;
  isNodeSettingsModalOpen: boolean;
}

export const NodeSettingsModal = ({
  handleNodeSettingsModalOpen,
  isNodeSettingsModalOpen,
}: NodeSettingsModalProps) => {
  const { settings, updateSettings } = useSettings();

  return (
    <Dialog
      open={isNodeSettingsModalOpen}
      onOpenChange={handleNodeSettingsModalOpen}
    >
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader className="text-left">
          <DialogTitle>Runtime Settings</DialogTitle>
          <DialogDescription>
            Applies when the flowchart is running.
          </DialogDescription>
        </DialogHeader>

        {settings.map((setting) => (
          <div key={`settings-modal-${setting.key}`}>
            <Separator />
            <div className="py-1" />
            <Label className="font-semibold">{setting.title}</Label>
            <div className="text-sm text-muted-foreground">{setting.desc}</div>
            <Input
              name={setting.key}
              className="mt-2 w-40 rounded-sm"
              data-testid="settings-input"
              placeholder="Search"
              type="number"
              value={setting.value}
              onChange={(e) =>
                updateSettings(setting.key, parseInt(e.target.value, 10))
              }
            />
          </div>
        ))}
      </DialogContent>
    </Dialog>
  );
};
