import { useAtom } from "jotai";
import Header from "./Header";
import { useSocket } from "@src/hooks/useSocket";
import { projectAtom, unsavedChangesAtom } from "@src/hooks/useFlowChartState";
import { Input } from "@src/components/ui/input";

type LayoutProps = {
  children: React.ReactNode;
};

export const HEADER_HEIGHT = 72;
export const ACTIONS_HEIGHT = 56;
const SERVER_STATUS_HEIGHT = 32;

export const LAYOUT_TOP_HEIGHT =
  HEADER_HEIGHT + ACTIONS_HEIGHT + SERVER_STATUS_HEIGHT;

export const Layout = ({ children }: LayoutProps) => {
  const {
    states: { serverStatus },
  } = useSocket();

  const [project, setProject] = useAtom(projectAtom);
  const [hasUnsavedChanges] = useAtom(unsavedChangesAtom);

  const handleProjectRename = (e) => {
    setProject({ ...project, name: e.target.value });
  };

  return (
    <div>
      <div className="relative mx-8">
        <div className="absolute left-0 top-1.5 flex items-center gap-x-1">
          <Input
            className="h-6 w-28 overflow-hidden overflow-ellipsis whitespace-nowrap text-sm focus:border-none sm:w-48"
            value={project.name}
            onChange={handleProjectRename}
          />
          {hasUnsavedChanges && (
            <div className="text-xs text-muted-foreground">(unsaved)</div>
          )}
        </div>
        <div
          data-cy="app-status"
          id="app-status"
          className="flex flex-1 items-center justify-center text-sm"
          style={{
            height: SERVER_STATUS_HEIGHT,
          }}
        >
          <code>{serverStatus}</code>
        </div>
        <div />
        <Header />
      </div>
      <main style={{ minHeight: `calc(100vh - ${LAYOUT_TOP_HEIGHT}px)` }}>
        {children}
      </main>
    </div>
  );
};
