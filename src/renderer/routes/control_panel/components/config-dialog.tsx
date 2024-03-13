import { WidgetBlockInfo, WidgetConfig } from "@/renderer/types/control";

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
import { useProjectStore } from "@/renderer/stores/project";

type Props = {
  initialValues: WidgetConfig;
  open: boolean;
  setOpen: (val: boolean) => void;
  onSubmit: (data: WidgetConfig) => void;
  widgetBlockInfo: WidgetBlockInfo | null;
};

export const ConfigDialog = ({
  initialValues,
  open,
  setOpen,
  widgetBlockInfo,
  onSubmit,
}: Props) => {
  const blocks = useProjectStore((state) => state.nodes);
  const block = widgetBlockInfo
    ? blocks.find((b) => b.id === widgetBlockInfo.blockId)
    : undefined;
  const param = widgetBlockInfo?.blockParameter;
  const float =
    param && block ? block.data.ctrls[param]?.type === "float" : undefined;

  const form = match(initialValues)
    .with({ type: "slider" }, (vals) => (
      <SliderConfigForm
        initialValues={vals}
        onSubmit={onSubmit}
        float={float}
      />
    ))
    .with({ type: "knob" }, (vals) => (
      <KnobConfigForm initialValues={vals} onSubmit={onSubmit} float={float} />
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
