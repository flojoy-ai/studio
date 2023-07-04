import { memo } from "react";
import { createStyles, Image, Flex, Button } from "@mantine/core";

const AppGalleryElement = () => {
  return (
    <Flex
      mih={50}
      gap="md"
      justify="flex-start"
      align="flex-start"
      direction="column"
      wrap="wrap"
    >
      <Image
        height={120}
        width={200}
        src="42.png"
        alt="With custom placeholder"
      />
      <h4>Intro to LOOPS</h4>
      <a href="google.ca">google</a>
    </Flex>
  );
};

export default memo(AppGalleryElement);
