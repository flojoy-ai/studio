import { Modal, useMantineTheme } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
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
  const theme = useMantineTheme();
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
        color:
          theme.colorScheme === "dark"
            ? theme.colors.dark[9]
            : theme.colors.gray[2],
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
            background: theme.colors.dark[9],
            color: output.toLowerCase().includes("error")
              ? theme.colors.red[8]
              : theme.colors.gray[0],
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
