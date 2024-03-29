import { StatusType, Test, TestSequenceElement } from "@/renderer/types/test-sequencer"
import { Badge } from "@/renderer/components/ui/badge";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@radix-ui/react-hover-card";
import { filter, max, sum } from "lodash";

export const mapStatusToDisplay: { [k in StatusType] } = {
  pending: <Badge variant="bold" className="bg-secondary text-primary">PENDING</Badge>,
  running: <Badge variant="bold" className="bg-blue-500">RUNNING</Badge>,
  paused:  <Badge variant="bold" className="bg-yellow-500">PAUSED</Badge>,
  pass:    <Badge variant="bold" className="bg-green-500">PASS</Badge>,
  aborted: <Badge variant="bold" className="bg-red-500">ABORTED</Badge>,
  fail: (status: string | null) =>
    status === null || status === "" ? (
      <Badge variant="bold" className="bg-red-500">FAIL</Badge>
    ) : (
      <HoverCard>
        <HoverCardTrigger>
          <Badge
            variant="bold"
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
    (elem) => elem.type === "test" && elem.status != "pending" && elem.status != "running",
  ) as Test[];
};


export const getSuccessRate = (data: TestSequenceElement[]): number => {   
  const tests = getOnlyTests(data);  
  if (tests.length == 0) return 0;
  const success = filter(tests, (elem) => elem.status == "pass").length;
  console.log("Success Rate: ", (success / tests.length) * 100, "%", data);
  console.log("tests: ", tests);
  return (success / tests.length) * 100;
}

