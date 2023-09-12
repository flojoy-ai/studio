import { Play } from "lucide-react";
import { Button } from "@src/components/ui/button";
import { useState } from "react";
import { API_URI } from "@src/data/constants";

const UploadButton = () => {
  const [, setPorts] = useState([]);

  const handleClick = () => {
    async function fetchPorts() {
      try {
        const response = await fetch(`${API_URI}/serial-ports`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        return await response.json();
      } catch (err) {
        console.error(err);
      }
    }

    let availablePorts = [];
    fetchPorts().then((ports) => {
      availablePorts = ports;
    });
    console.log("Available ports:", availablePorts);
    setPorts(availablePorts);
  };

  return (
    <div className="flex items-center">
      <Button
        data-cy="btn-play"
        size="sm"
        variant="default"
        id="btn-play"
        className="gap-2"
        onClick={handleClick}
      >
        <Play size={18} />
        <span className="ml-2">Upload</span>
      </Button>
    </div>
  );
};

export default UploadButton;
