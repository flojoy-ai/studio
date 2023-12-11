import { ScrollArea, ScrollBar } from "@src/components/ui/scroll-area";
import { Spinner } from "@src/components/ui/spinner";
import { useEffect, useState } from "react";

type ShellCommandOutputProps = {
  command: () => Promise<string>;
};

export const ShellCommandOutput = ({ command }: ShellCommandOutputProps) => {
  const [output, setOutput] = useState<string | undefined>(undefined);

  useEffect(() => {
    command().then(setOutput);
  }, [command]);

  return (
    <div className="w-full">
      {output ? (
        <ScrollArea className="h-96 w-full bg-popover p-2">
          <code className="whitespace-pre">{output}</code>
          <ScrollBar />
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      ) : (
        <div className="flex h-96 w-full items-center justify-center">
          <Spinner />
        </div>
      )}
    </div>
  );
};
