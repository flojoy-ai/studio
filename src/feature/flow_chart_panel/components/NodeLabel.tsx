import { Text } from "@mantine/core";

type NodeLabelProps = {
  label: string;
};

export const NodeLabel = ({ label }: NodeLabelProps) => {
  return (
    <Text
      weight={600}
      size="xl"
      ta="center"
      sx={{ letterSpacing: 1, fontFamily: "Open Sans" }}
    >
      {label}
    </Text>
  );
};
