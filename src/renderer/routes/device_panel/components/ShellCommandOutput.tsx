import { ScrollArea, ScrollBar } from "@src/components/ui/scroll-area";
import { useEffect, useState } from "react"

type ShellCommandOutputProps = {
  command: () => Promise<string>,
}

export const ShellCommandOutput = ({ command }: ShellCommandOutputProps) => {
  const [output, setOutput] = useState<string | undefined>(undefined)

  useEffect(() => {
    command().then(setOutput);
  }, [command])

  console.log(output);

  return (
    <div className="w-full">
      <ScrollArea className="h-96 p-2 bg-popover w-full">
        <code className="whitespace-pre">
          {output}
        </code>
        <ScrollBar />
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  )
}
