import React, { useEffect, useState } from 'react'
import { Display as SevenSegmentDisplay } from "react-7-segment-display";


const SevenSegmentComponent = ({
    ctrlObj,
    plotData,
    nd
}) => {

    const [data,setData] = useState(0);

    // console.log(object);
    useEffect(()=>{
        if(nd){
            setData(nd.result.y[0])
        }
    },[nd])

  return (
    <div
          className="seven_segment_container"
        >
          <SevenSegmentDisplay
            color={ctrlObj.segmentColor || "#99F5FF"}
            count={4}
            height={200}
            skew={false}
            value={data}
          />
        </div>
  )
}

export default SevenSegmentComponent