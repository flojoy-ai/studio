import { createLockedEntity } from "../../utils/CreateLockedEntity";
import { Button } from "@/renderer/components/ui/button";

const LockableButton = createLockedEntity(Button);
export default LockableButton;
