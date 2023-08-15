import { Dispatch, SetStateAction, useState } from "react";
import { useFlowChartGraph } from "@hooks/useFlowChartGraph";

interface NodeInputProps {
  title: string;
  id: string;
  setIsRenamingTitle: Dispatch<SetStateAction<boolean>>;
}

const NodeInput = ({ title, id, setIsRenamingTitle }: NodeInputProps) => {
  const { handleTitleChange } = useFlowChartGraph();
  const [newTitle, setNewTitle] = useState<string>(title);

  return (
    <div>
      <input
        type="text"
        value={newTitle}
        autoFocus={true}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            setIsRenamingTitle(false);
            handleTitleChange(newTitle, id);
          }
          if (event.key === "Escape") {
            setIsRenamingTitle(false);
          }
        }}
        onChange={(e) => {
          setNewTitle(e.target.value);
        }}
        className={
          "w-full bg-inherit px-2 text-center font-sans text-2xl font-extrabold tracking-wider outline-0"
        }
      />
    </div>
  );
};

export default NodeInput;
