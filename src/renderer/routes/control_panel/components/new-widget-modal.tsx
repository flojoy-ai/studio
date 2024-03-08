import { Button } from "@/renderer/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/renderer/components/ui/dialog";
import { useProjectStore } from "@/renderer/stores/project";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Box,
  Joystick,
  SlidersHorizontal,
  SquareCheck,
  TextCursorInput,
  Variable,
} from "lucide-react";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/renderer/components/ui/form";
import { Combobox } from "@/renderer/components/ui/combobox";
import {
  PythonType,
  WidgetBlockInfo,
  WidgetType,
} from "@/renderer/types/control";
import { toast } from "sonner";
import {
  Clickables,
  ClickablesItem,
} from "@/renderer/components/common/clickables";

const widgetTypeIcons = {
  slider: SlidersHorizontal,
  "number input": TextCursorInput,
  checkbox: SquareCheck,
};

const WidgetTypeIcon = ({ type }: { type: WidgetType }) => {
  const Icon = widgetTypeIcons[type];
  return (
    <div className="flex flex-col items-center">
      <Icon className="stroke-muted-foreground" />
      <div className="mt-2 text-xs font-bold uppercase text-muted-foreground">
        {type}
      </div>
    </div>
  );
};

// TODO: Implement the rest
const allowedWidgetTypes: Record<PythonType, WidgetType[]> = {
  int: ["slider", "number input"],
  float: ["slider", "number input"],
  bool: ["checkbox"],
};

type Props = {
  open: boolean;
  setOpen: (val: boolean) => void;
  onSubmit: (data: WidgetBlockInfo) => void;
};

export const NewWidgetModal = ({ open, setOpen, onSubmit }: Props) => {
  const blocks = useProjectStore((state) => state.nodes);

  const form = useForm<WidgetBlockInfo>({
    resolver: zodResolver(WidgetBlockInfo),
    defaultValues: {
      blockId: "",
      blockParameter: "",
    },
  });

  const selectedBlock = blocks.find((b) => b.id === form.watch("blockId"));
  const parameters = selectedBlock
    ? Object.keys(selectedBlock.data.ctrls)
    : undefined;

  const selectedParameter = form.watch("blockParameter");
  const selectedParameterType =
    selectedBlock && selectedParameter
      ? selectedBlock.data.ctrls[selectedParameter].type
      : undefined;

  const widgetTypes = selectedParameterType
    ? allowedWidgetTypes[selectedParameterType]
    : undefined;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button data-testid="app-gallery-btn" className="gap-2" variant="ghost">
          <SlidersHorizontal size={20} className="stroke-muted-foreground" />
          New Widget
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[396px]">
        <DialogHeader>
          <DialogTitle>New Widget</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit, (e) => {
              console.log(e);
              toast.error(e.root?.message);
            })}
            className="space-y-2"
          >
            <FormField
              control={form.control}
              name="blockId"
              render={({ field }) => (
                <FormItem>
                  <div className="flex justify-between">
                    <FormLabel className="flex items-center gap-2">
                      <Box size={20} className="stroke-muted-foreground" />
                      <div className="font-bold">Block</div>
                    </FormLabel>
                    <FormControl>
                      <Combobox
                        options={blocks}
                        value={field.value}
                        onValueChange={(val) => {
                          form.resetField("blockParameter");
                          form.resetField("widgetType");
                          form.setValue("blockId", val);
                        }}
                        displaySelector={(b) => b.data.label}
                        valueSelector={(b) => b.id}
                      />
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            {parameters && (
              <FormField
                control={form.control}
                name="blockParameter"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex justify-between">
                      <FormLabel className="flex items-center gap-2">
                        <Variable
                          size={20}
                          className="stroke-muted-foreground"
                        />
                        <div className="font-bold">Parameter</div>
                      </FormLabel>
                      <FormControl>
                        <Combobox
                          options={parameters}
                          value={field.value}
                          onValueChange={(val) => {
                            form.resetField("widgetType");
                            form.setValue("blockParameter", val);
                          }}
                          displaySelector={(param) => param}
                          valueSelector={(param) => param}
                        />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            <div className="py-0.5" />
            {selectedParameter &&
              (widgetTypes ? (
                <FormField
                  control={form.control}
                  name="widgetType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="mb-0.5 flex items-center gap-2">
                        <Joystick
                          size={20}
                          className="stroke-muted-foreground"
                        />
                        <div className="font-bold">Widget Type</div>
                      </FormLabel>
                      <div className="py-0.5" />
                      <FormControl>
                        <Clickables onChange={field.onChange}>
                          {widgetTypes.map((t) => (
                            <ClickablesItem value={t}>
                              <WidgetTypeIcon type={t} key={t} />
                            </ClickablesItem>
                          ))}
                        </Clickables>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ) : (
                <div>
                  This parameter type is not supported yet for widgets, sorry!
                </div>
              ))}
            <DialogFooter>
              <Button type="submit">Confirm</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
