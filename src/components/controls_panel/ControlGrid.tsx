import "react-grid-layout/css/styles.css";
import { Responsive, WidthProvider } from "react-grid-layout";
import { useFlowChartState } from "../../hooks/useFlowChartState";
import "./Controls.css";
import "../../App.css";
import ControlComponent from "./controlComponent";
import { useEffect } from "react";

const ResponsiveGridLayout = WidthProvider(Responsive);

// const atomLayouts = atomWithImmer<Layout[] | undefined>(undefined);

export interface ControlProps {
  theme: any;
  isEditMode: any;
  results: any;
  updateCtrlValue: any;
  attachParam2Ctrl: any;
  rmCtrl: any;
  setCurrentInput: any;
  setOPenEditModal: any;
}

export default function ControlGrid({
  controlProps,
}: {
  controlProps: ControlProps;
}) {
  // const [layout, setLayoutI] = useAtom(atomLayouts);
  const { ctrlsManifest, gridLayout, setGridLayout } = useFlowChartState();
  const { isEditMode } = controlProps;

  // const setLayout = useCallback(
  //   (layouts: Layout[]) => {
  //     console.log("setting layouts to:", layouts);
  //     setLayoutI(layouts);
  //   },
  //   [setLayoutI]
  // );

  // if currently the layouts is undefined, place the controls automatically
  // useEffect(() => {
  //   if (!layout) {
  //     let x = 0;
  //     const ctrlLayouts = ctrlsManifest.map((ctrl, i) => {
  //       const w =  2;//ctrl.label === 'output' ? 40 : 20;
  //       const layoutParams: Layout = {
  //         i: ctrl.name + i,
  //         x,
  //         y: 0,
  //         w,
  //         h: 2,
  //         minH:ctrl.minHeight,
  //         minW:ctrl.minWidth,
  //         static: isEditMode,
  //       };
  //       // x += w;
  //       return layoutParams;
  //     });
  //     console.log('ctrlLayouts: ', ctrlLayouts)
  //     setLayout(ctrlLayouts);
  //   }
  // }, [ctrlsManifest, isEditMode, layout, setLayout]);

  // console.log("ctrlsManifest:", ctrlsManifest);
  // console.log("layouts:", gridLayout);
  useEffect(()=>{
    if(isEditMode){
      setGridLayout(prev=> prev.map(layout=> ({...layout, static:false})))
    } else {
      setGridLayout(prev=> prev.map(layout=> ({...layout, static:true})))
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[isEditMode])

  return (
    <ResponsiveGridLayout
      className="layout"
      layouts={{ lg: gridLayout, md: gridLayout, sm: gridLayout }}
      //   breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
      cols={{ lg: 8, md: 8, sm: 6, xs: 4, xxs: 2 }}
      // rowHeight={130}
      onLayoutChange={(currentLayout, allLayout) => {
        setGridLayout(currentLayout);
      }}
    >
      {ctrlsManifest.map((ctrl, i) => {
        if (ctrl.hidden && !isEditMode) {
          return (
            <div
              key={ctrl.id}
              data-grid={{
                ...gridLayout.find((l) => l.i === ctrl.id)
              }}
              style={{
                display: 'none'
              }}
              data-cy="ctrl-grid-item"
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
              borderRadius:'16px'
              // minHeight:ctrl.minHeight, minWidth:ctrl.minWidth
            }}
            data-cy="ctrl-grid-item"
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
  ctrlIndex,
}: {
  controlProps: ControlProps;
  ctrl;
  ctrlIndex: number;
}) {
  const {
    isEditMode,
    theme,
    results,
    updateCtrlValue,
    attachParam2Ctrl,
    rmCtrl,
    setCurrentInput,
    setOPenEditModal,
  } = controlProps;

  return (
    <div
      className={isEditMode ? "ctrl-input" : ""}
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        borderRadius:'16px',
       backgroundColor: theme === "dark" ? "#14131361" : '#58454517',
      }}
    >
      {isEditMode ? (
        <ControlComponent
          ctrlObj={ctrl}
          theme={theme}
          results={results}
          updateCtrlValue={updateCtrlValue}
          attachParam2Ctrl={attachParam2Ctrl}
          rmCtrl={rmCtrl}
          setCurrentInput={setCurrentInput}
          setOPenEditModal={setOPenEditModal}
        />
      ) : ctrl.hidden ? null : (
        <ControlComponent
          ctrlObj={ctrl}
          theme={theme}
          results={results}
          updateCtrlValue={updateCtrlValue}
          attachParam2Ctrl={attachParam2Ctrl}
          rmCtrl={rmCtrl}
          setCurrentInput={setCurrentInput}
          setOPenEditModal={setOPenEditModal}
        />
      )}
    </div>
  );
}
