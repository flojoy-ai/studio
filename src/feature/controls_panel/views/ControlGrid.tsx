import { useEffect } from "react";
import { Responsive, WidthProvider } from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "@src/App.css";
import { useFlowChartState } from "@src/hooks/useFlowChartState";
import "../style/Controls.css";
import { ControlProps } from "../types/ControlProps";
import Control from "./Control";
import { useMantineColorScheme } from "@mantine/styles";

const ResponsiveGridLayout = WidthProvider(Responsive);

export default function ControlGrid({
  controlProps,
}: {
  controlProps: ControlProps;
}) {
  const theme = useMantineColorScheme().colorScheme;
  const { ctrlsManifest, gridLayout, setGridLayout } = useFlowChartState();
  const { isEditMode } = controlProps;

  useEffect(() => {
    console.log("7");
    if (isEditMode) {
      setGridLayout((prev) =>
        prev.map((layout) => ({ ...layout, static: false }))
      );
    } else {
      setGridLayout((prev) =>
        prev.map((layout) => ({ ...layout, static: true }))
      );
    }
  }, [isEditMode, setGridLayout]);

  return (
    <ResponsiveGridLayout
      className="layout"
      layouts={{ lg: gridLayout, md: gridLayout, sm: gridLayout }}
      cols={{ lg: 8, md: 8, sm: 6, xs: 4, xxs: 2 }}
      onLayoutChange={(currentLayout) => {
        setGridLayout(currentLayout);
      }}
    >
      {ctrlsManifest.map((ctrl) => {
        if (ctrl.hidden && !isEditMode) {
          return (
            <div
              key={ctrl.id}
              data-grid={{
                ...ctrl.layout,
              }}
              style={{
                display: "none",
              }}
            />
          );
        }

        return (
          <div
            key={ctrl.id}
            data-grid={{
              ...ctrl.layout,
              static: !isEditMode,
            }}
            style={{
              ...(theme === "dark" && {
                backgroundColor: "#191919",
              }),
              borderRadius: "16px",
            }}
          >
            <Control key={ctrl.id} controlProps={controlProps} ctrl={ctrl} />
          </div>
        );
      })}
    </ResponsiveGridLayout>
  );
}
