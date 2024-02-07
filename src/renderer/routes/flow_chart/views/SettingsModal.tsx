import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/renderer/components/ui/dialog";
import { Input } from "@/renderer/components/ui/input";
import { Label } from "@/renderer/components/ui/label";
import { Separator } from "@/renderer/components/ui/separator";
import { Switch } from "@/renderer/components/ui/switch";
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
