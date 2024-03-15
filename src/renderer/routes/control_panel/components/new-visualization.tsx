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
import { Box, LineChart, Variable } from "lucide-react";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/renderer/components/ui/form";
import { z } from "zod";
import { Combobox } from "@/renderer/components/ui/combobox";
import { toast } from "sonner";
import { useShallow } from "zustand/react/shallow";
import { FormIconLabel } from "@/renderer/components/common/form-icon-label";
import {
  FlojoyType,
  FLOJOY_TYPES,
  VisualizationType,
  VISUALIZATIONS,
} from "@/renderer/types/control";
import { typedObjectFromEntries, typedObjectKeys } from "@/renderer/types/util";
import {
  Clickables,
  ClickablesItem,
} from "@/renderer/components/common/clickables";

const mapTypesToVisualizations = () => {
  const res: Record<FlojoyType, VisualizationType[]> = typedObjectFromEntries(
    FLOJOY_TYPES.map((t) => [t, []]),
  );

  for (const k of typedObjectKeys(VISUALIZATIONS)) {
    for (const type of VISUALIZATIONS[k].allowedTypes) {
      res[type].push(k);
    }
  }
  return res;
};

const allowedVisualizations = mapTypesToVisualizations();

const VisualizationTypeIcon = ({ type }: { type: VisualizationType }) => {
  const Icon = VISUALIZATIONS[type].icon;
  return (
    <div className="flex flex-col items-center">
      <Icon className="stroke-muted-foreground" />
      <div className="mt-2 text-xs font-bold uppercase text-muted-foreground">
        {type}
      </div>
    </div>
  );
};

const formSchema = z.object({
  blockId: z.string(),
  blockOutput: z.string(),
  visualizationType: VisualizationType,
});

type FormSchema = z.infer<typeof formSchema>;

type Props = {
  open: boolean;
  setOpen: (val: boolean) => void;
};

export const NewVisualizationModal = ({ open, setOpen }: Props) => {
  const { addVisualization, blocks } = useProjectStore(
    useShallow((state) => ({
      addVisualization: state.addControlVisualization,
      blocks: state.nodes,
    })),
  );

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      blockId: "",
    },
  });

  const handleSetBlock = (val: string) => {
    form.setValue("blockId", val);
    const selectedBlock = blocks.find((b) => b.id === val);
    const outputs =
      selectedBlock && selectedBlock.data.outputs
        ? selectedBlock.data.outputs.map((o) => o.name)
        : undefined;
    const multipleOutputs = outputs && outputs.length > 1;
    const defaultOutput = outputs?.[0];
    if (!multipleOutputs && defaultOutput) {
      form.setValue("blockOutput", defaultOutput);
    }
  };

  const handleSubmit = (data: FormSchema) => {
    const res = addVisualization(
      data.blockId,
      data.blockOutput,
      data.visualizationType,
    );
    if (res.isErr()) {
      toast.error(res.error.message);
    }
    setOpen(false);
  };

  const selectedBlock = blocks.find((b) => b.id === form.watch("blockId"));
  const outputs =
    selectedBlock && selectedBlock.data.outputs
      ? selectedBlock.data.outputs.map((o) => o.name)
      : undefined;
  const multipleOutputs = outputs && outputs.length > 1;

  const selectedOutput = form.watch("blockOutput");
  const selectedOutputType =
    selectedBlock && selectedBlock.data.outputs && selectedOutput
      ? selectedBlock.data.outputs.find((o) => o.name === selectedOutput)?.type
      : undefined;

  const visualizationTypes = selectedOutputType
    ? allowedVisualizations[selectedOutputType]
    : undefined;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button data-testid="app-gallery-btn" className="gap-2" variant="ghost">
          <LineChart size={20} className="stroke-muted-foreground" />
          New Visualization
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-[360px]">
        <DialogHeader>
          <DialogTitle>New Visualization</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit, (e) => {
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
                    <FormIconLabel icon={Box}>Block</FormIconLabel>
                    <FormControl>
                      <Combobox
                        options={blocks}
                        value={field.value}
                        onValueChange={handleSetBlock}
                        displaySelector={(b) => b.data.label}
                        valueSelector={(b) => b.id}
                      />
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            {multipleOutputs && outputs && (
              <FormField
                control={form.control}
                name="blockOutput"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex justify-between">
                      <FormIconLabel icon={Variable}>Parameter</FormIconLabel>
                      <FormControl>
                        <Combobox
                          options={outputs}
                          value={field.value}
                          onValueChange={(val) => {
                            form.resetField("visualizationType");
                            form.setValue("blockOutput", val);
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
            <div className="h-0.5" />
            {selectedOutput &&
              (visualizationTypes ? (
                <FormField
                  control={form.control}
                  name="visualizationType"
                  render={({ field }) => (
                    <FormItem>
                      <FormIconLabel icon={LineChart}>
                        Visualization Type
                      </FormIconLabel>
                      <div className="h-0.5" />
                      <FormControl>
                        <Clickables onChange={field.onChange}>
                          {visualizationTypes.map((t) => (
                            <ClickablesItem value={t} key={t}>
                              <VisualizationTypeIcon type={t} />
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
                  This output type is not supported yet for visualizations,
                  sorry!
                </div>
              ))}
            <div className="py-1" />
            <DialogFooter>
              <Button type="submit">Confirm</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
