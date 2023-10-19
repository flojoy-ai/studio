import { Button } from "@src/components/ui/button"
import { API_URI } from "@src/data/constants"
import { useSettings } from "@src/hooks/useSettings"

// button to ping the microcontroller via http request
const PingMCBtn = () => {
    const {settings} = useSettings("micropython")
    const selectedPort = settings.find((setting) => setting.key === "selectedPort")?.value

    async function onClick(selectedPort) {
        // ping the microcontroller via http request
        // if the microcontroller is not connected, show a toast
        // if the microcontroller is connected, show a toast
        const response = await fetch(`${API_URI}/mc_has_requirements`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            port: selectedPort,
          }),
        });
        console.log(await response.json())
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