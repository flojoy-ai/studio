import { DataTable } from "./data-table/DataTable";
import { SummaryTable } from "./SummaryTable";
import { CloudPanel } from "./CloudPanel";
import { useTestSequencerState } from "@/renderer/hooks/useTestSequencerState";
import { LockedContextProvider } from "@/renderer/context/lock.context";
import _ from "lodash";
import {
  LAYOUT_TOP_HEIGHT,
  BOTTOM_STATUS_BAR_HEIGHT,
} from "@/renderer/routes/common/Layout";
import { ModalsProvider } from "./modals/ModalsProvider";
import { Tabs, TabsContent, TabsList } from "@/renderer/components/ui/tabs";
import { TabsTrigger } from "@radix-ui/react-tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/renderer/components/ui/card";
import { DesignPanel } from "./DesignPanel";
import { CyclePanel } from "./CyclePanel";
import useWithPermission from "@/renderer/hooks/useWithPermission";

const TestSequencerView = () => {

  const { isAdmin } = useWithPermission();

  return (
    <LockedContextProvider>
      <div
        style={{
          height: `calc(100vh - ${LAYOUT_TOP_HEIGHT + BOTTOM_STATUS_BAR_HEIGHT}px)`,
        }}
      >
        <ModalsProvider />
        <div className="flex overflow-y-auto">

          <div
            className="pt-12 ml-auto mr-auto h-3/5 flex-grow flex-col overflow-y-auto"
            style={{ height: "calc(100vh - 260px)" }}
          >
            <div className="flex w-full">
              <CyclePanel />
              <SummaryTable />
            </div>
            <DataTable />
          </div>

          <div className="flex-none" style={{ width: "28%" }} >
            <div className="top-0 h-full flex-none overflow-y-auto pl-5 w-full">
              <Tabs defaultValue="Execution" className="w-full h-full">
                { isAdmin() &&
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="Execution">Test Execution</TabsTrigger>
                     <TabsTrigger value="Design">Design Panel</TabsTrigger>
                  </TabsList>
                }
                <TabsContent value="Design">
                  <Card>
                    <CardHeader>
                      <CardTitle>Design</CardTitle>
                      <CardDescription>
                        Design and manage test sequences
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <hr />
                      <DesignPanel />
                    </CardContent>
                  </Card>
                </TabsContent>
                <TabsContent value="Execution">
                  <Card>
                    <CardHeader>
                      <CardTitle>Execution</CardTitle>
                      <CardDescription>
                        Monitor and control test execution
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <hr />
                      <CloudPanel />
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>

        </div>
      </div>
    </LockedContextProvider>
  );
};

export default TestSequencerView;
