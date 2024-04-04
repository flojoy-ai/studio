import { useEffect, useState } from "react";
import { Input } from "@/renderer/components/ui/input";
import { useTestSequencerState } from "@/renderer/hooks/useTestSequencerState";
import { useTestSequencerWS } from "@/renderer/context/testSequencerWS.context";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/renderer/components/ui/select";
import { Button } from "@/renderer/components/ui/button";
import { useAppStore } from "@/renderer/stores/app";
import { useShallow } from "zustand/react/shallow";
import { Station, getCloudProjects, getCloudStations, getCloudUnit, getEnvironmentVariables } from "@/renderer/lib/api";
import { toastQueryError } from "@/renderer/utils/report-error";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Spinner } from "@/renderer/components/ui/spinner";
import { TestSequenceContainer } from "@/renderer/types/test-sequencer";
import { Badge } from "@/renderer/components/ui/badge";
import { Checkbox } from "@/renderer/components/ui/checkbox";
import useWithPermission from "@/renderer/hooks/useWithPermission";
import { toast } from "sonner";


export function CloudPanel() {
  const queryClient = useQueryClient();
  const { isAdmin } = useWithPermission();
  const [lotNumber, setLotNumber] = useState("");
  const [description, setDescription] = useState("N/A");
  const [projectId, setProjectId] = useState("");
  const [partNumber, setPartNumber] = useState("");
  const { isLocked, sequences, uploadInfo, setIntegrity, setSerialNumber, setStationId, uploadAfterRun, setUploadAfterRun, handleUpload } = useTestSequencerState();

  useEffect(() => {
    setUploadAfterRun(!isAdmin());
  }, [isAdmin]);
  
  const getIntegrity = (sequences: TestSequenceContainer[]): boolean => {
    let integrity = true;
    sequences.forEach((seq) => {
      integrity = integrity && seq.runable;
    });
    setIntegrity(integrity);
    return integrity;
  };

  const envsQuery = useQuery({
    queryKey: ["envs"],
    queryFn: async () => {
      const res = await getEnvironmentVariables();
      return res.match(
        (vars) => vars,
        (e) => {
          toastQueryError(e, "Failed to fetch environment variables");
          return [];
        },
      );
    },
  });

  const unitQuery = useQuery({
    queryKey: ["unit"],
    queryFn: async () => {
      if (envsQuery.isSuccess) {
      if (
        envsQuery.data.some((c) => c.key === "FLOJOY_CLOUD_WORKSPACE_SECRET") && uploadInfo.serialNumber !== ""
      ) {
        const res = await getCloudUnit(uploadInfo.serialNumber);
        return res.match(
          (vars) =>  vars,
          (e) => {
            console.error(e);
            // toast.error("The Serail Number doesn't exist, please check it again.");
            return [];
          },
        );
      }
      }
      return [];
    },
    enabled: envsQuery.isSuccess,
  });

  const projectsQuery = useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      if (envsQuery.isSuccess) {
        if (
          envsQuery.data.some((c) => c.key === "FLOJOY_CLOUD_WORKSPACE_SECRET")
        ) {
          const res = await getCloudProjects();
          return res.match(
            (vars) => vars,
            (e) => {
              console.error(e);
              toast.error("Failed to fetch production lines");
              return [];
            },
          );
        }
      }
      return [];
    },
    enabled: envsQuery.isSuccess,
  });

  const stationsQuery = useQuery({
    queryKey: ["stations"],
    queryFn: async () => {
      if (
        envsQuery.isSuccess && projectsQuery.isSuccess && projectId !== ""
      ) {
        const res = await getCloudStations(projectId);
        return res.match(
          (vars) => vars,
          (e) => {
            console.error(e);
            toast.error("Failed to fetch stations");
            return [];
          },
        );
      }
      return [];
    },
    enabled: projectsQuery.isSuccess, // Enable only when projectsQuery is successful
  });
  
  useEffect(() => {
    setStationId("");
    if (projectId !== "") {
      stationsQuery.refetch();
    }
  }, [projectId]);

  const handleSetProject = (newValue: Station) => {
    setProjectId(newValue.value);
    setDescription(newValue.part.description);
    setPartNumber(newValue.part.partNumber);
  };

  const { isEnvVarModalOpen, setIsEnvVarModalOpen } = useAppStore(
    useShallow((state) => ({
      isEnvVarModalOpen: state.isEnvVarModalOpen,
      setIsEnvVarModalOpen: state.setIsEnvVarModalOpen,
    })),
  );

  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ["envs"] });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEnvVarModalOpen]);

  if (!envsQuery.isSuccess || !projectsQuery.isSuccess || !stationsQuery.isSuccess) {
    return (
      <div className="grid grid-cols-1 place-items-center gap-4 py-5">
        <Spinner />
      </div>
    );
  }

  const isCloudKeySet = envsQuery.data.some(
    (c) => c.key === "FLOJOY_CLOUD_WORKSPACE_SECRET",
  );

  return (
    <div className="w-full">
      {!isCloudKeySet ? (
        <Button onClick={() => setIsEnvVarModalOpen(true)} className="w-full">
          Connect to Flojoy Cloud
        </Button>
      ) : (
        <div>
          <h2 className="mb-2 text-lg font-bold text-accent1 ">
            Unit Under Test
          </h2>

          <div className="flex">
            <div className="flex-grow">
              <div className="pb-1 pt-2 text-xs text-muted-foreground">
                <p>Serial Number</p>
              </div>
              <Input
                className="focus:ring-accent1 focus:ring-offset-1 focus-visible:ring-accent1 focus-visible:ring-offset-1"
                type="text"
                value={uploadInfo.serialNumber}
                onChange={(e) => setSerialNumber(e.target.value)}
                placeholder="SN-0001"
                disabled={isLocked}
                autoFocus
              />
            </div>

            <div className="ml-2 w-1/3 flex-none">
              <div className="pb-1 pt-2 text-xs text-muted-foreground">
                <p>Lot Number</p>
              </div>
              <Input
                className="focus:ring-accent1 focus:ring-offset-1 focus-visible:ring-accent1 focus-visible:ring-offset-1"
                type="text"
                value={lotNumber}
                onChange={(e) => setLotNumber(e.target.value)}
                placeholder="L-001"
                disabled={isLocked}
                autoFocus
              />
            </div>
          </div>

          <div className="pb-1 pt-2 text-xs text-muted-foreground">
            <p>Part Number</p>
          </div>
          <Input placeholder="Select a station" value={partNumber} disabled={true} />

          <div className="pt-2 text-xs text-muted-foreground">
            <p>Description: { ` ${description}`} </p>
            { /* <p>Product: Arm-Link 6</p> } */}
          </div>

          <hr className="mt-4" />

          <h2 className="my-2 text-lg font-bold text-accent1 ">
            Test Environment
          </h2>

          <div className="pb-1 text-xs text-muted-foreground">
            <p>Production Line</p>
          </div>

          <Select 
            onValueChange={(value) => {
              handleSetProject(value);
            }} 
            disabled={isLocked}
          >
            <SelectTrigger>
              <SelectValue placeholder={"Select your production line..."} />
            </SelectTrigger>
            <SelectContent className="max-h-72">
              {projectsQuery.data.length === 0 && (
                <div className="flex flex-col items-center justify-center gap-2 p-2 text-sm">
                  <strong>No production line found</strong>
                  <Button
                    onClick={() => projectsQuery.refetch()}
                    variant={"ghost"}
                  >
                    Refresh 
                  </Button>
                </div>
              )}
              {projectsQuery.data.map((option) => (
                <SelectItem key={option.value} value={option}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="pb-1 pt-2 text-xs text-muted-foreground">
            <p>Test Station</p>
          </div>

          <Select 
            onValueChange={setStationId} 
            disabled={isLocked}>
            <SelectTrigger>
              <SelectValue placeholder={"Select your station..."} />
            </SelectTrigger>
            <SelectContent className="max-h-72">
              {stationsQuery.data.length === 0 && (
                <div className="flex flex-col items-center justify-center gap-2 p-2 text-sm">
                  <strong>No station found</strong>
                  { stationsQuery.isFetching ? <p> Loading... </p> :
                  <p> Select a production line to load the available stations </p>
                  }
                </div>
              )}
              {stationsQuery.data.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="mt-2 grid grid-flow-row grid-cols-2 gap-1 text-xs text-muted-foreground">
            <p>Station: ID-12345678 </p>
            <p>Test JIG P/N: PN-0123456</p>
            <p>Test JIG SN: SN-0123456</p>
            <p>Operator: John Doe</p>
            <p>Sequencer: TSW-0.3.0 </p>
            <p>
              {" "}
              Integrity:{" "}
              {getIntegrity(sequences) ? (
                <Badge className="h-4 bg-green-500">Pass</Badge>
              ) : (
                <Badge className="h-4 bg-red-500">Fail</Badge>
              )}
            </p>
          </div>
          <div className="py-2" />
          { isAdmin() && (
            <div className="flex bt-2 items-center">
              <Checkbox checked={uploadAfterRun} onCheckedChange={setUploadAfterRun} />
              <p className="ml-2 text-muted-foreground text-sm"> Automatically upload </p>
              <div className="grow"/>
              <Button 
                variant="outline" 
                disabled={isLocked || uploadInfo.isUploaded} 
                className="h-6 text-muted-foreground text-xs" 
                onClick={() => handleUpload(true)}
              >
                { uploadInfo.isUploaded ? "Upload Done" : "Upload to Flojoy Cloud" }
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
