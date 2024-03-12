import { useControlBlock } from "@/renderer/hooks/useControlBlock";
import { FileUploadConfig, WidgetProps } from "@/renderer/types/control";
import WidgetLabel from "@/renderer/components/common/widget-label";
import { Button } from "@/renderer/components/ui/button";
import { toast } from "sonner";

export const FileUploadNode = ({ id, data }: WidgetProps<FileUploadConfig>) => {
  const { block, updateBlockParameter } = useControlBlock(data.blockId);
  if (!block) {
    return <div className="text-2xl text-red-500">NOT FOUND</div>;
  }

  const name = block.data.label;
  const paramVal = block.data.ctrls[data.blockParameter].value;

  const handleChange = (path: string) => {
    const res = updateBlockParameter(block.id, data.blockParameter, path);
    if (res.isErr()) {
      toast.error("Error updating block parameter", {
        description: res.error.message,
      });
    }
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <WidgetLabel
        label={data.label}
        placeholder={`${name} (${data.blockParameter})`}
        widgetId={id}
      />
      <div className="flex flex-col items-center rounded-md border p-2">
        <Button
          variant={"secondary"}
          onClick={() => {
            const fileInput = document.createElement("input");
            fileInput.type = "file";
            console.log(data.config.allowedExtensions.join(","));
            fileInput.accept =
              data.config.allowedExtensions.length > 0
                ? data.config.allowedExtensions.map((v) => v.ext).join(",")
                : "*";
            fileInput.onchange = (e) => {
              const files = (e.target as HTMLInputElement).files;
              if (files && files.length > 0) {
                const file = files[0];
                const path = file.path;
                handleChange(path);
              }
            };
            fileInput.click();
          }}
        >
          Browse
        </Button>
        <div className="text-xl font-bold">{paramVal}</div>
      </div>
    </div>
  );
};
