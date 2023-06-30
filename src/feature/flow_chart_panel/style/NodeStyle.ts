import { useMantineTheme } from "@mantine/styles";
import { CustomNodeProps } from "../types/CustomNodeProps";

export const NodeStyle = (
  data: CustomNodeProps["data"]
): React.CSSProperties | undefined => {
  const theme = useMantineTheme();
  if (
    data.func === "LINSPACE" ||
    data.func === "LOOP" ||
    data.func === "CONDITIONAL" ||
    data.func === "BREAK" ||
    data.func === "TIMER" ||
    data.func === "BUTTER" ||
    data.func === "LOCAL_FILE"
  ) {
    const accent =
      theme.colorScheme === "light"
        ? theme.colors.accent2[0]
        : theme.colors.accent1[0];

    return {
      padding: 10,
      height: "105px",
      width: "190px",
      fontWeight: 600,
      borderRadius: "6px",
      backgroundColor: accent + "4f",
      border: accent,
      color: accent,
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      fontSize: "17px",
    };
  } else if (
    data.func === "SINE" ||
    data.func === "SQUARE" ||
    data.func === "SAW" ||
    data.func === "RAND" ||
    data.func === "CONSTANT" ||
    data.func === "OBJECT_DETECTION"
  ) {
    const accent =
      theme.colorScheme === "light"
        ? theme.colors.accent1[0]
        : theme.colors.accent2[0];
    return {
      height: "115px",
      width: "115px",
      borderRadius: "6px",
      border: accent,
      backgroundColor: accent + "4f",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      fontSize: "17px",
      color: accent,
    };
  } else {
    const accent =
      theme.colorScheme === "light"
        ? theme.colors.accent1[0]
        : theme.colors.accent2[0];
    return {
      display: "flex",
      alignItems: "center",
      fontSize: "17px",
      color: accent,
      background: "transparent",
    };
  }
};
