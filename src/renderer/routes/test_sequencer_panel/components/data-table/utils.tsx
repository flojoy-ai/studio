import { StatusType, Test, TestSequenceElement } from "@/renderer/types/test-sequencer"
import { Badge } from "@/renderer/components/ui/badge";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@radix-ui/react-hover-card";
import { filter, max, sum } from "lodash";

export const mapStatusToDisplay: { [k in StatusType] } = {
  pending: <Badge className="bg-secondary text-primary">PENDING</Badge>,
  running: <Badge className="bg-blue-500 border-dash border-secondary">RUNNING</Badge>,
  paused:  <Badge className="bg-yellow-500">PAUSED</Badge>,
  pass:    <Badge className="bg-green-500">PASS</Badge>,
  aborted: <Badge className="bg-red-500">ABORTED</Badge>,
  fail: (status: string | null) =>
    status === null || status === "" ? (
      <Badge className="bg-red-500">FAIL</Badge>
    ) : (
      <HoverCard>
        <HoverCardTrigger>
          <Badge
            className="text relative z-20 bg-red-500 underline underline-offset-2 hover:bg-red-700"
          >
            FAIL
          </Badge>
        </HoverCardTrigger>
        <HoverCardContent className="w-256">
          <h2 className="text-muted-foreground">Error Message:</h2>
          {renderErrorMessage(status)}
        </HoverCardContent>
      </HoverCard>
    ),
};

function renderErrorMessage(text: string): JSX.Element {
  const lines = text.split("\n");
  return (
    <div className="mt-2 max-h-[400px] overflow-y-auto whitespace-pre rounded-md bg-secondary p-2">
      {lines.map((line, index) => (
        <div key={index}>{line}</div>
      ))}
    </div>
  );
}


export const getCompletionTime = (data: TestSequenceElement[]) => {
  const onlyTests = getOnlyTests(data);
  const parallel = filter(onlyTests, (elem) => elem.runInParallel).map(
    (elem) => elem.completionTime,
  );
  const nonParallel = filter(onlyTests, (elem) => !elem.runInParallel).map(
    (elem) => elem.completionTime,
  );
  let maxParallel = parallel.length > 0 ? max(parallel) : 0;
  if (maxParallel === undefined) maxParallel = 0;
  const nonParallelTotal = sum(nonParallel);
  return maxParallel + nonParallelTotal;
};

export const getOnlyTests = (data: TestSequenceElement[]): Test[] => {
  return filter(
    data,
    (elem) => elem.type === "test" && elem.status != "pending",
  ) as Test[];
};

