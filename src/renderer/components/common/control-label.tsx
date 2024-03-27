import NodeInput from "@/renderer/components/common/NodeInput";
import { useProjectStore } from "@/renderer/stores/project";
import { Result } from "neverthrow";
import { useState } from "react";

type Props = {
  id: string;
  label?: string;
  placeholder: string;
  updateLabel: (id: string, newLabel: string) => Result<void, Error>;
};

const ControlLabel = ({ id, label, placeholder, updateLabel }: Props) => {
  const [isRenamingTitle, setIsRenamingTitle] = useState(false);

  return (
    <div onDoubleClick={() => setIsRenamingTitle(true)}>
      {isRenamingTitle ? (
        <NodeInput
          title={label ?? ""}
          id={id}
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

type WidgetLabelProps = Omit<Props, "updateLabel">;

export const WidgetLabel = (props: WidgetLabelProps) => {
  const updateLabel = useProjectStore(
    (state) => state.updateControlWidgetLabel,
  );

  return <ControlLabel {...props} updateLabel={updateLabel} />;
};

type VisualizationLabelProps = Omit<Props, "updateLabel">;

export const VisualizationLabel = (props: VisualizationLabelProps) => {
  const updateLabel = useProjectStore(
    (state) => state.updateControlVisualizationLabel,
  );

  return <ControlLabel {...props} updateLabel={updateLabel} />;
};
