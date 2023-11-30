import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@src/components/ui/dialog";
import { Label } from "@src/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@src/components/ui/select";
import { getLogLevel, setLogLevel } from "@src/services/FlowChartServices";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export type SettingsModalProps = {
  handleSettingsModalOpen: (open: boolean) => void;
  isSettingsModalOpen: boolean;
};

export const DebugSettingsModal = ({
  handleSettingsModalOpen,
  isSettingsModalOpen,
}: SettingsModalProps) => {
  const [level, setLevel] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (isSettingsModalOpen) {
      getLogLevel().then((data) => {
        console.log(data);
        setLevel(data);
      })
    }
  }, [isSettingsModalOpen])

  const onLogLevelChange = async (val: string) => {
    try {
      await setLogLevel(val);
      setLevel(val);
    } catch {
      toast.error("Failed to set log level, is the backend running?")
    }
  }


  return (
    <Dialog open={isSettingsModalOpen} onOpenChange={handleSettingsModalOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader className="text-left">
          <DialogTitle>Debug Settings</DialogTitle>
          <DialogDescription>Advanced settings for debugging Flojoy Studio itself.</DialogDescription>
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
