import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faApple,
  faWindows,
  faLinux,
  faPython,
} from "@fortawesome/free-brands-svg-icons";

type Props = {
  distro: "mac" | "linux" | "windows";
  link: string;
  version: string;
};

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function getIcon(distro: string) {
  switch (distro) {
    case "mac":
      return faApple;
    case "linux":
      return faLinux;
    case "windows":
      return faWindows;
    default:
      // this casd should never be reached
      return faPython;
  }
}

const DownloadButton = ({ distro, link, version }: Props) => {
  return (
    <div className="not-content">
      <a
        href={link}
        target="_blank"
        className="not-content bg-accent-600 dark:bg-accent-200 flex items-center justify-center gap-4 rounded p-4 text-lg text-gray-100 no-underline dark:text-gray-900"
      >
        <FontAwesomeIcon className="h-6 w-6" icon={getIcon(distro)} /> Download
        for {capitalize(distro)} ({version})
      </a>
    </div>
  );
};

export default DownloadButton;
