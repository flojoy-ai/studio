import {
  useState,
  useRef,
  Children,
  cloneElement,
  isValidElement,
} from "react";
import { createPortal } from "react-dom";
import clsx from "clsx";

type ParamTooltipProps = {
  children: React.ReactNode;
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
  element: HTMLDivElement,
  offsetX: number,
  offsetY: number,
) => {
  const TOOLTIP_WIDTH = 264; // average tooltip width
  const { top, left, right } = element.getBoundingClientRect();
  if (left < window.innerWidth / 2) {
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
  const elemRef = useRef<HTMLDivElement>(null);

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

  const child = Children.only(children);

  if (!isValidElement(child)) {
    throw new Error("Child must be a valid JSX element");
  }

  return (
    <>
      {cloneElement<unknown>(child, {
        ref: elemRef,
        onMouseEnter: onHover,
        onMouseLeave: onLeave,
      })}
      {elemRef.current
        ? createPortal(
            <div
              className={clsx(
                "pointer-events-none absolute z-50 h-fit w-64 rounded-lg border bg-modal p-4 text-left font-sans text-sm font-normal text-foreground opacity-0 shadow-md transition-opacity duration-150 hover:pointer-events-auto hover:opacity-100",
                { "!pointer-events-auto opacity-100": tooltipOpen },
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
              <div>
                {param.desc?.split("\n").map((line) => (
                  <span key={line}>
                    {line}
                    <br />
                  </span>
                )) ?? "No description."}
              </div>
            </div>,
            document.getElementById("tw-theme-root") ?? document.body,
          )
        : null}
    </>
  );
};
