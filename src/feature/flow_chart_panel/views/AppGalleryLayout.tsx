import { createStyles, Box } from "@mantine/core";
import {
  AppGalleryElement,
  AppGalleryElementProps,
} from "@feature/flow_chart_panel/views/AppGalleryElement";
import { AppGalleryData } from "@src/utils/appGallery";
import { AppGallerySearch } from "@feature/flow_chart_panel/views/AppGallerySearch";

const useStyles = createStyles((theme) => ({
  categoryElement: {
    display: "flex",
    paddingLeft: "2%",
    marginBottom: "10%",
    marginRight: "2%",
    paddingTop: "1%",
    gap: 12,
  },
  subjectTitle: {
    paddingLeft: "2%",
  },
}));

export const AppGalleryLayout = ({
  subjectKey,
  topKey,
}: {
  subjectKey: string;
  topKey: number;
}) => {
  const { classes } = useStyles();
  const subjectName = {
    fundamentals: "Fundamentals",
    AI: "AI/ML",
    IO: "I/O",
    DSP: "Digital signal processing & simulation",
  };
  const elements: AppGalleryElementProps[] = AppGalleryData[subjectKey];

  return (
    <div>
      <h3 class="pl-10 pt-3">{subjectName[subjectKey]}</h3>
      <div class="mb-10 mr-10 flex gap-7 pl-10 pt-5">
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
