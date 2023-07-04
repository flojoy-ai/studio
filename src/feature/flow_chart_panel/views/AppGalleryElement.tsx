import { memo } from "react";
import { createStyles, Image, Flex, Button } from "@mantine/core";
import { create } from "domain";

interface Element{
  linkText: string,
  link: string,
  elementTitle: string,
  imagePath: string,
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
}));
export const AppGalleryElement = ( {
  linkText,
  link, 
  elementTitle,
  imagePath } : Element
) => {
  const { classes } = AppGalleryElementStyles();
  return (
    <Flex className={classes.elementLayout}>
      <Image
        height={120}
        width={200}
        src={imagePath}
        alt="With custom placeholder"
      />
      <h4 className={classes.elementTitle}>{elementTitle}</h4>
      <a href={link} className={classes.link}>
        {linkText}
      </a>
    </Flex>
  );
};