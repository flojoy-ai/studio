import { Button, createStyles, useMantineTheme } from "@mantine/core";
import React, { useRef } from "react";
import "@src/feature/flow_chart_panel/components/play-btn/play-btn.css";
import PlayBtnIconSVG from "@src/assets/PlayBtnIconSVG";
import useKeyboardShortcut from "@src/hooks/useKeyboardShortcut";
import { useFlowChartGraph } from "@src/hooks/useFlowChartGraph";
import { Node, Edge } from "reactflow";
import { ElementsData } from "flojoy/types";

interface PlayBtnProps {
  onPlay: (nodes: Node<ElementsData>[], edges: Edge[]) => void;
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
        backgroundColor:
          theme.colorScheme === "light" ? "#e9ecef" : theme.colors.accent5[0],
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

const PlayBtn = ({ onPlay, style, disabled = false }: PlayBtnProps) => {
  const theme = useMantineTheme();
  const { classes } = useStyles();
  const { nodes, edges } = useFlowChartGraph();

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
    if (onPlay) {
      onPlay(nodes, edges);
    }
  };

  useKeyboardShortcut("ctrl", "p", () => onPlay(nodes, edges));
  useKeyboardShortcut("meta", "p", () => onPlay(nodes, edges));

  return (
    <Button
      className={classes.btnPlay}
      ref={ButtonElem}
      style={style}
      onClick={handleClick}
      id="btn-play"
      data-cy="btn-play"
      data-testid="btn-play"
      disabled={disabled}
      title={disabled ? "Server is offline" : "Run Script"}
    >
      <div style={{ marginTop: 3.5 }}>
        <PlayBtnIconSVG
          color={
            disabled
              ? theme.colors.dark[0]
              : theme.colorScheme === "light"
              ? theme.colors.accent2[0]
              : theme.colors.accent1[0]
          }
        />
      </div>

      <div style={{ padding: "4px" }} />
      <span>Play</span>
    </Button>
  );
};

export default PlayBtn;
