import { Button } from "@/renderer/components/ui/button";
import React, { useState, useContext } from 'react';
import { Input } from "@/renderer/components/ui/input";
import { useTestSequencerState } from "@/renderer/hooks/useTestSequencerState";
import LockableButton from "./lockable/LockedButtons";
import { testSequenceExportCloud } from "../models/models";
import { TSWebSocketContext } from "../../../context/testSequencerWS.context";


export function CloudPanel() {
  const [hardwareId, setHardwareId] = useState('');
  const [projectId, setProjectId] = useState('');
  const { setElems, tree, setIsLocked } = useTestSequencerState();
  const { tSSendJsonMessage } = useContext(TSWebSocketContext);

  const handleExport = () => {
    setIsLocked(true);
    tSSendJsonMessage(testSequenceExportCloud(tree, hardwareId, projectId));
    setIsLocked(true);
  };

  return (
    <div className="rounded-xl border border-gray-300 min-w-[240px] rounded-xl border border-gray-300 py-4 dark:border-gray-800 p-4">

      <div className="flex flex-col">
        <h2 className="mb-2 text-lg font-bold text-accent1 pt-3 text-center "> Cloud Panel </h2>
        
        <div className="text-muted-foreground"><h2>Hardware id</h2></div>
        <Input
          className="focus:ring-accent1 focus:ring-offset-1 focus-visible:ring-accent1 focus-visible:ring-offset-1"
          type="text"
          value={hardwareId}
          onChange={(e) => setHardwareId(e.target.value)}
          placeholder="Scan or enter hardware id"
        />

        <div className="text-muted-foreground pt-2"><h2>Project id</h2></div>
        <Input
          className="focus:ring-accent1 focus:ring-offset-1 focus-visible:ring-accent1 focus-visible:ring-offset-1"
          type="text"
          value={projectId}
          onChange={(e) => setProjectId(e.target.value)}
          placeholder="Enter project id"
        />

        <div>
          <LockableButton 
            className="w-full mt-4"
            onClick={handleExport}
          >
            Upload Test Results
          </LockableButton >
        </div>
      </div>
      
    </div>
  );
};

