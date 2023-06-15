import { Header as MantineHeader } from "@mantine/core";

type TabActionsProps = {
  children: React.ReactNode;
  gap?: number;
};

export const TabActions = ({ children, gap = 0 }: TabActionsProps) => {
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
