import { memo } from "react";
import ReactMarkdown from "react-markdown";

const LinkRenderer = (props: any) => {
  return (
    <a
      href={props.href}
      target="_blank"
      className="text-accent1 hover:text-accent1-hover"
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

const TextNode = ({ data }: TextNodeProps) => {
  return (
    <div
      style={{
        minHeight: 100,
        minWidth: 100,
      }}
      className="prose relative max-w-full rounded-md border p-2 dark:prose-invert prose-headings:mb-0 prose-headings:mt-2 prose-p:mb-1 prose-p:mt-1 prose-p:first:mt-0 prose-ul:m-0 prose-li:m-0"
    >
      <ReactMarkdown className="break-words" components={{ a: LinkRenderer }}>
        {data.text || "Empty Text Node"}
      </ReactMarkdown>
    </div>
  );
};

export default memo(TextNode);
