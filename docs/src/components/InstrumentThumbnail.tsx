type InstrumentThumbnailProps = {
  path: string;
  img: string;
  sectionSubRoot: string;
  label: string;
};

export default function InstrumentThumbnail({
  label,
  path,
  img,
}: InstrumentThumbnailProps) {
  return (
    <div className="p-4">
      <a href={`/instruments-database/${path}/`}>
        <img
          className="mr-3 !h-52 w-48 object-scale-down"
          alt={label}
          src={img}
        />
        <p>{label}</p>
      </a>
    </div>
  );
}
