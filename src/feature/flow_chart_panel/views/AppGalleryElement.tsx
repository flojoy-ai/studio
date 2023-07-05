import { createStyles, Image, Flex, UnstyledButton } from "@mantine/core";
import { IconBrandYoutube } from "@tabler/icons-react";

export interface AppGalleryElementProps {
  linkText: string;
  link: string;
  elementTitle: string;
  imagePath: string;
  youtubeLink?: string;
}

export const AppGalleryElementStyles = createStyles((theme) => ({
  elementTitle: { marginBottom: 0 },
  link: {},
  elementLayout: {
    mih: 50,
    gap: "md",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    flexDirection: "column",
    flexWrap: "wrap",
  },
  image: {
    height: 120,
    width: 200,
  },
  textLine: {
    display: "flex",
  },
}));
export const AppGalleryElement = ({
  linkText,
  link,
  elementTitle,
  imagePath,
  youtubeLink = "https://www.youtube.com",
}: AppGalleryElementProps) => {
  const { classes } = AppGalleryElementStyles();
  return (
    <Flex className={classes.elementLayout}>
      <Image height={120} width={200} fit="contain" src={imagePath} />
      <div className={classes.textLine}>
        <h4 className={classes.elementTitle}>{elementTitle}</h4>
        <UnstyledButton
          component="a"
          target="_blank"
          href={youtubeLink}
          style={{ paddingLeft: "4%" }}
        >
          <IconBrandYoutube />
        </UnstyledButton>
      </div>
      <a href={link} className={classes.link}>
        {linkText}
      </a>
    </Flex>
  );
};
