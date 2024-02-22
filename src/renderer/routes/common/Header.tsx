import { memo } from "react";
import HeaderTab from "./HeaderTab";
import ControlBar from "../flow_chart/views/ControlBar";
import { useWindowSize } from "react-use";
import { HEADER_HEIGHT } from "./Layout";
import { useState } from "react";
import { TabEnum } from "@/renderer/hooks/useActiveTab";


const tabs = [
  {
    to: "/test-sequencer",
    fullText: TabEnum.SEQUENCER,
    shortText: "Sequencer",
    testId: "test-sequencer-btn",
  },
  {
    to: "/flowchart",
    fullText: TabEnum.FLOWCHART,
    shortText: "Script",
    testId: "script-btn",
  },
  {
    to: "/devices",
    fullText: TabEnum.DEVICES,
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

const lg = 1024;

const Header = () => {
  // Actual media query causes flickering... need to use this manual one
  const { width } = useWindowSize();
  const large = width > lg;

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
        <HeaderTab to={t.to} testId={t.testId} key={t.fullText} tabName={t.fullText}>
          {large ? t.fullText : t.shortText}
        </HeaderTab>
      ))}
      <div className="grow" />
      <ControlBar />
    </div>
  );
};

export default memo(Header);
