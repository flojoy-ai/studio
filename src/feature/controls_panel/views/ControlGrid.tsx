import "react-grid-layout/css/styles.css";
import { Responsive, WidthProvider } from "react-grid-layout";
import { useFlowChartState } from "../../../hooks/useFlowChartState";
import "../style/Controls.css";
import "../../../App.css";
import ControlComponent from "./controlComponent";
import { useEffect } from "react";
import { ControlProps } from "../types/ControlProps";

const ResponsiveGridLayout = WidthProvider(Responsive);

export default function ControlGrid({
  controlProps,
}: {
  controlProps: ControlProps;
}) {
  const { ctrlsManifest, gridLayout, setGridLayout } = useFlowChartState();
  const { isEditMode } = controlProps;

  useEffect(() => {
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
      onLayoutChange={(currentLayout, allLayout) => {
        console.log("currentLayout:", currentLayout);
        setGridLayout(currentLayout);
      }}
    >
      {ctrlsManifest.map((ctrl, i) => {
        if (ctrl.hidden && !isEditMode) {
          return (
            <div
              key={ctrl.id}
              data-grid={{
                ...gridLayout.find((l) => l.i === ctrl.id),
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
              ...gridLayout.find((l) => l.i === ctrl.id),
              static: !isEditMode,
            }}
            style={{
              ...(controlProps.theme === "dark" && {
                backgroundColor: "#191919",
              }),
              borderRadius: "16px",
            }}
          >
            <Control
              key={ctrl.id}
              controlProps={controlProps}
              ctrl={ctrl}
              ctrlIndex={i}
            />
          </div>
        );
      })}
    </ResponsiveGridLayout>
  );
}

function Control({
  controlProps,
  ctrl,
}: {
  controlProps: ControlProps;
  ctrl: any;
  ctrlIndex: number;
}) {
  const {
    isEditMode,
    theme,
    results,
    updateCtrlValue,
    attachParamsToCtrl,
    removeCtrl,
    setCurrentInput,
    setOpenEditModal,
  } = controlProps;

  return (
    <div
      className={isEditMode ? "ctrl-input" : ""}
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        borderRadius: "16px",
        backgroundColor: theme === "dark" ? "#14131361" : "#58454517",
      }}
    >
      {isEditMode ? (
        <ControlComponent
          ctrlObj={ctrl}
          theme={theme}
          results={results}
          updateCtrlValue={updateCtrlValue}
          attachParamsToCtrl={attachParamsToCtrl}
          removeCtrl={removeCtrl}
          setCurrentInput={setCurrentInput}
          setOpenEditModal={setOpenEditModal}
        />
      ) : ctrl.hidden ? null : (
        <ControlComponent
          ctrlObj={ctrl}
          theme={theme}
          results={results}
          updateCtrlValue={updateCtrlValue}
          attachParamsToCtrl={attachParamsToCtrl}
          removeCtrl={removeCtrl}
          setCurrentInput={setCurrentInput}
          setOpenEditModal={setOpenEditModal}
        />
      )}
    </div>
  );
}
