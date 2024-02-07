import { LockedContext } from "../context/LockContext";
export const createLockedEntity = (ComponentToDisable: React.ComponentType) => {
  return (props) => (
    <LockedContext.Consumer>
      {(value) => (
        <ComponentToDisable
          {...props}
          disabled={value.isLocked}
        ></ComponentToDisable>
      )}
    </LockedContext.Consumer>
  );
};
