import { useProjectStore } from "@/renderer/stores/project";
import {
  Dispatch,
  SetStateAction,
  useState,
  useRef,
  useEffect,
  useCallback,
} from "react";
import { toast } from "sonner";

import { useShallow } from "zustand/react/shallow";

type Props = {
  title: string;
  id: string;
  setIsRenamingTitle: Dispatch<SetStateAction<boolean>>;
};

const BlockLabelInput = ({ title, id, setIsRenamingTitle }: Props) => {
  const updateBlockLabel = useProjectStore(
    useShallow((state) => state.updateBlockLabel),
  );
  const [newTitle, setNewTitle] = useState<string>(title);

  const ref = useRef<HTMLInputElement>(null);

  const tryUpdate = useCallback(
    (newTitle: string) => {
      setIsRenamingTitle(false);
      const res = updateBlockLabel(id, newTitle);
      if (res.isErr()) {
        toast.error(res.error.message);
      }
    },
    [id, setIsRenamingTitle, updateBlockLabel],
  );

  useEffect(() => {
    const handleClick = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        tryUpdate(newTitle);
      }
    };

    document.addEventListener("click", handleClick);
    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, [ref, newTitle, tryUpdate]);

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
            tryUpdate(newTitle);
          } else if (event.key === "Escape") {
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

export default BlockLabelInput;
