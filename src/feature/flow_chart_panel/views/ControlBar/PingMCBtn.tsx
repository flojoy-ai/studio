import { Button } from "@src/components/ui/button";
import { API_URI } from "@src/data/constants";
import { useSettings } from "@src/hooks/useSettings";
import { MCRequirements } from "./types/MCStatus";
import { useMCStatusCodes } from "@src/hooks/useMCStatusCodes";
import { toast } from "sonner";
// button to ping the microcontroller via http request
//define type for setIsLoadingPing
interface PingMCBtnProps {
  setIsLoadingPing: (isLoading: boolean) => void;
}
const PingMCBtn = ({ setIsLoadingPing }: PingMCBtnProps) => {
  const { settings } = useSettings("micropython");
  const selectedPort = settings.find(
    (setting) => setting.key === "selectedPort",
  )?.value;
  const { statusCodes } = useMCStatusCodes();
  async function onClick(selectedPort) {
    // ping the microcontroller via http request
    setIsLoadingPing(true);
    const response = await fetch(`${API_URI}/mc_has_requirements`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        port: selectedPort,
      }),
    });
    const mc_status: MCRequirements = (await response.json()) as MCRequirements;
    // display the response in the console
    toast.message(
      `${mc_status.code == 0 ? "✅" : "❌"} Microcontroller status: ${
        statusCodes[mc_status.code]
      }`,
      {
        description: mc_status.msg,
      },
    );
    console.log(statusCodes[mc_status.code]);
    console.log(mc_status);
    setIsLoadingPing(false);
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
  );
};

export default PingMCBtn;
