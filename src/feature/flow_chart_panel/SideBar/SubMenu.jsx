import { useState, Fragment } from 'react'
import styled from "styled-components";
import { COMMANDS } from '../manifest/COMMANDS_MANIFEST'
import { FUNCTION_PARAMETERS } from '../manifest/PARAMETERS_MANIFEST';

const SidebarLink = styled.div`
display: flex;
color: #e1e9fc;
justify-content: space-between;
align-items: center;
padding: 10px;
list-style: none;
text-decoration: none;
`;

const SidebarLabel = styled.span`
margin-left: 16px;
color:white;
`;

const DropdownLink = styled.div`
background: #484a4a;
padding-left: 2rem;
display: flex;
align-items: center;
text-decoration: none;
color: #f5f5f5;
transition:0.5s;
&:hover {
	cursor: pointer;
}
`;

const SubMenu = ({ item, activeTab, style, setActiveTab, onAdd, theme }) => {
    const [subnav, setSubnav] = useState(false);

    const showSubnav = () => {
        setSubnav(!subnav)
        setActiveTab(item.title)
    }

    return (
        <div style={style}>
            <SidebarLink
                onClick={item.child && showSubnav}>
                <div
                    style={{
                        cursor: 'pointer'
                    }}
                >
                    <SidebarLabel>{item.title}</SidebarLabel>
                </div>
                <div>
                    {item.child && subnav
                        ? item.iconOpened
                        : item.child
                            ? item.iconClosed
                            : null}
                </div>
            </SidebarLink>
            {subnav && item.title === activeTab &&
                item.child.map((section, index) => {
                    return (
                        <DropdownLink key={index}>

                            <Fragment key={section.key}>
                                <div key={section.key}>
                                    <SidebarLabel>
                                        {section.name}
                                    </SidebarLabel>
                                    <div
                                        className="flex"
                                        style={{
                                            gap: "8px",
                                            alignItems: "center",
                                            width: "fit-content",
                                            flexWrap: "wrap",
                                        }}
                                    >
                                        {COMMANDS.map((cmd, cmdIndex) => (
                                            <Fragment key={cmdIndex}>
                                                {section.key === cmd.type ? (
                                                    <button
                                                        className={
                                                            theme === "dark" ? "cmd-btn-dark" : "cmd-btn"
                                                        }
                                                        onClick={() => {
                                                            onAdd({
                                                                key: cmd.key,
                                                                type: cmd.type,
                                                                params: FUNCTION_PARAMETERS[cmd.key],
                                                                inputs: cmd.inputs,
                                                                ...(cmd.ui_component_id && {
                                                                    customNodeId: cmd.ui_component_id,
                                                                }),
                                                            });
                                                        }}
                                                        key={cmd.name}
                                                    >
                                                        {cmd.name}
                                                    </button>
                                                ) : null}
                                            </Fragment>
                                        ))}
                                    </div>
                                </div>
                            </Fragment>
                            {/* {item.title === activeTab &&
                                item.child.map((section) => (

                                ))} */}
                        </DropdownLink>
                    );
                })}

        </div>
    );
};

export default SubMenu;