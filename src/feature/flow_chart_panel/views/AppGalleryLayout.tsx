import {
  AppGalleryElement,
  AppGalleryElementProps,
} from "@feature/flow_chart_panel/views/AppGalleryElement";
import { AppGalleryData } from "@src/utils/appGallery";

export const AppGalleryLayout = ({
  subjectKey,
  topKey,
}: {
  subjectKey: string;
  topKey: number;
}) => {
  const subjectName = {
    fundamentals: "Fundamentals",
    AI: "AI/ML",
    IO: "I/O",
    DSP: "Digital signal processing & simulation",
  };
  const elements: AppGalleryElementProps[] = AppGalleryData[subjectKey];

  return (
    <div>
      <h3 className="pl-10 pt-3">{subjectName[subjectKey]}</h3>
      <div className="mb-10 mr-10 flex gap-5 pl-10 pt-5">
        {elements.map((element, key) => {
          return (
            <AppGalleryElement
              key={key + topKey * 10}
              linkText={element.linkText}
              link={element.link}
              elementTitle={element.elementTitle}
              imagePath={element.imagePath}
              appPath={element.appPath}
            />
          );
        })}
      </div>
    </div>
  );
};
