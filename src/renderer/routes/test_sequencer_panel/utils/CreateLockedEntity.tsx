import { LockedContext } from "@/renderer/context/lock.context";
type CreateLockedEntity = <T>(
  ComponentToDisable: React.ComponentType<T>,
) => React.ComponentType<
  T & { isLocked?: boolean; children?: React.ReactNode }
>;

export const createLockedEntity: CreateLockedEntity = (ComponentToDisable) => {
  return (props) => (
    <LockedContext.Consumer>
      {(value) => {
        const isLocked =
          typeof props.isLocked !== "undefined"
            ? props.isLocked || value.isLocked
            : value.isLocked;
        return (
          <ComponentToDisable disabled={isLocked} {...props}>
            {props.children}
          </ComponentToDisable>
        );
      }}
    </LockedContext.Consumer>
  );
};
