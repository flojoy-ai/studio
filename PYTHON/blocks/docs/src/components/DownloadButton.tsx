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
        className="not-content no-underline p-4 rounded bg-accent-600 dark:bg-accent-200 text-gray-100 dark:text-gray-900 items-center flex justify-center gap-4 text-lg"
      >
        <FontAwesomeIcon className="w-6 h-6" icon={getIcon(distro)} /> Download
        for {capitalize(distro)} ({version})
      </a>
    </div>
  );
};

export default DownloadButton;
