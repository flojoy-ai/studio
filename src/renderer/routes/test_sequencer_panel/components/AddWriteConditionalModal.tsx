import { Dialog, DialogContent } from "@/renderer/components/ui/dialog";
import { Button } from "@/renderer/components/ui/button";
import { Dispatch, SetStateAction, useState } from "react";
import { Input } from "@/renderer/components/ui/input";
import { Badge } from "@/renderer/components/ui/badge";
import { useTestSequencerState } from "@/renderer/hooks/useTestSequencerState";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/renderer/components//ui/dropdown-menu"
import {
  Test,
} from "@/renderer/types/testSequencer";



export const WriteConditionalModal = ({
  isConditionalModalOpen,
  setConditionalModalOpen,
  handleWriteConditionalModalOpen,
  handleWrite,
}: {
  isConditionalModalOpen: boolean;
  setConditionalModalOpen: (value: boolean) => void;
  handleWriteConditionalModalOpen: Dispatch<SetStateAction<boolean>>;
  handleWrite: (input: string) => void;
}) => {
  const [value, setValue] = useState("");
  const { elems } = useTestSequencerState();
  // @ts-ignore
  const [tests, setTests] = useState(elems.filter(elem => elem.type === "test").map(elem => elem.testName));
  function addToValue(v: string) {
    const leader = value[value.length - 1] === " " ? "" : " ";
    setValue(value + leader + v);
  }
  return (
    <Dialog
      open={isConditionalModalOpen}
      onOpenChange={handleWriteConditionalModalOpen}
    >
      <DialogContent>
        <h2 className="text-lg font-bold text-accent1"> Add Conditional </h2>
        <div className="flex">
          <div>
            <p className="text-muted-foreground"> Boolean Operation </p>
            <div className="flex pt-2">
              <Badge variant={"outline"} onClick={() => {addToValue("&");}} className="hover:cursor-pointer flex-initial mr-2">And</Badge>
              <Badge variant={"outline"} onClick={() => {addToValue("|");}} className="hover:cursor-pointer flex-initial mr-2">Or</Badge>
              <Badge variant={"outline"} onClick={() => {addToValue("!");}} className="hover:cursor-pointer flex-initial mr-2">Not</Badge>
              <Badge variant={"outline"} onClick={() => {addToValue("(");}} className="hover:cursor-pointer flex-initial mr-2">(</Badge>
              <Badge variant={"outline"} onClick={() => {addToValue(")");}} className="hover:cursor-pointer flex-initial mr-2">)</Badge>
            </div>
          </div>
          <div className="pl-10">
            <p className="text-muted-foreground pb-1"> Test Result </p>
            <DropdownMenu>
            <DropdownMenuTrigger className="inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">Get Pass/Fail result of a test</DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Return the boolean</DropdownMenuLabel>
              <DropdownMenuSeparator />
              { tests.map((test) => {
                return <DropdownMenuItem onClick={() => {addToValue(`$${test}`);}}>{test}</DropdownMenuItem>
              })}
            </DropdownMenuContent>
          </DropdownMenu>
          </div>
        </div>
        <Input type="text" placeholder="$file.py::test_name & $file.py::test_name" value={value} onChange={(e) => {setValue(e.target.value)}} />
        <Button onClick={() => {handleWrite(value); setConditionalModalOpen(false)}}>Submit</Button>
      </DialogContent>
    </Dialog>
  );
};
