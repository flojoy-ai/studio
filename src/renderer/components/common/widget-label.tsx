import NodeInput from "@/renderer/components/common/NodeInput";
import { useProjectStore } from "@/renderer/stores/project";
import { useState } from "react";

type Props = {
  widgetId: string;
  label?: string;
  placeholder: string;
};

const WidgetLabel = ({ widgetId, label, placeholder }: Props) => {
  const [isRenamingTitle, setIsRenamingTitle] = useState(false);
  const updateLabel = useProjectStore(
    (state) => state.updateControlWidgetLabel,
  );

  return (
    <div onDoubleClick={() => setIsRenamingTitle(true)}>
      {isRenamingTitle ? (
        <NodeInput
          title={label ?? ""}
          id={widgetId}
          setIsRenamingTitle={setIsRenamingTitle}
          updateLabel={updateLabel}
        />
      ) : (
        <div className="text-muted-foreground">
          {label ? label : placeholder}
        </div>
      )}
    </div>
  );
};

export default WidgetLabel;
