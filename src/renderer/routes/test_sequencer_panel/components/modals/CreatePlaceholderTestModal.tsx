import { Button } from "@/renderer/components/ui/button";
import { Dialog, DialogContent } from "@/renderer/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/renderer/components/ui/form";
import { Input } from "@/renderer/components/ui/input";
import {
  createNewTest,
  useDisplayedSequenceState,
} from "@/renderer/hooks/useTestSequencerState";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod"

const formSchema = z.object({
  name: z.string().min(1).regex(/\S/),
  min: z.coerce.number().optional(),
  max: z.coerce.number().optional(),
  unit: z.string().optional(),
})

export const CreatePlaceholderTestModal = ({
  isModalOpen,
  setModalOpen,
}: {
  isModalOpen: boolean;
  setModalOpen: (value: boolean) => void;
}) => {
  const { addNewElems } = useDisplayedSequenceState();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      unit: undefined,
      min: undefined,
      max: undefined,
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const res = await addNewElems([
      createNewTest({
        name: values.name,
        path: "",
        type: "placeholder",
        exportToCloud: false,
        minValue: values.min,
        maxValue: values.max,
        unit: values.unit,
      }),
    ]);
    if (res.isErr()) {
      return;
    }
    setModalOpen(false);
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={setModalOpen}>
      <DialogContent>
        <h2 className="text-lg font-bold text-accent1">
          Create a placeholder test step
        </h2>
        <p className="text-xs text-muted-foreground">
          {" "}
          This will create a new test step with the given name and expected
          value without being link to any code. The code can be added later.
        </p>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Test Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Power Supply Voltage Test"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grow pb-1 text-xs">
              <p className="mb-2 font-bold text-muted-foreground">Expected Value</p>
              <div className="flex gap-2">
                <div className="grow pb-1 text-xs">
                  <FormField
                    control={form.control}
                    name="min"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Minimum</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="number"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grow pb-1 text-xs">
                  <FormField
                    control={form.control}
                    name="max"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Maximun</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="number"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grow pb-1 text-xs">
                  <FormField
                    control={form.control}
                    name="unit"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Displayed Unit</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>
            <Button type="submit" className="w-full">Submit</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
