import { memo } from "react";
import {
  createStyles,
  Image,
  Flex,
  UnstyledButton,
  Button,
} from "@mantine/core";
import { create } from "domain";
import { IconBrandYoutube } from "@tabler/icons-react";

interface Element {
  linkText: string;
  link: string;
  elementTitle: string;
  imagePath: string;
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
    alt: "With custom placeholder",
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
}: Element) => {
  const { classes } = AppGalleryElementStyles();
  return (
    <Flex className={classes.elementLayout}>
      <Image className={classes.image} src={imagePath} />
      <div className={classes.textLine}>
        <h4 className={classes.elementTitle}>{elementTitle}</h4>
        <UnstyledButton
          component="a"
          target="_blank"
          href="https://www.youtube.com"
          style={{ paddingLeft: "4%" }}
        >
          <IconBrandYoutube></IconBrandYoutube>
        </UnstyledButton>
      </div>
      <a href={link} className={classes.link}>
        {linkText}
      </a>
    </Flex>
  );
};
