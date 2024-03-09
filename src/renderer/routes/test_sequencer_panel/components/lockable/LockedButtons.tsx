import { createLockedEntity } from "@/renderer/routes/test_sequencer_panel/utils/CreateLockedEntity";
import { Button } from "@/renderer/components/ui/button";

const LockableButton = createLockedEntity(Button);
export default LockableButton;
