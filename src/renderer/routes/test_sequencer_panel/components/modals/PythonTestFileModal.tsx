import { flojoySyntaxTheme } from "@/renderer/assets/FlojoyTheme";
import { Dialog, DialogContent } from "@/renderer/components/ui/dialog";
import { ScrollArea, ScrollBar } from "@/renderer/components/ui/scroll-area";
import { Test } from "@/renderer/types/test-sequencer";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import python from "react-syntax-highlighter/dist/cjs/languages/hljs/python";
import { Light as SyntaxHighlighter } from "react-syntax-highlighter";

type Props = {
  isModalOpen: boolean;
  handleModalOpen: Dispatch<SetStateAction<boolean>>;
  test: Test;
};
SyntaxHighlighter.registerLanguage("python", python);

const PythonTestFileModal = ({ isModalOpen, handleModalOpen, test }: Props) => {
  const [sourceCode, setSourceCode] = useState("");
  const [target, setTarget] = useState<string>("");

  useEffect(() => {
    window.api
      .getFileContent(test.path.split("::")[0])
      .then((content) => setSourceCode(content));
    let path = test.path;
    if (path.length > 80) {
      path = "..." + path.slice(path.length - 80, path.length);
    }
    setTarget(path);
  }, [test]);
  return (
    <Dialog open={isModalOpen} onOpenChange={handleModalOpen}>
      <DialogContent className="my-12 max-h-screen overflow-y-scroll border-muted bg-background p-12 sm:max-w-2xl md:max-w-4xl">
        <h2 className="text-lg font-bold text-accent1 ">
          {"Python Code: " + test.testName}
        </h2>
        <div className="pb-1 text-muted-foreground">
          <h2>{target}</h2>
        </div>
        <ScrollArea className="h-full w-full rounded-lg">
          <ScrollBar orientation="vertical" />
          <ScrollBar orientation="horizontal" />
          <SyntaxHighlighter language="python" style={flojoySyntaxTheme}>
            {sourceCode}
          </SyntaxHighlighter>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default PythonTestFileModal;
