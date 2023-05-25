import React, { useEffect, useState } from "react";
// import { Display as SevenSegmentDisplay } from "react-7-segment-display";

// TODO: Properly type this component
type SevenSegmentComponentProp = {
  ctrlObj: any;
  plotData: any;
  nd: any;
};
const SevenSegmentComponent = ({
  ctrlObj,
  plotData,
  nd,
}: SevenSegmentComponentProp) => {
  const [data, setData] = useState(0);

  // useEffect(() => {
  //   if (nd) {
  //     if (typeof nd.result.y[0] === "number") {
  //       const number = nd.result.y[0];
  //       if (number < 0) {
  //         const value = Math.floor(Math.abs(number));
  //         setData(value);
  //       } else {
  //         if (Number.isInteger(number)) {
  //           setData(Math.floor(number));
  //         } else {
  //           setData(Math.floor(number + 1));
  //         }
  //       }
  //     }
  //   }
  // }, [nd]);

  return (
    <div className="seven_segment_container">
      {/* <SevenSegmentDisplay
            color={ctrlObj.segmentColor || "#99F5FF"}
            count={4}
            height={200}
            skew={false}
            value={data}
          /> */}
    </div>
  );
};

export default SevenSegmentComponent;
