import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faApple,
  faWindows,
  faLinux,
  type IconDefinition,
  faRaspberryPi,
  faChrome,
} from "@fortawesome/free-brands-svg-icons";
import { useEffect, useState } from "react";

type Distro = "mac" | "linux" | "windows" | "raspberry-pi" | "chromebook";

type Props = {
  distro: Distro;
  label?: string;
};

type GithubAPIResponse = {
  tag_name: string;
  assets: {
    // url: string;
    // id: number;
    // node_id: string;
    // name: string;
    // label: string;
    // uploader: {
    //   login: string;
    //   id: number;
    //   node_id: string;
    // };
    // content_type: string;
    // state: string;
    // size: number;
    // download_count: number;
    browser_download_url: string;
  }[];
};

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function getIcon(distro: Distro): IconDefinition {
  switch (distro) {
    case "mac":
      return faApple;
    case "linux":
      return faLinux;
    case "windows":
      return faWindows;
    case "raspberry-pi":
      return faRaspberryPi;
    case "chromebook":
      return faChrome;
  }
}

function getLink(distro: Distro, response: GithubAPIResponse): string {
  let link;
  switch (distro) {
    case "mac":
      link = response.assets.find((a) =>
        a.browser_download_url.endsWith(".dmg"),
      );
      break;
    case "linux":
      link = response.assets.find(
        (a) =>
          a.browser_download_url.endsWith(".AppImage") &&
          !a.browser_download_url.includes("arm"),
      );
      break;
    case "windows":
      link = response.assets.find((a) =>
        a.browser_download_url.endsWith(".exe"),
      );
      break;
    case "chromebook":
      link = response.assets.find((a) =>
        a.browser_download_url.endsWith("armv7l.deb"),
      );
      break;
    case "raspberry-pi":
      link = response.assets.find((a) =>
        a.browser_download_url.endsWith("arm64.deb"),
      );
      break;
  }

  if (link) {
    return link.browser_download_url;
  }
  return "";
}

const DownloadButton = ({ distro, label }: Props) => {
  const [data, setData] = useState<GithubAPIResponse | undefined>();

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(
        "https://api.github.com/repos/flojoy-ai/studio/releases/latest",
      );
      const jsonData = (await response.json()) as GithubAPIResponse;
      setData(jsonData);
    };

    fetchData();
  }, []);

  if (!data) {
    return null;
  }

  const link = getLink(distro, data);

  if (link === "") {
    return (
      <div className="not-content">
        <a
          href={"#"}
          className="not-content bg-accent-600 dark:bg-accent-200 flex cursor-not-allowed items-center justify-center gap-4 rounded p-4 text-lg text-gray-100 no-underline dark:text-gray-900"
        >
          <FontAwesomeIcon className="h-6 w-6" icon={getIcon(distro)} />{" "}
          Download for {label ?? capitalize(distro)} is currently not available
          :(
        </a>
      </div>
    );
  }

  return (
    <div className="not-content">
      <a
        href={link}
        target="_blank"
        className="not-content bg-accent-600 dark:bg-accent-200 flex items-center justify-center gap-4 rounded p-4 text-lg text-gray-100 no-underline dark:text-gray-900"
      >
        <FontAwesomeIcon className="h-6 w-6" icon={getIcon(distro)} /> Download
        for {label ?? capitalize(distro)} ({data.tag_name})
      </a>
    </div>
  );
};

export default DownloadButton;
