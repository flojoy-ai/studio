import { createStyles } from "@mantine/core";
import { Modal } from "@mantine/core";
import { useFlowChartState } from "@hooks/useFlowChartState";
import { memo, useEffect, useState } from "react";
import { AppGalleryLayout } from "@feature/flow_chart_panel/views/AppGalleryLayout";
import { AppGallerySearch } from "@feature/flow_chart_panel/views/AppGallerySearch";
import { Select } from "@/components/ui/select";
import { listBox } from "@feature/flow_chart_panel/views/AppGallerySearch";
import { Simulate } from "react-dom/test-utils";
import error = Simulate.error;

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
    position: "sticky",
    marginTop: 6,
    marginRight: 8,
  },
  header: {
    position: "sticky",
    display: "relative",
    paddingTop: 10,
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
    width: "95.2%",
    bottom: 0,
    marginLeft: "2%",
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

const subjectKeyList = ["fundamentals", "AI", "IO", "DSP"];
const ignoreDir = [".github", "MANIFEST"];
export const AppGalleryModal = () => {
  const { classes } = useStyles();
  const { isGalleryOpen, setIsGalleryOpen } = useFlowChartState();
  const [selectFields, setSelect] = useState([]);
  const [data, setData] = useState<object[]>([]);

  const onClose = () => {
    setIsGalleryOpen(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(
        "https://api.github.com/repos/flojoy-ai/nodes/contents/?ref=main"
      );
      const raw = await response.json();
      const filtered = raw.filter(
        (obj) => obj["type"] === "dir" && !ignoreDir.includes(obj["name"])
      );
      setSelect(
        filtered.map((obj) => (
          <option key={obj.sha} value={obj.url}>
            {obj.name}
          </option>
        ))
      );
    };
    fetchData().catch(console.error);
  }, []);

  const populateHeading = async (selectUrl: string) => {
    const response = await fetch(selectUrl);
    const raw = await response.json();
    // const box: listBox[] = raw.map(async (obj) => {
    //   const objResponse = await fetch(obj.url);
    //   const rawData = await objResponse.json();
    //   return {
    //     name: obj.name,
    //     displayField: "name",
    //     data: rawData,
    //     id: obj.name.toLowerCase(),
    //     ratio: 5,
    //     searchType: "startswith",
    //   };
    // });
    setData(raw);
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
            <AppGallerySearch items={data} />
            <select
              onChange={(e) => {
                console.log(`the targe value is: ${e.target.value}`);
                populateHeading(e.target.value).catch(error);
              }}
              className="w-30 z-10 mt-1 h-10 justify-center rounded"
              defaultValue="https://api.github.com/repos/flojoy-ai/nodes/contents/AI_ML?ref=main"
            >
              {selectFields}
            </select>
            <hr className={classes.hr} />
          </Modal.Header>
          <Modal.Body>
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
