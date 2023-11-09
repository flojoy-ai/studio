import { useEffect, useState } from "react";

const useElectronLogs = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState<string | undefined>();
  const [outputs, setOutputs] = useState<string[]>([]);

  useEffect(() => {
    // Subscribe to electron logs
    window.api?.subscribeToElectronLogs((data) => {
      if (typeof data === "string") {
        setOpenDialog(true);
        setOutputs((p) => [...p, data]);
        return;
      }
      if (typeof data === "object" && data !== null) {
        setOpenDialog(data.open);
        if (data.title) {
          setTitle(data.title);
        }
        if (data.description) {
          setDescription(data.description);
        }
        if (data.clear) {
          setOutputs([]);
        } else {
          setOutputs((p) => [...p, data.output]);
        }
      }
    });
  }, []);
  return {
    title,
    description,
    outputs,
    openDialog,
    setOpenDialog,
  };
};
export default useElectronLogs;
