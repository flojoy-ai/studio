import { Pencil, X } from "lucide-react";
import { MenuInfo } from "@/renderer/types/context-menu";
import { ContextMenuAction } from "@/renderer/components/common/context-menu-action";
import { useProjectStore } from "@/renderer/stores/project";
import { WidgetData } from "@/renderer/types/control";

export type WidgetContextMenuInfo = MenuInfo<WidgetData>;

type Props = WidgetContextMenuInfo & {
  onClick?: () => void;
  openWidgetEdit?: () => void;
};

export default function WidgetContextMenu({
  node,
  top,
  left,
  right,
  bottom,
  onClick,
  openWidgetEdit,
}: Props) {
  const { deleteWidget } = useProjectStore((state) => ({
    deleteWidget: state.deleteControlWidget,
  }));

  return (
    <div
      style={{ top, left, right, bottom }}
      className="absolute z-50 rounded-md border bg-background"
      onClick={onClick}
      data-testid={"widget-context-menu"}
    >
      {openWidgetEdit && (
        <ContextMenuAction
          testId="context-edit-widget"
          onClick={openWidgetEdit}
          icon={Pencil}
        >
          Edit Widget
        </ContextMenuAction>
      )}
      <hr />
      <ContextMenuAction
        testId="context-delete-widget"
        onClick={() => deleteWidget(node.id)}
        icon={X}
      >
        Delete Widget
      </ContextMenuAction>
    </div>
  );
}
