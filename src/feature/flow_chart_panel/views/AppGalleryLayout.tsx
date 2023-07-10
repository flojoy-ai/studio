import { createStyles, Box } from "@mantine/core";
import {
  AppGalleryElement,
  AppGalleryElementProps,
} from "@feature/flow_chart_panel/views/AppGalleryElement";
import { AppGalleryData, GalleryData } from "@src/utils/appGallery";

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
  subject,
  topKey,
}: {
  subject: string;
  topKey: number;
}) => {
  const { classes } = useStyles();
  const subjectKey = {
    fundamentals: "Fundamentals",
    AI: "AI/ML",
    IO: "I/O",
    DSP: "Digital signal processing & simulation",
  };
  const elements: AppGalleryElementProps[] = AppGalleryData[subject];
  return (
    <div>
      <h3 className={classes.subjectTitle}>{subjectKey[subject]}</h3>
      <Box className={classes.categoryElement}>
        {elements.map((element, key) => {
          return (
            <AppGalleryElement
              key={key + topKey * 10}
              linkText={element.linkText}
              link={element.link}
              elementTitle={element.elementTitle}
              imagePath={element.imagePath}
            />
          );
        })}
      </Box>
    </div>
  );
};
