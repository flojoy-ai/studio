import {
  Conditional,
  Test,
  TestSequenceElement,
} from "@/renderer/types/testSequencer";
import { CellContext } from "@tanstack/react-table";
import { Loader } from "lucide-react";
import React, { useState } from "react";
type Props = {
  cellProps: CellContext<TestSequenceElement, unknown>;
  indentLevels: number[];
  running: string[];
};

const IndentLine = ({
  content: name,
  level = 0,
}: {
  content: React.ReactNode;
  level: number;
}) => (
  <div className="flex h-full flex-row">
    {level == 0 ? (
      name
    ) : (
      <div className="flex flex-row">
        <div className={"mr-5 flex h-full border-l-2 border-blue-800"}></div>
        <IndentLine content={name} level={level - 1} />
      </div>
    )}
  </div>
);

const TestNameCell = ({ cellProps: { row }, indentLevels, running }: Props) => {
  const isTest = row.original.type === "test";

  return isTest ? (
    <>
      <div className="flex h-full cursor-pointer space-x-2">
        {/* Indent levels */}
        <div className="flex flex-row space-x-1">
          <IndentLine
            content={(row.original as Test).testName}
            level={indentLevels[row.id]}
          />
          {running.includes(row.original.id) && <Loader className="scale-50" />}
        </div>
      </div>
    </>
  ) : (
    <IndentLine
      content={
        <div className="flex flex-col">
          <b>{(row.original as Conditional).conditionalType.toUpperCase()}</b>
          <i>
            {(row.original as Conditional).condition.substring(0, 45)}
            {(row.original as Conditional).condition.length >= 45 && <>...</>}
          </i>
        </div>
      }
      level={indentLevels[row.id]}
    />
  );
};

export default TestNameCell;
