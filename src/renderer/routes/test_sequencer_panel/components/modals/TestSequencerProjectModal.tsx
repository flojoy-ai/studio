import { Dialog, DialogContent } from "@/renderer/components/ui/dialog";
import { Button } from "@/renderer/components/ui/button";
import { useState } from "react";
import { Input } from "@/renderer/components/ui/input";
import { useTestSequencerState } from "@/renderer/hooks/useTestSequencerState";
import { useCreateSequence } from "@/renderer/hooks/useTestSequencerProject";
import { InterpreterType } from "@/renderer/types/test-sequencer";
import { PathInput } from "@/renderer/components/ui/path-input";
import { useSequencerModalStore } from "@/renderer/stores/modal";

export const TestSequencerProjectModal = () => {
  const { isCreateProjectModalOpen, setIsCreateProjectModalOpen } =
    useSequencerModalStore();
  const { elems } = useTestSequencerState();
  const handleCreate = useCreateSequence();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [projectDirPath, setProjectDirPath] = useState("");
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [interpreterPath, setInterpreterPath] = useState("");
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [type, setType] = useState<InterpreterType>("flojoy");

  function handleSubmit() {
    handleCreate(
      {
        name: name,
        description: description,
        elems: elems,
        projectPath: projectDirPath,
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
        <h2 className="mb-2 text-center text-lg font-bold text-accent1 ">
          New Sequence
        </h2>
        <Input
          placeholder="Sequence Name"
          data-testid="new-seq-modal-name-input"
          onChange={(e) => {
            setName(e.target.value);
          }}
        />
        <Input
          placeholder="Sequence Description"
          data-testid="new-seq-modal-desc-input"
          onChange={(e) => {
            setDescription(e.target.value);
          }}
        />
        <PathInput
          placeholder="Root Directory"
          allowedExtention={["tjoy"]}
          onChange={(event) => {
            setProjectDirPath(event.target.value);
          }}
          pickerType="directory"
          allowDirectoryCreation={true}
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
          variant={"default"}
          data-testid="new-seq-modal-create-btn"
          onClick={() => handleSubmit()}
        >
          New Sequence
        </Button>
      </DialogContent>
    </Dialog>
  );
};
