import { Dialog, DialogContent } from "@/renderer/components/ui/dialog";
import { Button } from "@/renderer/components/ui/button";
import { useState } from "react";
import { Input } from "@/renderer/components/ui/input";
import { useDisplayedSequenceState } from "@/renderer/hooks/useTestSequencerState";
import { useCreateSequence } from "@/renderer/hooks/useTestSequencerProject";
import { InterpreterType } from "@/renderer/types/test-sequencer";
import { PathInput } from "@/renderer/components/ui/path-input";
import { useSequencerModalStore } from "@/renderer/stores/modal";
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/renderer/components/ui/form";

const formSchema = z.object({
  name: z.string().min(1).max(50).regex(/\S/),
  description: z.string().max(100),
  projectPath: z.string().min(1).regex(/\S/),
})


export const CreateSequenceModal = () => {
  const { isCreateProjectModalOpen, setIsCreateProjectModalOpen } =
    useSequencerModalStore();
  const { elems } = useDisplayedSequenceState();
  const handleCreate = useCreateSequence();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [interpreterPath, setInterpreterPath] = useState("");
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [type, setType] = useState<InterpreterType>("flojoy");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      projectPath: "",
    },
  });

  function handleSubmit(values: z.infer<typeof formSchema>) {
    handleCreate(
      {
        name: values.name,
        description: values.description,
        elems: elems,
        projectPath: values.projectPath,
        interpreter: {
          type: type,
          path: interpreterPath === "" ? null : interpreterPath,
          requirementsPath: "flojoy_requirements.txt",
        },
      },
      setIsCreateProjectModalOpen,
    );
  }

  return (
    <Dialog
      open={isCreateProjectModalOpen}
      onOpenChange={setIsCreateProjectModalOpen}
    >
      <DialogContent>
        <h2 className="mb-2 text-lg font-bold text-accent1 ">
          New Sequence
        </h2>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sequence Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Sequence Name"
                      data-testid="new-seq-modal-name-input"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Sequence Description"
                      data-testid="new-seq-modal-desc-input"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="projectPath"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project Root Directory</FormLabel>
                  <FormControl>
                    <PathInput
                      placeholder="Root Directory"
                      allowedExtention={["tjoy"]}
                      {...field}
                      pickerType="directory"
                      allowDirectoryCreation={true}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {
              // <div className="flex gap-2">
              //   <div className="flex-none w-[200px]">
              //   <Select onValueChange={(e: InterpreterType) => {setType(e)}}>
              //     <SelectTrigger className="w-[200px]">
              //       <SelectValue placeholder="Dependencies Manager" />
              //     </SelectTrigger>
              //     <SelectContent>
              //       <SelectGroup>
              //         <SelectLabel>Interpreter</SelectLabel>
              //         { availableInterpreter.map((interpreter) => (
              //           <SelectItem value={interpreter} key={interpreter}>
              //               { interpreter.charAt(0).toUpperCase() + interpreter.slice(1) }
              //           </SelectItem>
              //         ))}
              //       </SelectGroup>
              //     </SelectContent>
              //   </Select>
              //   </div>
              //   <PathInput
              //     placeholder="Interpreter"
              //     onChange={(event) => {setInterpreterPath(event.target.value)}}
              //   />
              // </div>
            }
            <Button
              data-testid="new-seq-modal-create-btn"
              type="submit" 
              className="w-full mt-4"
            >
              New Sequence
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
