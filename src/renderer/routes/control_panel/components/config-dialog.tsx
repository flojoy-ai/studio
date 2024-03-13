import { WidgetConfig } from "@/renderer/types/control";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/renderer/components/ui/dialog";
import { SliderConfigForm } from "./slider-form";
import { match } from "ts-pattern";
import { FileUploadConfigForm } from "./file-upload-form";
import { KnobConfigForm } from "./knob-form";

type Props = {
  initialValues: WidgetConfig;
  open: boolean;
  setOpen: (val: boolean) => void;
  onSubmit: (data: WidgetConfig) => void;
  float?: boolean;
};

export const ConfigDialog = ({
  initialValues,
  open,
  setOpen,
  onSubmit,
}: Props) => {
  const form = match(initialValues)
    .with({ type: "slider" }, (vals) => (
      <SliderConfigForm initialValues={vals} onSubmit={onSubmit} />
    ))
    .with({ type: "knob" }, (vals) => (
      <KnobConfigForm initialValues={vals} onSubmit={onSubmit} />
    ))
    .with({ type: "file upload" }, (vals) => (
      <FileUploadConfigForm initialValues={vals} onSubmit={onSubmit} />
    ))
    .otherwise(() => undefined);

  if (!form) {
    throw new Error("Not implemented");
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[360px]">
        <DialogHeader>
          <DialogTitle>Config</DialogTitle>
        </DialogHeader>

        {form}
      </DialogContent>
    </Dialog>
  );
};
