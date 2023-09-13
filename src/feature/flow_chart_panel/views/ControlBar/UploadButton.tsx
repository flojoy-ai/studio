import { Play } from "lucide-react";
import { Button } from "@src/components/ui/button";
import { useState } from "react";
import { API_URI } from "@src/data/constants";

const UploadButton = () => {
  const [, setPorts] = useState([]);

  const handleClick = () => {
    async function fetchPorts() {
      try {
        const response = await fetch(`${API_URI}/serial_ports`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        
        const resp = await response.json();
        return resp.ports;
      } catch (err) {
        console.error(err);
      }
    }

    fetchPorts().then((data) => {
      console.log("Available ports:", data);
      setPorts(data);
    });
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
