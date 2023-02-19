import React, { useState, useCallback } from "react";
import styled from "styled-components";
import { v4 as uuidv4 } from "uuid";

// import { SideBarData } from "./SideBarData.js";
import { SECTIONS } from "../manifest/COMMANDS_MANIFEST";
import SubMenu from "./SubMenu";

import { navbar_icon, menu_close } from "./assets/index";
import { NodeOnAddFunc, ParamTypes } from "../types/NodeAddFunc";
import { useFlowChartState } from "@src/hooks/useFlowChartState";

const getNodePosition = () => {
  return {
    x: 50 + Math.random() * 20,
    y: 50 + Math.random() + Math.random() * 20,
  };
};

const SidebarNav = styled.nav<{ isOpen?: boolean }>`
  background: #707070;
  width: 250px;
  height: 1000px;
  display: flex;
  justify-content: center;
  position: fixed;
  top: 11.5%;
  left: ${({ isOpen }) => (isOpen ? "0" : "-100%")};
  transition: 0.5s;
  z-index: 10;
`;

const SidebarWrap = styled.div`
  width: 100%;
`;

const ButtonWrap = styled.button<{ theme?: string }>`
  border: none;
  color: ${({ theme }) => (theme === "black" ? "white" : "black")};
  padding: 15px 32px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin: 4px 2px;
  cursor: pointer;
`;

const SideBar = ({ theme }) => {
  const [sidebarOpen, isSideBarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(SECTIONS[0].title);

  const { setNodes } = useFlowChartState();

  const activeBtnStyle = {
    height: "100%",
    borderBottom:
      theme === "dark"
        ? "2px solid rgb(153, 245, 255)"
        : "2px solid rgba(123, 97, 255, 1)",
  };

  const onAdd: NodeOnAddFunc = useCallback(
    ({ key, params, type, inputs, customNodeId }) => {
      let functionName: string;
      const id = `${key}-${uuidv4()}`;
      if (key === "CONSTANT") {
        let constant = prompt("Please enter a numerical constant", "2.0");
        if (constant == null) {
          constant = "2.0";
        }
        functionName = constant;
      } else {
        functionName = prompt("Please enter a name for this node")!;
      }
      if (!functionName) return;
      const funcParams = params
        ? Object.keys(params).reduce(
            (
              prev: Record<
                string,
                {
                  functionName: string;
                  param: keyof ParamTypes;
                  value: string | number;
                }
              >,
              param
            ) => ({
              ...prev,
              [key + "_" + functionName + "_" + param]: {
                functionName: key,
                param,
                value:
                  key === "CONSTANT" ? +functionName : params![param].default,
              },
            }),
            {}
          )
        : {};

      const newNode = {
        id: id,
        type: customNodeId || type,
        data: {
          id: id,
          label: functionName,
          func: key,
          type,
          ctrls: funcParams,
          inputs,
        },
        position: getNodePosition(),
      };
      setNodes((els) => els.concat(newNode));
    },
    [setNodes]
  );

  const handleSidebar = () => {
    isSideBarOpen(!sidebarOpen);
  };

  return (
    <div>
      <ButtonWrap theme={theme} onClick={handleSidebar}>
        + Add Node
      </ButtonWrap>

      <SidebarNav isOpen={sidebarOpen}>
        <SidebarWrap>
          <img
            src={menu_close}
            onClick={handleSidebar}
            style={{ float: "right", margin: "10px", cursor: "pointer" }}
          ></img>
          {SECTIONS.map((item, index) => {
            return (
              <div
                style={{
                  borderBottom:
                    theme === "dark"
                      ? "1px solid rgb(47, 46, 46)"
                      : "1px solid rgba(217, 217, 217, 1)",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <SubMenu
                  item={item}
                  activeTab={activeTab}
                  setActiveTab={setActiveTab}
                  key={index}
                  style={{
                    ...(activeTab === item.title && activeBtnStyle),
                  }}
                  onAdd={onAdd}
                  theme={theme}
                />
              </div>
            );
          })}
        </SidebarWrap>
      </SidebarNav>
    </div>
  );
};

export default SideBar;
