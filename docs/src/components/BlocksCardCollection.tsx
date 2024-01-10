import BlocksCard from "./BlocksCard";

type BlocksCardCollectionProps = {
  blocks: {
    path: string;
    docs: string;
  }[];
};

function BlocksCardCollection({ blocks }: BlocksCardCollectionProps) {
  return (
    <section className={`grid grid-cols-1 gap-8 lg:grid-cols-2`}>
      {blocks.map((block) => {
        const blockPath = block.path;

        const blockID = blockPath.split("/").slice(-1).toString();

        const content =
          block.docs ?? "❗ This node has no docstring description yet.";

        const blockPageLink = "/blocks/" + blockPath.replaceAll("_", "-");

        let emoji = "📻";

        if (blockPath.includes("PROTOCOLS")) {
          emoji = "📄";
        } else if (blockPath.includes("MOTION")) {
          emoji = "🛞";
        } else if (blockPath.includes("OSCILLOSCOPES")) {
          emoji = "📟";
        }

        return (
          <BlocksCard
            key={block.path}
            title={blockID.replaceAll("_", " ")}
            link={blockPageLink}
            emoji={emoji}
            content={content}
          />
        );
      })}
    </section>
  );
}

export default BlocksCardCollection;
