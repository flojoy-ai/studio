import { flojoySyntaxTheme } from "@/renderer/assets/FlojoyTheme";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/renderer/components/ui/dialog";
import { ScrollArea, ScrollBar } from "@/renderer/components/ui/scroll-area";
import { Test, TestSequenceElement } from "@/renderer/types/testSequencer";
import { Row } from "@tanstack/react-table";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import python from "react-syntax-highlighter/dist/cjs/languages/hljs/python";
import { Light as SyntaxHighlighter } from "react-syntax-highlighter";

type Props = {
  isModalOpen: boolean;
  handleModalOpen: Dispatch<SetStateAction<boolean>>;
  row: Row<TestSequenceElement>;
};
SyntaxHighlighter.registerLanguage("python", python);

const PythonTestFileModal = ({ isModalOpen, handleModalOpen, row }: Props) => {
  const [sourceCode, setSourceCode] = useState("");

  useEffect(() => {
    window.api
      .getFileContent((row.original as Test).path.split("::")[0])
      .then((content) => setSourceCode(content));
  }, [row.original]);
  return (
    <Dialog open={isModalOpen} onOpenChange={handleModalOpen}>
      <DialogContent className="my-12 max-h-screen overflow-y-scroll border-muted bg-background p-12 sm:max-w-2xl md:max-w-4xl">
        <DialogHeader>
          <DialogTitle>{(row.original as Test).testName}</DialogTitle>
        </DialogHeader>
        <h2 className="text-lg font-semibold text-muted-foreground">
          Python code
        </h2>
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
