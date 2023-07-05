import { createStyles, Box } from "@mantine/core";
import { AppGalleryElement } from "@feature/flow_chart_panel/views/AppGalleryElement";

const useStyles = createStyles((theme) => ({
  categoryElement: {
    display: "flex",
    paddingLeft: "2%",
    marginBottom: "10%",
    marginRight: "2%",
  },
  subjectTitle: {
    paddingLeft: "2%",
  },
}));

export const AppGalleryLayout = ({ subject }: { subject: string }) => {
  const { classes } = useStyles();
  return (
    <div>
      <h3 className={classes.subjectTitle}>{subject}</h3>
      <Box className={classes.categoryElement}>
        <AppGalleryElement
          elementTitle="Intro to LOOPS"
          linkText="Generate a random number once"
          link="https://www.google.ca"
          imagePath="./images/test.jpg"
        />
        <AppGalleryElement
          elementTitle="Intro into Signals"
          linkText="Generate waveforms of different shapes"
          link="https://www.google.ca"
          imagePath="./images/test.jpg"
        />
      </Box>
    </div>
  );
};
