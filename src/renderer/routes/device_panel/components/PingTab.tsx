import { ScrollArea } from "@radix-ui/react-scroll-area";
import { Button } from "@src/components/ui/button";
import { Input } from "@src/components/ui/input";
import { Label } from "@src/components/ui/label";
import { parseElectronError } from "@src/utils/parse-error";
import { useState } from "react";

type PingResult = "success" | "failed";

export const PingTab = () => {
  const [addr, setAddr] = useState("");
  const [output, setOutput] = useState<string | undefined>(undefined);
  const [status, setStatus] = useState<PingResult | undefined>(undefined);

  const ping = async () => {
    try {
      const out = await window.api.ping(addr);
      setStatus("success");
      setOutput(out);
    } catch (e) {
      const errMsg = parseElectronError(String(e));
      setStatus("failed");
      setOutput(errMsg);
    }
  };

  const statusStr =
    status === "success"
      ? "✅ IP Address is responsive"
      : status === "failed"
      ? "❌ IP address could not be reached"
      : "";

  return (
    <div>
      <div className="flex items-end gap-4">
        <div>
          <Label htmlFor="ipAddr">IP Address</Label>
          <Input
            id="ipAddr"
            onChange={(e) => setAddr(e.target.value)}
            value={addr}
          />
        </div>
        <Button onClick={ping}>Ping</Button>
      </div>
      <div>{statusStr}</div>
      <div className="py-2" />
      {output && (
        <ScrollArea className="h-80 bg-muted">
          <div>{output}</div>
        </ScrollArea>
      )}
    </div>
  );
};
