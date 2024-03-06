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
    addNode: state.addControl,
    blocks: state.nodes,
  }));

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      blockId: "",
      blockParameter: "",
      // TODO: Logic for picking valid widget types based on parameter type
      widgetType: "slider",
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
            onSubmit={form.handleSubmit(handleSubmit)}
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
            <DialogFooter>
              <Button type="submit">Create widget</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
