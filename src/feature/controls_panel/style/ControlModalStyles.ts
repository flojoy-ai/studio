import { MantineTheme } from "@mantine/styles";

export const modalStyles = (theme: MantineTheme): ReactModal.Styles => {
  return {
    overlay: { zIndex: 99, backgroundColor: theme.colors.modal + "af" },
    content: {
      border: "1px solid rgba(41, 41, 41, 1)",
      backgroundColor: theme.colors.modal[0],
      borderRadius: "8px",
      zIndex: 100,
      top: "50%",
      left: "50%",
      transform: "translate(-50%,-50%)",
    },
  };
};
