import React, {
  useState,
  useRef,
  Children,
  cloneElement,
  isValidElement
} from "react";
import { createPortal } from "react-dom";
import clsx from "clsx";
import { ScrollArea } from "../ui/scroll-area";


type ElementProps = React.HTMLProps<HTMLElement>

type ParamTooltipProps = {
  children: React.ReactElement<ElementProps>;
  param: {
    name: string;
    type: string;
    desc: string | null;
  };
  annotation?: string;
  offsetX: number;
  offsetY: number;
};

const getTooltipStyle = (
  element: HTMLElement,
  offsetX: number,
  offsetY: number,
) => {
  const TOOLTIP_WIDTH = 264; // average tooltip width
  const { top, left, right } = element.getBoundingClientRect();
  if (left < window.innerWidth * 0.4) {
    return { left: right + offsetX, top: top + offsetY };
  } else {
    return { left: left - TOOLTIP_WIDTH - offsetX, top: top + offsetY };
  }
};

export const ParamTooltip = ({
  children,
  param,
  annotation,
  offsetX = 0,
  offsetY = 0,
}: ParamTooltipProps) => {
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const elemRef = useRef<HTMLElement>(null);

  const onHover = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      setTooltipOpen(true);
    }, 150);
  };

  const onLeave = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      setTooltipOpen(false);
    }, 500);
  };

  if (!children) {
    throw new Error("ParamTooltip must have a child element");
  }

  const child = Children.only<React.ReactNode>(children);

  if (!isValidElement(child)) {
    throw new Error("Child must be a valid JSX element");
  }

  return (
    <>
      {cloneElement(children, {
        ref: elemRef,
        onMouseEnter: onHover,
        onMouseLeave: onLeave,
      })}
      {elemRef.current
        ? createPortal(
            <div
              className={clsx(
                "absolute z-50 w-64 overflow-y-auto rounded-lg border bg-modal p-4 text-left font-sans text-sm font-normal text-foreground opacity-0 shadow-md transition-opacity duration-150 hover:pointer-events-auto hover:opacity-100",
                tooltipOpen
                  ? "pointer-events-auto opacity-100"
                  : "pointer-events-none opacity-0",
              )}
              style={getTooltipStyle(elemRef.current, offsetX, offsetY)}
            >
              <div className="whitespace-nowrap text-lg font-medium">
                {param.name}{" "}
                <span className="text-sm font-normal text-foreground/60">
                  {annotation}
                </span>
              </div>
              {param.type.split("|").map((t) => (
                <code key={t}>
                  {t}
                  <br />
                </code>
              ))}
              <div className="py-2" />
              <ScrollArea>
                <div className="max-h-32">
                  {param.desc?.split("\n").map((line) => (
                    <span key={line}>
                      {line}
                      <br />
                    </span>
                  )) ?? "No description."}
                </div>
              </ScrollArea>
            </div>,
            document.getElementById("flow-chart-area") ?? document.body,
          )
        : null}
    </>
  );
};
