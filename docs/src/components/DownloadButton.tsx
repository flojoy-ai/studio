import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faApple,
  faWindows,
  faLinux,
} from "@fortawesome/free-brands-svg-icons";
import { useEffect, useState } from "react";

type Distro = "mac" | "linux" | "windows";

type Props = {
  distro: Distro;
};

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function getIcon(distro: Distro) {
  switch (distro) {
    case "mac":
      return faApple;
    case "linux":
      return faLinux;
    case "windows":
      return faWindows;
  }
}

function getLink(distro: Distro, tagName: string): string {
  const version = tagName.slice(1);
  const baseLink =
    "https://github.com/flojoy-ai/studio/releases/download/v" + version;

  switch (distro) {
    case "mac":
      return baseLink + "Flojoy-Studio-" + version + "-universal.dmg";
    case "linux":
      return baseLink + "Flojoy-Studio-" + version + ".AppImage";
    case "windows":
      return baseLink + "Flojoy-Studio-Setup-" + version + ".exe";
  }
}
const DownloadButton = ({ distro }: Props) => {
  const [data, setData] = useState<{ tag_name: string } | undefined>();

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(
        "https://api.github.com/repos/flojoy-ai/studio/releases/latest",
      );
      const jsonData = (await response.json()) as { tag_name: string };
      setData(jsonData);
    };

    fetchData();
  }, []);

  if (!data) {
    return null;
  }

  return (
    <div className="not-content">
      <a
        href={getLink(distro, data.tag_name)}
        target="_blank"
        className="not-content bg-accent-600 dark:bg-accent-200 flex items-center justify-center gap-4 rounded p-4 text-lg text-gray-100 no-underline dark:text-gray-900"
      >
        <FontAwesomeIcon className="h-6 w-6" icon={getIcon(distro)} /> Download
        for {capitalize(distro)} ({data.tag_name})
      </a>
    </div>
  );
};

export default DownloadButton;
