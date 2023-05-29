import { Button, createStyles, useMantineTheme } from "@mantine/core";
import React, { useRef } from "react";
import "@src/feature/flow_chart_panel/components/play-btn/play-btn.css";

interface PlayBtnProps {
  onClick?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  style?: React.CSSProperties;
  disabled?: boolean;
}

const useStyles = createStyles((theme) => {
  const accent =
    theme.colorScheme === "dark" ? theme.colors.accent1 : theme.colors.accent2;
  return {
    btnPlay: {
      width: 64,
      height: 32,
      fontSize: 12,
      fontWeight: 700,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      gap: 6,
      flexWrap: "wrap",
      outline: 0,
      cursor: "pointer",
      position: "relative",
      transition: "transform ease-in 0.1s, box-shadow ease-in 0.25s",
      WebkitAppearance: "none",
      appearance: "none",
      backgroundColor: theme.colors.accent4[1],
      color: accent[0],
      border: `1px solid ${accent[0]}`,
      borderRadius: 6,
      "&:hover": {
        backgroundColor: accent[1] + "36",
      },
      "&:disabled, &:disabled:hover": {
        color: "#b5b5b5",
        backgroundColor: "#e9ecef",
        border: 0,
        cursor: "not-allowed",
      },
      "&:disabled > svg > path": {
        fill: "#b5b5b5",
      },
      "&:focus": {
        outline: 0,
      },
    },
  };
});

const PlayBtn = ({ onClick, style, disabled = false }: PlayBtnProps) => {
  const theme = useMantineTheme();
  const { classes } = useStyles();

  const ButtonElem = useRef<HTMLButtonElement>(null);
  const handleClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    if (ButtonElem.current) {
      ButtonElem.current.classList.add("animate");
      //reset animation
      setTimeout(() => {
        ButtonElem.current?.classList.remove("animate");
      }, 1000);
    }
    if (onClick) {
      onClick(e);
    }
  };

  return (
    <Button
      className={classes.btnPlay}
      ref={ButtonElem}
      style={style}
      onClick={handleClick}
      data-cy="btn-play"
      data-testid="btn-play"
      disabled={disabled}
      title={disabled ? "Server is offline" : "Run Script"}
    >
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
          fill={
            theme.colorScheme === "light"
              ? theme.colors.accent2[0]
              : theme.colors.accent1[0]
          }
        />
      </svg>
      <div style={{ padding: "4px" }} />
      <span>Play</span>
    </Button>
  );
};

export default PlayBtn;
