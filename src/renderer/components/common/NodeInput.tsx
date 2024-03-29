import { cn } from "@/renderer/lib/utils";
import { Result } from "neverthrow";
import {
  Dispatch,
  SetStateAction,
  useState,
  useRef,
  useEffect,
  useCallback,
} from "react";
import { toast } from "sonner";

type Props = {
  title: string;
  id: string;
  setIsRenamingTitle: Dispatch<SetStateAction<boolean>>;
  updateLabel: (id: string, newLabel: string) => Result<void, Error>;
  className?: string;
};

const NodeInput = ({
  title,
  id,
  setIsRenamingTitle,
  updateLabel,
  className,
}: Props) => {
  const [newTitle, setNewTitle] = useState<string>(title);

  const ref = useRef<HTMLInputElement>(null);

  const tryUpdate = useCallback(
    (newTitle: string) => {
      setIsRenamingTitle(false);
      const res = updateLabel(id, newTitle);
      if (res.isErr()) {
        toast.error(res.error.message);
      }
    },
    [id, setIsRenamingTitle, updateLabel],
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
        className={cn(
          "nodrag max-w-fit bg-inherit text-center outline-0",
          className,
        )}
      />
    </div>
  );
};

export default NodeInput;
