import { createLockedEntity } from "../../utils/CreateLockedEntity";
import { Button } from "@/renderer/components/ui/button";

let LockableButton = (props) => <Button {...props}>{props.children}</Button>;

LockableButton = createLockedEntity(LockableButton);
export default LockableButton;
