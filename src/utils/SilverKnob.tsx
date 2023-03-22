import React, { useState } from "react";
import {
  composeTwo,
  SkinProps,
  useAngleUpdater,
  SkinWrap,
} from "react-dial-knob";
import Knob from "react-dial-knob";

const uniqClassName = `metal-${new Date().getTime()}`;

export default function Silver(props: SkinProps<unknown>): JSX.Element {
  const [angle, setAngle] = useAngleUpdater(props.value);
  const [bgrClass, setBgrClass] = useState(`${uniqClassName}-bgr`);

  const angleChangeHandler = composeTwo<number>(setAngle, props.onAngleChange);
  const interactionChangeHandler = composeTwo<boolean>((isInteracting) => {
    isInteracting
      ? setBgrClass(`${uniqClassName}-bgr-active`)
      : setBgrClass(`${uniqClassName}-bgr`);
  }, props.onInteractionChange);
  const glowSpacing = 28;
  return (
    <SkinWrap style={props.style}>
      <Knob
        diameter={props.diameter + glowSpacing}
        value={props.value}
        min={props.min}
        max={props.max}
        step={props.step}
        jumpLimit={props.jumpLimit}
        spaceMaxFromZero={props.spaceMaxFromZero}
        ariaLabelledBy={props.ariaLabelledBy}
        ariaValueText={props.ariaValueText}
        knobStyle={{ cursor: "pointer", ...props.knobStyle }}
        onAngleChange={angleChangeHandler}
        onInteractionChange={interactionChangeHandler}
        onValueChange={props.onValueChange}
      >
        <>
          <style type="text/css">
            {`.${uniqClassName}-bgr, .${uniqClassName}-bgr-active {
                        position: absolute;
                        z-index:1;
                        outline: none;
                        background-color: hsl(0,0%,90%);
                        box-shadow: inset hsla(0,0%,15%,  1) 0  0px 0px 4px, /* border */
                        inset hsla(0,0%,15%, .8) 0 -1px 5px 4px, /* soft SD */
                        inset hsla(0,0%,0%, .25) 0 -1px 0px 7px, /* bottom SD */
                        inset hsla(0,0%,100%,.7) 0  2px 1px 7px, /* top HL */
                        hsla(0,0%, 0%,.15) 0 -5px 6px 4px, /* outer SD */
                        hsla(0,0%,100%,.5) 0  5px 6px 4px; /* outer HL */
                        transition: color .2s;
                    }

                    .${uniqClassName}-bgr-active {
                        color: hsl(210, 100%, 40%);
                        text-shadow: hsla(210,100%,20%,.3) 0 -1px 0, hsl(210,100%,85%) 0 2px 1px, hsla(200,100%,80%,1) 0 0 5px, hsla(210,100%,50%,.6) 0 0 20px;
                        box-shadow:
                            inset hsla(208, 79%, 28%,  1) 0  0px 0px 4px, /* border */
                            inset hsla(208,100%,15%, .4) 0 -1px 5px 4px, /* soft SD */
                            inset hsla(208,100%,20%,.25) 0 -1px 0px 7px, /* bottom SD */
                            inset hsla(208,100%,100%,.7) 0  2px 1px 7px, /* top HL */
                            hsla(208,100%,75%, .8) 0  0px 3px 2px, /* outer SD */
                            hsla(208,50%,40%, .25) 0 -5px 6px 4px, /* outer SD */
                            hsla(208,80%,95%,   1) 0  5px 6px 4px; /* outer HL */
                    }
                    .${uniqClassName}-rot {
                        position: absolute;
                        z-index: 2;
                        top: 7px;
                        left: 7px;
                        background-image: -webkit-radial-gradient(  50%   0%,  8% 50%, hsla(0,0%,100%,.5) 0%, hsla(0,0%,100%,0) 100%),
                        -webkit-radial-gradient(  50% 100%, 12% 50%, hsla(0,0%,100%,.6) 0%, hsla(0,0%,100%,0) 100%),
                        -webkit-radial-gradient(   0%  50%, 50%  7%, hsla(0,0%,100%,.5) 0%, hsla(0,0%,100%,0) 100%),
                        -webkit-radial-gradient( 100%  50%, 50%  5%, hsla(0,0%,100%,.5) 0%, hsla(0,0%,100%,0) 100%),
                        -webkit-repeating-radial-gradient( 50% 50%, 100% 100%, hsla(0,0%,  0%,0) 0%, hsla(0,0%,  0%,0)   3%, hsla(0,0%,  0%,.1) 3.5%),
                        -webkit-repeating-radial-gradient( 50% 50%, 100% 100%, hsla(0,0%,100%,0) 0%, hsla(0,0%,100%,0)   6%, hsla(0,0%,100%,.1) 7.5%),
                        -webkit-repeating-radial-gradient( 50% 50%, 100% 100%, hsla(0,0%,100%,0) 0%, hsla(0,0%,100%,0) 1.2%, hsla(0,0%,100%,.2) 2.2%),
                        -webkit-radial-gradient( 50% 50%, 200% 50%, hsla(0,0%,90%,1) 5%, hsla(0,0%,85%,1) 30%, hsla(0,0%,60%,1) 100%);
                    }
                    .${uniqClassName}-rot:before, .${uniqClassName}-rot:after {
                        content: "";
                        top: 0;
                        left: 0;
                        position: absolute;
                        width: inherit;
                        height: inherit;
                        border-radius: inherit;
                        /* fake conical gradients */
                        background-image: -webkit-radial-gradient(  50%   0%, 10% 50%, hsla(0,0%,0%,.1) 0%, hsla(0,0%,0%,0) 100%),
                        -webkit-radial-gradient(  50% 100%, 10% 50%, hsla(0,0%,0%,.1) 0%, hsla(0,0%,0%,0) 100%),
                        -webkit-radial-gradient(   0%  50%, 50% 10%, hsla(0,0%,0%,.1) 0%, hsla(0,0%,0%,0) 100%),
                        -webkit-radial-gradient( 100%  50%, 50% 06%, hsla(0,0%,0%,.1) 0%, hsla(0,0%,0%,0) 100%);
                    }
                    .${uniqClassName}-rot:before { transform: rotate( 65deg); }
                    .${uniqClassName}-rot:after { transform: rotate(-65deg); }

                    .${uniqClassName}-notch {
                        position: absolute;
                        width: 10px;
                        height: 10px;
                        background: black;
                        border-radius: 5px;
                        top: 5px;
                    }
                    .${uniqClassName}-text {
                        width: 100%;
                        text-align: center;
                        font-weight: bold;
                        position: absolute;
                        top: calc(50% - 0.6em);
                        user-select: none;
                        z-index: 3;
                        color: #262626;
                        text-shadow: -1px -1px 1px #111, 1px 1px 2px #fff;
                    }`}
          </style>
          <div
            style={{
              position: "relative",
              width: props.diameter,
              height: props.diameter,
              userSelect: "none",
              margin: `${glowSpacing / 2}px 0 0 ${glowSpacing / 2}px`,
            }}
          >
            <div
              className={`${uniqClassName}-rot`}
              style={{
                width: `${props.diameter - 14}px`,
                height: `${props.diameter - 14}px`,
                lineHeight: `${props.diameter - 14}px`,
                borderRadius: `${(props.diameter - 14) / 2}px`,
                transform: `rotate(${angle}deg)`,
              }}
            >
              <div
                className={`${uniqClassName}-notch`}
                style={{
                  left: `${(props.diameter - 24) / 2}px`,
                }}
              ></div>
            </div>
            <div
              className={`${uniqClassName}-text`}
              style={{
                fontSize: `${Math.ceil(props.diameter / 4)}px`,
              }}
            >
              {props.value}
            </div>
          </div>
        </>
      </Knob>
      {props.children}
    </SkinWrap>
  );
}
