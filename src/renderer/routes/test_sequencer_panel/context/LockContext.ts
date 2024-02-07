import { createContext } from "react";
import { LockedContextType } from "@src/types/testSequencer";

export const LockedContext = createContext<LockedContextType>(
  {} as LockedContextType,
); // the user can chose to disable certain interactable components
