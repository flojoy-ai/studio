import { memo, useEffect, useRef, useState } from "react";
import { textNodesAtom } from "@src/hooks/useFlowChartGraph";
import { useSetAtom } from "jotai";
import { useNodeId } from "reactflow";
import { Textarea } from "../ui/textarea";
import ReactMarkdown from "react-markdown";
import { toast } from "sonner";
import { Edit, Trash } from "lucide-react";
import { cn } from "@src/lib/utils";

const LinkRenderer = (props) => {
  const handleClick = () => {
    toast("Opening link in your browser...");
  };

  return (
    <a
      href={props.href}
      target="_blank"
      onClick={handleClick}
      className="hover:text-accent1"
    >
      {props.children}
    </a>
  );
};

type TextNodeProps = {
  selected: boolean;
  data: {
    text: string;
  };
};

const TextNode = ({ selected, data }: TextNodeProps) => {
  const [editing, setEditing] = useState(false);
  const setTextNodes = useSetAtom(textNodesAtom);
  const nodeId = useNodeId();
  const ref = useRef<HTMLTextAreaElement>(null);

  const handleChange = (e) => {
    e.preventDefault();
    e.target.style.height = "inherit";
    e.target.style.height = `${e.target.scrollHeight}px`;
    setTextNodes((prev) =>
      prev.map((n) =>
        n.id === nodeId
          ? {
              ...n,
              data: {
                ...n.data,
                text: e.target.value,
              },
            }
          : n,
      ),
    );
  };

  const handleDelete = () => {
    setTextNodes((prev) => prev.filter((n) => n.id !== nodeId));
  };

  useEffect(() => {
    if (!selected) {
      setEditing(false);
    }
  }, [selected]);

  useEffect(() => {
    if (editing && ref.current) {
      ref.current.style.height = "inherit";
      ref.current.style.height = `${ref.current.scrollHeight}px`;
    }
  }, [editing]);

  return editing ? (
    <Textarea
      className="nodrag w-72 overflow-hidden"
      ref={ref}
      placeholder="Enter text here"
      value={data.text}
      onChange={handleChange}
      onKeyDown={(e) => e.stopPropagation()}
    />
  ) : (
    <div className="prose relative w-72 rounded-md border p-2 dark:prose-invert prose-headings:mb-0 prose-headings:mt-3 prose-p:mt-1 prose-p:first:mt-2">
      <div
        className={cn("absolute top-1 flex h-2 w-full justify-between", {
          hidden: !selected,
        })}
      >
        <div onClick={() => setEditing(true)}>
          <Edit className="stroke-muted-foreground" size={20} />
        </div>
        <div className="mr-3" onClick={handleDelete}>
          <Trash className="stroke-muted-foreground" size={20} />
        </div>
      </div>
      <ReactMarkdown components={{ a: LinkRenderer }}>
        {data.text || "Empty Text Node"}
      </ReactMarkdown>
    </div>
  );
};

export default memo(TextNode);
