import { createContext, useMemo } from "react";
import { LockedContextType } from "@/renderer/types/test-sequencer";
import { useDisplayedSequenceState } from "@/renderer/hooks/useTestSequencerState";

export const LockedContext = createContext<LockedContextType>(
  {} as LockedContextType,
); // the user can chose to disable certain interactable components

export const LockedContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { isLocked } = useDisplayedSequenceState();
  const value = useMemo<LockedContextType>(
    () => ({
      isLocked: isLocked,
    }),
    [isLocked],
  );
  return (
    <LockedContext.Provider value={value}>{children}</LockedContext.Provider>
  );
};
