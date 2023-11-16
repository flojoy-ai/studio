import { ParamValueType } from "@src/routes/common/types/ParamValueType";
import { ParamTooltip } from "@src/components/common/ParamTooltip";
import { ElementsData } from "@src/types/node";
import ParamField from "./ParamField";

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

  let ctrlList = Object.entries(ctrls);

  const overload = Object.entries(ctrls).find(([, p]) => p.overload !== null);
  if (overload !== undefined) {
    const [overloadName, overloadParam] = overload;
    if (overloadParam.overload && overloadParam.value) {
      const filterList = overloadParam.overload[overloadParam.value.toString()];
      ctrlList = Object.entries(ctrls).filter(
        ([filterName]) =>
          overloadName === filterName || filterList.includes(filterName),
      );

    }
  }

  return (
    <>
      {ctrlList.map(([name, param]) => (
        <div
          key={nodeId + name}
          id="undrag"
          data-testid="node-edit-modal-params"
        >
          <ParamTooltip
            nodeId={nodeId}
            param={{ name, type: param.type, desc: param.desc }}
            offsetX={30}
            offsetY={-192}
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
