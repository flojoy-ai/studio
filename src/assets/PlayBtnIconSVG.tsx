import { MantineTheme } from "@mantine/core";
import { useMantineTheme } from "@mantine/styles";

type PlayTimeIconProps = {
  color: string;
};

const PlayBtnIcon = ({ color }: PlayTimeIconProps) => {
  const theme = useMantineTheme();
  return (
    <div>
      <svg
        width="9"
        height="11"
        viewBox="0 0 9 11"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ marginBottom: 2 }}
      >
        <path
          d="M8.5 4.63397C9.16667 5.01887 9.16667 5.98113 8.5 6.36603L1.75 10.2631C1.08333 10.648 0.25 10.1669 0.25 9.39711L0.25 1.60289C0.25 0.833085 1.08333 0.35196 1.75 0.73686L8.5 4.63397Z"
          fill={color}
          // theme.colorScheme === "light"
          //   ? theme.colors.accent2[0]
          //   : theme.colors.accent1[0]
        />
      </svg>
    </div>
  );
};

export default PlayBtnIcon;
