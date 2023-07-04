import { memo } from "react";
import { createStyles, Image, Flex, Button } from "@mantine/core";

const AppGalleryElement = () => {
  return (
    <Flex
      mih={50}
      bg="rgba(0, 0, 0, .3)"
      gap="md"
      justify="flex-start"
      align="flex-start"
      direction="column"
      wrap="wrap"
    >
      <Button> Button 1 </Button>
      <Button> Button 2 </Button>
    </Flex>
  );
};

export default memo(AppGalleryElement);
