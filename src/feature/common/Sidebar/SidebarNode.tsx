// {InputControlsManifest.map((ctrl, ctrlIndex) => (
//     <Fragment key={ctrlIndex}>
//       <button
//         className={`cmd-btn ${theme}`}
//         onClick={() =>
//           addCtrl({
//             type: ctrl.type,
//             name: ctrl.name,
//             minWidth: ctrl.minWidth,
//             minHeight: ctrl.minHeight,
//           })
//         }
//       >
//         {ctrl.name}
//       </button>
//     </Fragment>
//   ))}

import { useMantineTheme } from "@mantine/core";
import { useSidebarStyles } from "@src/styles/useSidebarStyles";

const SidebarNode = ({ onClickHandle, keyNode, manifestMap, depth }) => {
  const { classes } = useSidebarStyles();
  const theme = useMantineTheme();
  let cmd = manifestMap[keyNode as keyof Object]; //get corresponding command from key
  if (!cmd) return null
  return (
      <button
        className={
          theme.colorScheme === "dark"
            ? classes.buttonDark
            : classes.buttonLight
        }
        onClick={() => {
          onClickHandle();
          // onClickHandle({
          //   funcName: cmd.key,
          //   type: cmd.type,
          //   params: FUNCTION_PARAMETERS[cmd.key],
          //   inputs: cmd.inputs,
          //   ...(cmd.ui_component_id && {
          //     uiComponentId: cmd.ui_component_id,
          //   }),
          // });
        }}
      >
        {cmd.name}
      </button>
  );
};

export default SidebarNode;
