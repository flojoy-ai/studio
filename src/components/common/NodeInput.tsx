import { Dispatch, SetStateAction, useState, useRef, useEffect } from "react";
import { useFlowChartGraph } from "@hooks/useFlowChartGraph";

type NodeInputProps {
  title: string;
  id: string;
  setIsRenamingTitle: Dispatch<SetStateAction<boolean>>;
}

const NodeInput = ({ title, id, setIsRenamingTitle }: NodeInputProps) => {
  const { handleTitleChange } = useFlowChartGraph();
  const [newTitle, setNewTitle] = useState<string>(title);

  const ref = useRef();

  useEffect(() => {
    const handleClick = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setIsRenamingTitle(false);
        handleTitleChange(newTitle, id);
      }
    };

    document.addEventListener("click", handleClick);
    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, [ref, newTitle]);

  return (
    <div>
      <input
        ref={ref}
        type="text"
        value={newTitle}
        autoFocus={true}
        onClick={(event) => event.stopPropagation()}
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
