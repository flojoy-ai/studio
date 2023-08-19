import { ParamValueType } from "@src/feature/common/types/ParamValueType";
import { ParamTooltip } from "@/components/common/ParamTooltip";
import { ElementsData } from "@/types/node";
import ParamField from "./ParamField";
import { useEffect, useState } from "react";

type ParamListProps = {
  nodeId: string;
  ctrls: ElementsData["ctrls"];
  updateFunc: (nodeId: string, data: ElementsData["ctrls"][string]) => void;
  nodeReferenceOptions?: {
    label: string;
    value: string;
  }[];
};

export const ParamList = ({
  nodeId,
  ctrls,
  updateFunc,
  nodeReferenceOptions,
}: ParamListProps) => {
  const [filtered, setFiltered] = useState(Object.entries(ctrls));

  const filterCtrl = () => {
    Object.entries(ctrls).forEach(([name, param]) => {
      const val = ctrls[name].value;
      if (val && param.overload && param.overload[val.toString()]) {
        const filterList = param.overload[val.toString()];
        const filter = Object.entries(ctrls).filter(
          ([filterName]) =>
            name === filterName || filterList.includes(filterName),
        );
        setFiltered(filter);
      }
    });
  };

  useEffect(() => {
    filterCtrl();
  }, [ctrls]);

  return (
    <>
      {filtered.map(([name, param]) => (
        <div
          key={nodeId + name}
          id="undrag"
          data-testid="node-edit-modal-params"
        >
          <ParamTooltip
            param={{ name, type: param.type, desc: param.desc }}
            offsetX={30}
            offsetY={0}
          >
            <p className="mb-1 mt-4 cursor-pointer text-sm font-semibold">{`${name.toUpperCase()}:`}</p>
          </ParamTooltip>
          <ParamField
            nodeId={nodeId}
            nodeCtrl={ctrls[name]}
            type={param.type as ParamValueType}
            updateFunc={updateFunc}
            options={param.options}
            nodeReferenceOptions={nodeReferenceOptions}
          />
        </div>
      ))}
    </>
  );
};
