import { Button } from "@src/components/ui/button";
import { API_URI } from "@src/data/constants";
import LoadingCircle from "@src/feature/flow_chart_panel/components/LoadingCircle/LoadingCircle";
import { useState } from "react";

export const RP2Setup = () => {
  //   const [path, setPath] = useState("");
  const [path, setPath] = useState("");
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState("");

  const handleChange = () => {
    // setPath(value as string);
    window.api.openDirectory().then((result) => {
      if (result.canceled) {
        setPath("");
        return;
      }
      setPath(result.filePaths[0]);
    });
  };

  async function handleUpload() {
    //send api post request to backend containing the target path
    setLoading(true);
    const resp = await fetch(`${API_URI}/mc_firmware_upload`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ destination: path }),
    });
    if (resp.status != 200) {
      setStatusMsg("❌ Error uploading firmware: " + resp.statusText);
    } else {
      setStatusMsg("✅ Firmware uploaded successfully!");
    }
    setLoading(false);
  }
  //   console.log(path)
  return (
    <>
      <p>
        Step 1: Please plug the RP2 board into your computer while holding the
        BOOTSEL button on the microcontroller. <br />
        <br />
        Step 2: Navigate to the RP2 board (usually listed as a seperate drive).
        <br />
      </p>
      <Button onClick={handleChange}>Select Directory</Button>
      <p style={{ fontSize: 13 }}>
        <i>
          Selected Path: <b>{path}</b>
        </i>
      </p>
      <div>
        <Button disabled={path == ""} onClick={handleUpload}>
          Upload
        </Button>
      </div>
      {loading && <LoadingCircle />}
      {!loading && statusMsg && <p>{statusMsg}</p>}
    </>
  );
};
