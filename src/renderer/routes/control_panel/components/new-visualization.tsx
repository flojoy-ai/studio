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
import { Box, LineChart } from "lucide-react";
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

const formSchema = z.object({
  blockId: z.string(),
});

type FormSchema = z.infer<typeof formSchema>;

type Props = {
  open: boolean;
  setOpen: (val: boolean) => void;
};

export const NewVisualizationModal = ({ open, setOpen }: Props) => {
  const { addVisualization, visualizationBlocks } = useProjectStore(
    useShallow((state) => ({
      addVisualization: state.addControlVisualization,
      visualizationBlocks: state.nodes.filter(
        (n) => n.type === "VISUALIZATION",
      ),
    })),
  );

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      blockId: "",
    },
  });

  const handleSubmit = (data: FormSchema) => {
    const res = addVisualization(data.blockId);
    if (res.isErr()) {
      toast.error(res.error.message);
    }
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button data-testid="app-gallery-btn" className="gap-2" variant="ghost">
          <LineChart size={20} className="stroke-muted-foreground" />
          New Visualization
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[360px]">
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
                        options={visualizationBlocks}
                        value={field.value}
                        onValueChange={(val) => form.setValue("blockId", val)}
                        displaySelector={(b) => b.data.label}
                        valueSelector={(b) => b.id}
                      />
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
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
