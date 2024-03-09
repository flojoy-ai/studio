import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/renderer/components/ui/dialog";
import { Label } from "@/renderer/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/renderer/components/ui/select";
import { getLogLevel, setLogLevel } from "@/renderer/lib/api";
import { useEffect, useState } from "react";
import { toast } from "sonner";

type Props = {
  isDebugSettingsOpen: boolean;
  setIsDebugSettingsOpen: (val: boolean) => void;
};

export const DebugSettingsModal = ({
  isDebugSettingsOpen,
  setIsDebugSettingsOpen,
}: Props) => {
  const [level, setLevel] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (isDebugSettingsOpen) {
      getLogLevel().then((data) => {
        data.match(
          (v) => setLevel(v),
          (e) =>
            toast.error("Error setting log level", { description: e.message }),
        );
      });
    }
  }, [isDebugSettingsOpen]);

  const onLogLevelChange = async (val: string) => {
    try {
      await setLogLevel(val);
      setLevel(val);
    } catch {
      toast.error("Failed to set log level, is the backend running?");
    }
  };

  return (
    <Dialog open={isDebugSettingsOpen} onOpenChange={setIsDebugSettingsOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader className="text-left">
          <DialogTitle>Debug Settings</DialogTitle>
          <DialogDescription>
            Advanced settings for debugging Flojoy Studio itself.
          </DialogDescription>
        </DialogHeader>
        <div>
          <Label className="font-semibold">Log Level</Label>
          <div className="text-sm text-muted-foreground">
            The log level to display, higher level = fewer logs.
          </div>
          <div className="py-1" />
          <Select value={level} onValueChange={onLogLevelChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="DEBUG">Debug</SelectItem>
              <SelectItem value="INFO">Info</SelectItem>
              <SelectItem value="WARNING">Warning</SelectItem>
              <SelectItem value="ERROR">Error</SelectItem>
              <SelectItem value="CRITICAL">Critical</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </DialogContent>
    </Dialog>
  );
};
