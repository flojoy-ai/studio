import { CustomNodeProps } from "@feature/flow_chart_panel/types/CustomNodeProps";
import { memo } from "react";
import ETLNode from "./ETLNode";

const ArithmeticNode = ({ data, handleRemove }: CustomNodeProps) => {
  let operator = "";
  switch (data.func) {
    case "MULTIPLY":
      operator = "×";
      break;
    case "ADD":
      operator = "+";
      break;
    case "SUBTRACT":
      operator = "-";
      break;
    case "DIVIDE":
      operator = "÷";
      break;
    case "ABS":
      operator = "|x|";
      break;
  }

  return (
    <ETLNode width={72} height={72} data={data} handleRemove={handleRemove}>
      <h2 className="font-sans text-4xl font-semibold tracking-wider text-accent1">
        {operator}
      </h2>
    </ETLNode>
  );
};

export default memo(ArithmeticNode);
