import clsx from "clsx";
import ReactMarkdown from "react-markdown";

type MarkDownTextProps = {
  text: string;
  isThumbnail?: boolean;
  containerClassName?: string;
  markDownclassName?: string;
};
const MarkDown = ({
  text,
  isThumbnail,
  containerClassName,
  markDownclassName,
}: MarkDownTextProps) => {
  return (
    <div
      className={clsx(
        { "h-72 w-96 overflow-hidden": isThumbnail },
        "p-6",
        containerClassName,
      )}
    >
      <ReactMarkdown skipHtml className={markDownclassName}>
        {text}
      </ReactMarkdown>
    </div>
  );
};

export default MarkDown;
