type BlockCardProps = {
  link: string;
  title: string;
  emoji: string;
  content: string;
};

export default function BlockCard({
  link,
  content,
  emoji,
  title,
}: BlockCardProps) {
  return (
    <a
      className="flex flex-col gap-2 rounded-2xl border-4 border-modal p-8 text-black no-underline transition duration-300 hover:bg-accent2/10 hover:no-underline dark:text-white"
      href={link.toLowerCase()}
    >
      <h4>
        {emoji} {title}
      </h4>
      <p>{content}</p>
    </a>
  );
}
