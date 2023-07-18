import {
  useState,
  useRef,
  Children,
  cloneElement,
  isValidElement,
} from "react";
import { createPortal } from "react-dom";
import { twMerge } from "tailwind-merge";

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
    timeoutRef.current = setTimeout(() => {
      setTooltipOpen(true);
    }, 150);
  };

  const onLeave = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
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
      {cloneElement<any>(child, {
        ref: elemRef,
        onMouseEnter: onHover,
        onMouseLeave: onLeave,
      })}
      {elemRef.current
        ? createPortal(
            <div
              className={twMerge(
                "pointer-events-none absolute z-50 h-fit w-64 rounded-lg border bg-modal p-4 text-left text-sm font-normal text-foreground shadow-md transition-opacity duration-150",
                tooltipOpen ? "opacity-100" : "opacity-0"
              )}
              style={{
                left: elemRef.current.getBoundingClientRect().left + offsetX,
                top: elemRef.current.getBoundingClientRect().top + offsetY,
              }}
            >
              <div className="whitespace-nowrap text-lg font-medium">
                {param.name}{" "}
                <span className="text-sm font-normal text-foreground/60">
                  {annotation}
                </span>
              </div>
              {param.type.split("|").map((t, i) => (
                <code key={i}>
                  {t}
                  <br />
                </code>
              ))}
              <div className="py-2" />
              <div>{param.desc ?? "No description."}</div>
            </div>,
            document.getElementById("tw-theme-root") ?? document.body
          )
        : null}
    </>
  );
};
