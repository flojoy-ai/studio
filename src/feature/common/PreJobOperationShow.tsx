import { Modal } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { useFlowChartState } from "@src/hooks/useFlowChartState";
import { useEffect, useRef } from "react";
type PreJobOperationShowProps = {
  opened: boolean;
  outputs: string[];
  close: () => void;
};

const PreJobOperationShow = ({
  outputs,
  opened,
  close,
}: PreJobOperationShowProps) => {
  const isMobile = useMediaQuery("(max-width: 50em)");
  const { uiTheme } = useFlowChartState();
  const lastElem = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (lastElem.current && lastElem.current.scrollIntoView) {
      lastElem.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [lastElem.current]);

  return (
    <Modal
      opened={opened}
      onClose={close}
      title="Pre job operation"
      overlayProps={{
        color: uiTheme === "dark" ? "#101113" : "#e9ecef",
        opacity: 0.55,
        blur: 3,
      }}
      fullScreen={isMobile}
      size={"70%"}
    >
      {outputs.map((output, i) => (
        <div
          key={`${output}-${i}`}
          ref={i === outputs.length - 1 ? lastElem : null}
          style={{
            background: "#000",
            color: output.toLowerCase().includes("error") ? "red" : "#fff",
            padding: "10px",
            fontFamily: "monospace",
            whiteSpace: "break-spaces",
            overflow: "hidden",
          }}
        >
          {output}
        </div>
      ))}
    </Modal>
  );
};

export default PreJobOperationShow;
