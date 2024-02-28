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
import { Setting, SettingsState } from "@/renderer/stores/settings";
import { getEntries } from "@/renderer/types/util";

export type SettingsModalProps<
  K extends keyof SettingsState,
  S extends keyof SettingsState[K],
  A extends (key: keyof SettingsState[K], value: SettingsState[K][S]) => void,
> = {
  handleSettingsModalOpen: (open: boolean) => void;
  isSettingsModalOpen: boolean;
  settings: SettingsState[K];
  updateSettings: A;
  description: string;
  title: string;
};

export const SettingsModal = <
  K extends keyof SettingsState,
  S extends keyof SettingsState[K],
  A extends (key: keyof SettingsState[K], value: SettingsState[K][S]) => void,
>({
  handleSettingsModalOpen,
  isSettingsModalOpen,
  settings,
  updateSettings,
  title,
  description,
}: SettingsModalProps<K, S, A>) => {
  return (
    <Dialog open={isSettingsModalOpen} onOpenChange={handleSettingsModalOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader className="text-left">
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        {getEntries(settings).map(([key, s]) => {
          const setting = s as Setting;
          const settingName = String(key);
          return (
            <div key={`settings-modal-${settingName}`}>
              <Separator />
              <div className="py-1" />
              <Label className="font-semibold">{setting.title}</Label>
              <div className="text-sm text-muted-foreground">
                {setting.desc}
              </div>
              {setting.type === "number" && (
                <Input
                  name={settingName}
                  className="mt-2 w-40 rounded-sm"
                  data-testid="settings-input"
                  placeholder="Search"
                  type="number"
                  value={setting.value}
                  onChange={(e) =>
                    updateSettings(
                      key,
                      parseInt(e.target.value, 10) as SettingsState[K][S],
                    )
                  }
                />
              )}
              {setting.type === "boolean" && (
                <Switch
                  name={settingName}
                  className="mt-2"
                  data-testid="settings-switch"
                  checked={setting.value}
                  onCheckedChange={(checked) =>
                    updateSettings(key, checked as SettingsState[K][S])
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
