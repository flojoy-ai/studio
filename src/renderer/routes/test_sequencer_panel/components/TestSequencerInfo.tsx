import { DataTable } from "./data-table/DataTable";
import { SummaryTable } from "./SummaryTable";
import { CloudPanel } from "./CloudPanel";
import { useTestSequencerState } from "@/renderer/hooks/useTestSequencerState";
import { LockedContextProvider } from "@/renderer/context/lock.context";
import {
  LAYOUT_TOP_HEIGHT,
  BOTTOM_STATUS_BAR_HEIGHT,
} from "@/renderer/routes/common/Layout";
import { TestGeneratorPanel } from "./TestGeneratorPanel";
import { TabsContent } from "@radix-ui/react-tabs";
import { Tabs, TabsList, TabsTrigger } from "@/renderer/components/ui/tabs";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/renderer/components/ui/card";
import { TestGenerationInputModal } from "./TestGenerationInputModal";
import { TestControlPanel } from "./TestControlPanel";

const TestSequencerView = () => {
  const { project } = useTestSequencerState();

  return (
    <LockedContextProvider>
      <TestGenerationInputModal />
      <div
        style={{
          height: `calc(100vh - ${LAYOUT_TOP_HEIGHT + BOTTOM_STATUS_BAR_HEIGHT}px)`,
        }}
      >
        <div className="flex overflow-y-auto">
          <div
            className="ml-auto mr-auto h-3/5 flex-grow flex-col overflow-y-auto"
            style={{ height: "calc(100vh - 260px)" }}
          >
            <SummaryTable />
            <DataTable />
          </div>

          <div className="top-0 h-full flex-none overflow-y-auto pl-5">
            <Tabs defaultValue="control" className="m-3 w-[400px]">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="control">Control</TabsTrigger>
                <TabsTrigger value="cloud">Cloud</TabsTrigger>
                <TabsTrigger disabled={project == null} value="generate">
                  Generate
                </TabsTrigger>
              </TabsList>
              <TabsContent value="cloud">
                <Card>
                  <CardHeader>
                    <CardTitle>Cloud Panel</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <CloudPanel />
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="generate">
                <Card>
                  <CardHeader>
                    <CardTitle>Generate Panel</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <TestGeneratorPanel />
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="control">
                <Card>
                  <CardHeader>
                    <CardTitle>Control Panel</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <TestControlPanel />
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </LockedContextProvider>
  );
};

export default TestSequencerView;
