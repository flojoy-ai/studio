import { createStyles, Input } from "@mantine/core";
import { Modal } from "@mantine/core";
import { useFlowChartState } from "@hooks/useFlowChartState";
import { useSettings } from "@hooks/useSettings";
import { memo } from "react";
import AppGalleryElement from "@feature/flow_chart_panel/views/AppGalleryElement";

const useStyles = createStyles((theme) => ({
  content: {
    marginTop: "120px",
    display: "relative",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: "8px",
    height: "65vh",
    boxShadow: "0px 0px 6px 0px #ffffff",
    width: "max(400px,936px)",
    inset: 0,
    padding: 0,
  },
  closeBtn: {
    marginTop: 6,
    marginRight: 8,
  },
  header: {
    paddingTop: 0,
  },
  title: {
    display: "relative",
    font: "Inter",
    fontSize: 35,
    paddingLeft: 20,
  },
  hr: {
    width: "93%",
  },
}));

export const AppGalleryModal = () => {
  const { classes } = useStyles();
  const { isGalleryOpen, setIsGalleryOpen } = useFlowChartState();

  const onClose = () => {
    setIsGalleryOpen(false);
  };

  return (
    <Modal.Root
      data-testid="app-gallery-modal"
      opened={isGalleryOpen}
      onClose={onClose}
      size={1030}
    >
      <Modal.Overlay />
      <Modal.Body>
        <Modal.Content className={classes.content}>
          <Modal.CloseButton className={classes.closeBtn} />
          <Modal.Header className={classes.header}>
            <Modal.Title className={classes.title}>App Gallery</Modal.Title>
          </Modal.Header>
          <hr className={classes.hr} />
          <Modal.Body>
            <h3>Fundamentals</h3>
            <AppGalleryElement />
          </Modal.Body>
        </Modal.Content>
      </Modal.Body>
    </Modal.Root>
  );
};

export default memo(AppGalleryModal);
