import { createLockedEntity } from "../../utils/CreateLockedEntity";
import { Button, ButtonProps } from "@/renderer/components/ui/button";

let LockableButton = (props: ButtonProps) => (
  <Button {...props}>{props.children}</Button>
);

LockableButton = createLockedEntity(LockableButton);
export default LockableButton;
