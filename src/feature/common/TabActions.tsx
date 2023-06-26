import { Header as MantineHeader } from "@mantine/core";
import { memo } from "react";

type TabActionsProps = {
  children: React.ReactNode;
  gap?: number;
};

const TabActions = ({ children, gap = 0 }: TabActionsProps) => {
  return (
    <MantineHeader
      height={50}
      display="flex"
      sx={{ alignItems: "center", gap }}
    >
      {children}
    </MantineHeader>
  );
};

export default memo(TabActions);
