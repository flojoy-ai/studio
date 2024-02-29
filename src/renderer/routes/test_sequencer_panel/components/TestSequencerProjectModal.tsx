import { Dialog, DialogContent } from "@/renderer/components/ui/dialog";
import { Button } from "@/renderer/components/ui/button";
import { Dispatch, SetStateAction, useState } from "react";
import { Input } from "@/renderer/components/ui/input";
import { useTestSequencerState } from "@/renderer/hooks/useTestSequencerState";
import { useCreateProject } from "@/renderer/hooks/useTestSequencerProject";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/renderer/components/ui/select";
import { InterpreterType } from "@/renderer/types/testSequencer";
import { PathInput } from "@/renderer/components/ui/path-input";

export const TestSequencerProjectModal = ({
  isProjectModalOpen,
  handleProjectModalOpen,
}: {
  isProjectModalOpen: boolean;
  handleProjectModalOpen: Dispatch<SetStateAction<boolean>>;
}) => {

  const { setElems, tree, setIsLocked, backendState } = useTestSequencerState(); 
  const handleCreate = useCreateProject();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [projectDirPath, setProjectDirPath] = useState("");
  const [interpreterPath, setInterpreterPath] = useState("");
  const [type, setType] = useState<InterpreterType>("flojoy");
  const availableInterpreter: InterpreterType[] = ["flojoy", "poetry", "pipenv", "conda"]

  return (
    <Dialog
      open={isProjectModalOpen}
      onOpenChange={handleProjectModalOpen}
    >
      <DialogContent>
        <h2 className="mb-2 pt-3 text-center text-lg font-bold text-accent1 ">
          Project Manager 
        </h2>
        <Input placeholder="Project Name" />
        <Input placeholder="Project Description" />
        <PathInput 
          placeholder="Project Folder" 
          allowedExtention={["tjoy"]}
          onChange={(event) => {setProjectDirPath(event.target.value); console.log(event.target.value);}} 
        />
        <div className="flex gap-2">
        <div className="flex-none w-[200px]">
        <Select onValueChange={setType}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Dependencies Manager" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Interpreter</SelectLabel>
              { availableInterpreter.map((interpreter) => (
              <SelectItem value={interpreter} key={interpreter}>
                  { interpreter.charAt(0).toUpperCase() + interpreter.slice(1) }
              </SelectItem> ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        </div>
        <PathInput 
          placeholder="Interpreter" 
          onChange={(event) => {setProjectDirPath(event.target.value); console.log(event.target.value);}} 
        />

        </div>
        <Button 
          variant={"default"}
          onClick={() => handleCreate(
            {
              name: name,
              description: description,
              root: tree,
              tjoy_file_path: projectDirPath,
              interpreter_path: interpreterPath,
              requirement_file_path: null,
            }
          )}
        > New Project </Button>
      </DialogContent>
    </Dialog>
  );
};

