import { IServerStatus } from "@src/context/socket.context";
import { useSocket } from "@src/hooks/useSocket";
import { Variants, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle, ChevronRight, XCircle } from "lucide-react";
import ElectronLogsDialog from "@src/components/electron/ElectronLogsDialog";
import { Button } from "@src/components/ui/button";

const LoadingPage = () => {
  const {
    states: { serverStatus },
  } = useSocket();
  const navigate = useNavigate();
  const [openFullLogs, setOpenFullLogs] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState<string | undefined>();
  const [outputs, setOutputs] = useState<string[]>([]);
  const handleShowFullLogs = () => {
    setOpenFullLogs(true);
  };
  useEffect(() => {
    // Subscribe to electron logs
    window.api?.subscribeToElectronLogs((data) => {
      if (typeof data === "string") {
        setOutputs((p) => [...p, data]);
        return;
      }
      if (typeof data === "object" && data !== null) {
        if (data.title) {
          setTitle(data.title);
        }
        if (data.description) {
          setDescription(data.description);
        }
        if (data.clear) {
          setOutputs([]);
        } else {
          setOutputs((p) => [...p, data.output]);
        }
      }
    });
  }, []);

  useEffect(() => {
    if (
      ![IServerStatus.OFFLINE, IServerStatus.CONNECTING].includes(serverStatus)
    ) {
      navigate("/flowchart");
    }
  }, [navigate, serverStatus]);

  return (
    <div className="flex h-screen flex-col items-center justify-center bg-violet-600">
      {outputs.length > 0 ? (
        <div className="flex max-w-3xl flex-col items-start justify-center">
          <SpinningWheel
            logs={outputs}
            title={title}
            description={description}
          />
          <div className="flex w-fit items-center justify-start">
            <Button
              className="justify-self-start text-white"
              size={"sm"}
              variant={"link"}
              onClick={handleShowFullLogs}
            >
              <ChevronRight size={16} />
              Show Full Logs
            </Button>
          </div>
        </div>
      ) : (
        <>
          <BarLoader />
          <div className="py-4" />
          <div className="text-white">
            Waiting for the backend connection...
          </div>
        </>
      )}
      <ElectronLogsDialog
        open={openFullLogs}
        setOpen={setOpenFullLogs}
        title={title}
        description={description}
        logs={outputs}
      />
    </div>
  );
};

const variants = {
  initial: {
    scaleY: 0.5,
    opacity: 0,
  },
  animate: {
    scaleY: 1,
    opacity: 1,
    transition: {
      repeat: Infinity,
      repeatType: "mirror",
      duration: 1,
      ease: "circIn",
    },
  },
} as Variants;

const BarLoader = () => {
  return (
    <motion.div
      transition={{
        staggerChildren: 0.25,
      }}
      initial="initial"
      animate="animate"
      className="flex gap-1"
    >
      <motion.div variants={variants} className="h-12 w-2 bg-white" />
      <motion.div variants={variants} className="h-12 w-2 bg-white" />
      <motion.div variants={variants} className="h-12 w-2 bg-white" />
      <motion.div variants={variants} className="h-12 w-2 bg-white" />
      <motion.div variants={variants} className="h-12 w-2 bg-white" />
    </motion.div>
  );
};

export default LoadingPage;

interface SpinningWheelProps {
  logs: string[];
  title?: string;
  description?: string;
}

const CompletedLog = ({ log }: { log: string }) => (
  <li className="flex items-center gap-2 text-white">
    <CheckCircle size={20} className="text-green-500" />
    {log.length > 90 ? `${log.slice(0, 90)}...` : log}
  </li>
);
const ErrorLog = ({ log }: { log: string }) => (
  <li className="flex items-center gap-2 text-red-400">
    <XCircle size={20} className="text-red-500" />
    {log.length > 90 ? `${log.slice(0, 90)}...` : log}
  </li>
);
const RunningLog = ({ log }: { log: string }) => (
  <li className="flex w-fit items-center text-slate-300">
    <div role="status">
      <svg
        className="mr-3 h-5 w-5 animate-spin text-white"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          stroke-width="4"
        ></circle>
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
      </svg>
    </div>
    {log.length > 90 ? `${log.slice(0, 90)}...` : log}
  </li>
);

const SpinningWheel = ({ logs, title, description }: SpinningWheelProps) => {
  const infoLogs = logs
    .filter((log) => log.includes(":info:"))
    .map((log) => log.replaceAll(":info:", ""));
  const errorFound = logs.find((log) => log.toLowerCase().includes("error"));
  return (
    <div className="flex flex-col pb-4">
      <h2 className="mb-2 flex items-center justify-start gap-2 text-2xl font-semibold text-white">
        <div className="h-5 w-5 rounded-full border border-white p-[1px]">
          <div className="h-full w-full animate-ping  rounded-full bg-white"></div>
        </div>
        {title}
      </h2>
      <p className="mb-3 pl-6 text-xl text-slate-300">{description}</p>
      <ul className="max-w-3xl list-inside space-y-2 pl-4">
        {infoLogs.length > 2 && (
          <CompletedLog log={infoLogs[infoLogs.length - 3]} />
        )}
        {infoLogs.length > 1 && (
          <CompletedLog log={infoLogs[infoLogs.length - 2]} />
        )}
        {infoLogs.length > 0 &&
          (errorFound ? (
            <ErrorLog log={logs[logs.length - 1]} />
          ) : (
            <RunningLog log={infoLogs[infoLogs.length - 1]} />
          ))}
      </ul>
    </div>
  );
};
