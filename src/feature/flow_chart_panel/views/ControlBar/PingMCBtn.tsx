import { Button } from "@src/components/ui/button"
import { API_URI } from "@src/data/constants"
import { useSettings } from "@src/hooks/useSettings"
import { MCRequirements } from "./types/MCStatus"
import { useMCStatusCodes } from "@src/hooks/useMCStatusCodes"
// button to ping the microcontroller via http request
const PingMCBtn = () => {
    const {settings} = useSettings("micropython")
    const selectedPort = settings.find((setting) => setting.key === "selectedPort")?.value
    const {statusCodes} = useMCStatusCodes();

    async function onClick(selectedPort) {
        // ping the microcontroller via http request
        const response = await fetch(`${API_URI}/mc_has_requirements`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            port: selectedPort,
          }),
        });
        const mc_status : MCRequirements = (await response.json()) as MCRequirements;
        // display the response in the console
        console.log(statusCodes[mc_status.code]);
        
    }

    return (
        <Button
          data-testid="btn-ping-mc"
          data-cy="btn-ping-mc"
          size="sm"
          id="btn-ping-mc"
          className="gap-2"
          variant="ghost"
          onClick={() => onClick(selectedPort)}
        >
          Ping
        </Button>
    )
}

export default PingMCBtn