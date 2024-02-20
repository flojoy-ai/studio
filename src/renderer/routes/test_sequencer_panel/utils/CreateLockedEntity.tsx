import { LockedContext } from "@/renderer/context/lock.context";

export const createLockedEntity = (ComponentToDisable: React.ComponentType) => {
  return (props) => (
    <LockedContext.Consumer>
      {(value) => (
        <ComponentToDisable
          disabled={value.isLocked}
          {...props}
        ></ComponentToDisable>
      )}
    </LockedContext.Consumer>
  );
};
