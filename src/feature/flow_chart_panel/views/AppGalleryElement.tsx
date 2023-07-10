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
  elementTitle: {
    display: "flex",
    marginBottom: 0,
    marginLeft: 3,
    width: "8.3vw",
  },
  link: {
    textDecoration: "none",
    width: "8.5vw",
    marginLeft: 3,
  },
  elementLayout: {
    mih: 50,
    width: "8.5vw",
    flexWrap: "wrap",
    textAlign: "left",
  },
  icon: {
    marginLeft: "auto",
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
      <Image height={120} width={"8.5vw"} fit="contain" src={imagePath} />
      <h4 className={classes.elementTitle}>
        {elementTitle}
        <div className={classes.icon}>
          <UnstyledButton component="a" target="_blank" href={youtubeLink}>
            <IconBrandYoutube />
          </UnstyledButton>
        </div>
      </h4>
      <a href={link} className={classes.link}>
        {linkText}
      </a>
    </Flex>
  );
};
