import { SliderConfig } from "@/renderer/types/control";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/renderer/components/ui/dialog";
import { SliderConfigForm } from "./slider-form";

type Config = {
  slider: SliderConfig;
};

type Props<K extends keyof Config> = {
  widgetType: K;
  initialValues: Partial<Config[K]>;
  open: boolean;
  setOpen: (val: boolean) => void;
  onSubmit: (data: Config[K]) => void;
  float?: boolean;
};

export const ConfigDialog = <K extends keyof Config>({
  widgetType,
  initialValues,
  open,
  setOpen,
  onSubmit,
}: Props<K>) => {
  const ConfigForm = widgetType === "slider" ? SliderConfigForm : undefined;
  if (!ConfigForm) {
    throw new Error("Not implemented");
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Config</DialogTitle>
        </DialogHeader>

        <ConfigForm initialValues={initialValues} onSubmit={onSubmit} />
      </DialogContent>
    </Dialog>
  );
};
