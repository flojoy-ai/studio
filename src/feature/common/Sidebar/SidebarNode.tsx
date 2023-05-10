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

import { useMantineTheme, createStyles } from "@mantine/core";

export const useSidebarStyles = createStyles((theme) => ({
  control: {
    fontWeight: 500,
    display: "block",
    width: "90%",
    padding: `${theme.spacing.xs}px ${theme.spacing.md}px`,
    color: "black",
    fontSize: theme.fontSizes.sm,
    margin: "10px 20px 10px 20px",
    backgroundColor: theme.colors.accent1[0],
  },

  button: {
    outline: "0",
    border: `1px solid ${theme.colors.accent1[0]}`,
    backgroundColor: theme.colors.accent1[0],
    color: theme.colors.accent1[0],
    padding: "8px 12px 8px 12px",
    cursor: "pointer",
    margin: "5px 5px",
  },
}));

const SidebarNode = ({ onClickHandle, keyNode, manifestMap, depth }) => {
  const { classes } = useSidebarStyles();
  const theme = useMantineTheme();
  let cmd = manifestMap[keyNode as keyof Object]; //get corresponding command from key
  if (!cmd) return null;
  return (
    <button
      className={classes.button}
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
