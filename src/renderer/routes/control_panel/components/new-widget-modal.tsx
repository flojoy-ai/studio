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
import { SlidersHorizontal } from "lucide-react";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/renderer/components/ui/form";
import { z } from "zod";
import { Combobox } from "@/renderer/components/ui/combobox";
import { WidgetType } from "@/renderer/types/control";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/renderer/components/ui/select";
import { capitalize } from "lodash";

// TODO: Implement the rest
const allowedWidgetTypes: Record<string, WidgetType[]> = {
  int: ["slider"],
  float: ["slider"],
};

const formSchema = z.object({
  blockId: z.string(),
  blockParameter: z.string(),
  widgetType: z.enum(["slider"]),
});

type FormSchema = z.infer<typeof formSchema>;

type Props = {
  open: boolean;
  setOpen: (val: boolean) => void;
};

export const NewWidgetModal = ({ open, setOpen }: Props) => {
  const { addNode, blocks } = useProjectStore((state) => ({
    addNode: state.addControlWidget,
    blocks: state.nodes,
  }));

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      blockId: "",
      blockParameter: "",
    },
  });

  const handleSubmit = (data: FormSchema) => {
    addNode(data.blockId, data.blockParameter, data.widgetType);
    setOpen(false);
  };

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

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>New widget</DialogTitle>
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
                  <FormLabel>Block</FormLabel>
                  <FormControl>
                    <Combobox
                      options={blocks}
                      value={field.value}
                      onValueChange={(val) => form.setValue("blockId", val)}
                      displaySelector={(b) => b.data.label}
                      valueSelector={(b) => b.id}
                    />
                  </FormControl>
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
                    <FormLabel>Parameter</FormLabel>
                    <FormControl>
                      <Combobox
                        options={parameters}
                        value={field.value}
                        onValueChange={(val) =>
                          form.setValue("blockParameter", val)
                        }
                        displaySelector={(param) => param}
                        valueSelector={(param) => param}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            {selectedParameter &&
              (widgetTypes ? (
                <FormField
                  control={form.control}
                  name="widgetType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Widget Type</FormLabel>
                      <FormControl>
                        <Select onValueChange={field.onChange}>
                          <SelectTrigger className="w-[144px]">
                            <SelectValue placeholder="Select widget type" />
                          </SelectTrigger>
                          <SelectContent>
                            {widgetTypes.map((t) => (
                              <SelectItem key={t} value={t}>
                                {capitalize(t)}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
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
              <Button type="submit">Create widget</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
