type InstrumentThumbnailProps = {
  children: string;
  path: string;
  img: string;
  sectionSubRoot: string;
};

export default function InstrumentThumbnail({
  children,
  path,
  img,
}: InstrumentThumbnailProps) {
  // Variables used in thumbnail display

  const thumbnailPath = "examples/EX1/output.jpeg"; // Default thumbnail path is autogenerated app
  let nodeLabel = path.split("/").pop() ?? ""; // Caption beneath thumbnail

  const pathRoot = "instruments-database"; // Whether the thumbnail is for a node or instrument page
  const DEFAULT_IMAGE_THUMBNAIL =
    "https://res.cloudinary.com/dhopxs1y3/image/upload/w_300/q_auto/v1696619530/node_thumbnails/DEFAULT_THUMBNAIL_p2vqkw.jpg";

  const imgSrc =
    typeof img === "string"
      ? img
      : `https://raw.githubusercontent.com/flojoy-ai/docs/main/docs/nodes/${path}/${thumbnailPath}`;

  const thumbnailClass = "instrument-thumbnail";

  // Clean up the thumbnail caption and path prior to display
  nodeLabel = nodeLabel.replaceAll("_", " ").replaceAll("-", " ").toUpperCase();

  return (
    <div className="thumbnail-wrapper">
      <a href={`/${pathRoot}/${path}/`}>
        <>
          <div className={`thumbnail-wrapper-figure ${thumbnailClass}`}>
            <img
              alt={children}
              src={imgSrc}
              onError={(event) => {
                event.currentTarget.src = DEFAULT_IMAGE_THUMBNAIL;
                event.currentTarget.style.transform = "scale(1)";
                event.currentTarget.onerror = null;
              }}
            />
          </div>
          <div className="figcaption">{nodeLabel}</div>
        </>
      </a>
    </div>
  );
}
