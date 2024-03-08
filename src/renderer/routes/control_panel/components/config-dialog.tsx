import { WidgetConfig } from "@/renderer/types/control";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/renderer/components/ui/dialog";
import { SliderConfigForm } from "./slider-form";

type Props<C extends WidgetConfig> = {
  initialValues: C;
  open: boolean;
  setOpen: (val: boolean) => void;
  onSubmit: (data: WidgetConfig) => void;
  float?: boolean;
};

export const ConfigDialog = <C extends WidgetConfig>({
  initialValues,
  open,
  setOpen,
  onSubmit,
}: Props<C>) => {
  const form =
    initialValues.type === "slider" ? (
      <SliderConfigForm initialValues={initialValues} onSubmit={onSubmit} />
    ) : undefined;
  if (!form) {
    throw new Error("Not implemented");
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Config</DialogTitle>
        </DialogHeader>

        {form}
      </DialogContent>
    </Dialog>
  );
};
