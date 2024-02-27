import { LockedContext } from "@/renderer/context/lock.context";
type CreateLockedEntity = <T>(
  ComponentToDisable: React.ComponentType<T>,
) => React.ComponentType<
  T & { isLocked?: boolean; isException?: boolean; children?: React.ReactNode }
>;

export const createLockedEntity: CreateLockedEntity = (ComponentToDisable) => {
  return (props) => (
    <LockedContext.Consumer>
      {(value) => {
        const isLocked =
          typeof props.isLocked !== "undefined"
            ? props.isLocked || value.isLocked
            : value.isLocked;
        const isException =
          typeof props.isException !== "undefined" ? props.isException : false;
        const disabled = isLocked && !isException;
        return (
          <ComponentToDisable disabled={disabled} {...props}>
            {props.children}
          </ComponentToDisable>
        );
      }}
    </LockedContext.Consumer>
  );
};
