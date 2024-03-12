import { memo } from "react";
import HeaderTab from "./HeaderTab";
import ControlBar from "@/renderer/routes/flow_chart/views/ControlBar";
import { HEADER_HEIGHT } from "./Layout";
import { TabName } from "@/renderer/stores/app";

interface Tab {
  to: string;
  fullText: TabName;
  shortText: string;
  testId: string;
}

const tabs: Tab[] = [
  {
    to: "/test-sequencer",
    fullText: "Test Sequencer",
    shortText: "Sequencer",
    testId: "test-sequencer-btn",
  },
  {
    to: "/flowchart",
    fullText: "Visual Python Script",
    shortText: "Script",
    testId: "script-btn",
  },
  {
    to: "/control",
    fullText: "Control Panel",
    shortText: "Control",
    testId: "control-btn",
  },
  {
    to: "/devices",
    fullText: "Hardware Devices",
    shortText: "Devices",
    testId: "devices-btn",
  },
  // {
  //   to: "/pymgr",
  //   fullText: "Python Env/Pkg Manager",
  //   shortText: "Python",
  //   testId: "pymgr-btn",
  // },
];

const Header = () => {
  return (
    <div
      style={{ height: HEADER_HEIGHT }}
      className="m-1 flex flex-row gap-4 whitespace-nowrap"
    >
      <img
        className="h-20 w-20 object-cover"
        src="assets/logo.png"
        alt="Logo"
      />
      {tabs.map((t) => (
        <HeaderTab
          to={t.to}
          testId={t.testId}
          key={t.fullText}
          tabName={t.fullText}
        >
          <div className="hidden sm:block">{t.fullText}</div>
          <div className="sm:hidden">{t.shortText}</div>
        </HeaderTab>
      ))}
      <div className="grow" />
      <ControlBar />
    </div>
  );
};

export default memo(Header);
