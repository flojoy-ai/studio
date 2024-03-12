import { cn } from "@/renderer/lib/utils";
import { createContext, useContext, useState } from "react";

type ClickablesState = {
  selected: string | undefined;
  setSelected: (val: string | undefined) => void;
};
export const ClickablesContext = createContext<ClickablesState>({
  selected: undefined,
  setSelected: () => {},
});

type ClickablesProps = {
  children: React.ReactNode;
  onChange?: (val: string | undefined) => void;
};

export const Clickables = ({ children, onChange }: ClickablesProps) => {
  const [selected, setSelected] = useState<string | undefined>(undefined);

  const setter = (val: string | undefined) => {
    setSelected(val);
    if (onChange) {
      onChange(val);
    }
  };

  return (
    <ClickablesContext.Provider value={{ selected, setSelected: setter }}>
      <div className="flex gap-2">{children}</div>
    </ClickablesContext.Provider>
  );
};

type ClickablesItemProps = {
  children: React.ReactNode;
  value: string;
  className?: string;
};

export const ClickablesItem = ({ children, value }: ClickablesItemProps) => {
  const { selected, setSelected } = useContext(ClickablesContext);

  return (
    <div
      className={cn(
        "w-fit cursor-pointer rounded-md border-2 p-3 transition-colors duration-300",
        selected === value ? "border-accent1" : "hover:border-accent1/70",
      )}
      onClick={() => setSelected(value)}
    >
      {children}
    </div>
  );
};
