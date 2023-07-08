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
  elementTitle: { display: "flex", marginBottom: 0, gap: "2vw" },
  link: { textDecoration: "none" },
  elementLayout: {
    mih: 50,
    gap: "md",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    flexDirection: "column",
    flexWrap: "wrap",
    textAlign: "left",
  },
  image: {
    height: 120,
    width: 200,
    position: "absolute",
    float: "left",
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
    <UnstyledButton>
      <Flex className={classes.elementLayout}>
        <Image height={120} width={200} fit="contain" src={imagePath} />
        <div className={classes.textLine}>
          <h4 className={classes.elementTitle}>
            {elementTitle}
            <div>
              <UnstyledButton
                component="a"
                target="_blank"
                href={youtubeLink}
                style={{ height: 0 }}
              >
                <IconBrandYoutube />
              </UnstyledButton>
            </div>
          </h4>
        </div>
        <a href={link} className={classes.link}>
          {linkText}
        </a>
      </Flex>
    </UnstyledButton>
  );
};
