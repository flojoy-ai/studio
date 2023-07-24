import { createStyles } from "@mantine/core";
import { Modal } from "@mantine/core";
import { useFlowChartState } from "@hooks/useFlowChartState";
import { memo } from "react";
import { AppGalleryLayout } from "@feature/flow_chart_panel/views/AppGalleryLayout";
import { AppGallerySearch } from "@feature/flow_chart_panel/views/AppGallerySearch";

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
    position: "sticky",
    display: "relative",
    paddingTop: 0,
  },
  title: {
    display: "relative",
    font: "Inter",
    fontSize: 35,
    paddingLeft: 20,
    width: "60%",
  },
  hr: {
    position: "absolute",
    margin: 0,
    width: "90%",
    bottom: 0,
    marginLeft: "2%",
    marginRight: "5%",
  },
  categoryElement: {
    display: "flex",
    paddingLeft: "2%",
    marginBottom: "10%",
    marginRight: "2%",
  },
  subjectTitle: {
    paddingLeft: "2%",
  },
}));

export const AppGalleryModal = () => {
  const { classes } = useStyles();
  const { isGalleryOpen, setIsGalleryOpen } = useFlowChartState();
  const subjectKeyList = ["fundamentals", "AI", "IO", "DSP"];

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
            <hr className={classes.hr} />
          </Modal.Header>
          <Modal.Body>
            <AppGallerySearch />
            {subjectKeyList.map((sub, key) => {
              return (
                <AppGalleryLayout subjectKey={sub} key={key} topKey={key} />
              );
            })}
          </Modal.Body>
        </Modal.Content>
      </Modal.Body>
    </Modal.Root>
  );
};
