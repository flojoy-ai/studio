import { memo, useEffect, useRef, useState } from "react";
import { textNodesAtom } from "@src/hooks/useFlowChartGraph";
import { useSetAtom } from "jotai";
import { useNodeId, NodeResizer, NodeProps, useStore } from "reactflow";
import { Textarea } from "../ui/textarea";
import ReactMarkdown from "react-markdown";
import { toast } from "sonner";
import { Edit, Trash } from "lucide-react";
import { cn } from "@src/lib/utils";
import { TextData } from "@src/types/node";

const LinkRenderer = (props) => {
  const handleClick = () => {
    toast("Opening link in your browser...");
  };

  return (
    <a
      href={props.href}
      target="_blank"
      onClick={handleClick}
      className="text-accent1 hover:text-accent1-hover"
    >
      {props.children}
    </a>
  );
};

const TextNode = ({ selected, data, id }: NodeProps<TextData>) => {
  const [editing, setEditing] = useState(false);
  const size = useStore((s) => {
    const node = s.nodeInternals.get(id);
    if (!node) {
      throw new Error(`Could not find text node with id ${id}`);
    }
    return {
      width: node.width,
      height: node.height,
    };
  });
  const [dimensions, setDimensions] = useState({
    width: size.width ?? 200,
    height: size.height ?? 150,
  });
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

  return (
    <>
      <NodeResizer
        minWidth={100}
        minHeight={100}
        isVisible={editing}
        onResize={(_, params) =>
          setDimensions({ width: params.width, height: params.height })
        }
      />
      {editing ? (
        <Textarea
          className="nodrag overflow-hidden"
          style={{
            height: dimensions.height,
            width: dimensions.width,
          }}
          ref={ref}
          placeholder="Enter text here"
          value={data.text}
          onChange={handleChange}
          onKeyDown={(e) => e.stopPropagation()}
        />
      ) : (
        <div onDoubleClick={() => setEditing(true)}>
          <div
            style={{
              minHeight: 100,
              minWidth: 100,
              height: dimensions.height,
              width: dimensions.width,
            }}
            className="prose relative max-w-full rounded-md border p-2 dark:prose-invert prose-headings:mb-0 prose-headings:mt-2 prose-p:mb-1 prose-p:mt-1 prose-p:first:mt-0 prose-ul:m-0 prose-li:m-0"
          >
            <div
              className={cn("absolute -top-8 flex h-0 w-full justify-between", {
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
            <ReactMarkdown
              className="break-words"
              components={{ a: LinkRenderer }}
            >
              {data.text || "Empty Text Node"}
            </ReactMarkdown>
          </div>
        </div>
      )}
    </>
  );
};

export default memo(TextNode);
