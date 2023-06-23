import { TextInput, useMantineTheme } from "@mantine/core";
import { projectNameAtom } from "@src/hooks/useFlowChartState";
import { useAtom } from "jotai";
import { ChangeEvent } from "react";

export const ProjectName = () => {
  const [projectName, setProjectName] = useAtom(projectNameAtom);
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setProjectName(e.target.value);
  };
  const theme = useMantineTheme();

  return (
    <TextInput
      value={projectName}
      onChange={handleChange}
      placeholder="Untitled Project"
      variant="unstyled"
      sx={{
        fontFamily: "Open Sans",
        fontWeight: 700,
        padding: "0px 10px",
        border: "1px solid",
        borderColor: theme.colors.gray[9],
        borderRadius: 16,
      }}
    />
  );
};
