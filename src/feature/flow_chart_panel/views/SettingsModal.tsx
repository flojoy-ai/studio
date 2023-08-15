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
import { Switch } from "@src/components/ui/switch";
import { useSettings } from "@src/hooks/useSettings";

export type SettingsModalProps = {
  handleSettingsModalOpen: (open: boolean) => void;
  isSettingsModalOpen: boolean;
};

export const SettingsModal = ({
  handleSettingsModalOpen,
  isSettingsModalOpen,
  settings,
  updateSettings,
  title,
  description,
}: SettingsModalProps &
  ReturnType<typeof useSettings> & {
    description: string;
    title: string;
  }) => {
  return (
    <Dialog open={isSettingsModalOpen} onOpenChange={handleSettingsModalOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader className="text-left">
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        {settings.map((setting) => {
          return (
            <div key={`settings-modal-${setting.key}`}>
              <Separator />
              <div className="py-1" />
              <Label className="font-semibold">{setting.title}</Label>
              <div className="text-sm text-muted-foreground">
                {setting.desc}
              </div>
              {typeof setting.value === "number" && (
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
              )}
              {typeof setting.value === "boolean" && (
                <Switch
                  name={setting.key}
                  className="mt-2"
                  data-testid="settings-switch"
                  placeholder="Search"
                  checked={setting.value}
                  onCheckedChange={(checked) =>
                    updateSettings(setting.key, checked)
                  }
                />
              )}
            </div>
          );
        })}
      </DialogContent>
    </Dialog>
  );
};
