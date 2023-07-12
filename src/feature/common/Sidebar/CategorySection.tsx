import {UnstyledButton, Group, Box} from "@mantine/core";
import { useEffect, useState } from 'react';

type CategorySectionProps = {}
const CategorySection = ({}:CategorySectionProps) => {

    const [opened, setOpened] = useState(false);
    const { classes, theme } = useSidebarStyles();
    const ChevronIcon = theme.dir === "ltr" ? IconChevronRight : IconChevronLeft;
  
    useEffect(() => {
      setOpened(true);
    }, [expand]);
  
    useEffect(() => {
      setOpened(false);
    }, [collapse]);
  
    if (Children.toArray(children).every((child) => child === null)) {
      return null;
    }

    return(
    <UnstyledButton
      onClick={() => setOpened((o) => !o)}
      className={classes.control}
      data-cy="sidebar-section-btn"
    >
      <Group position="apart" spacing={0}>
        <Box sx={{ display: "flex", alignItems: "center"}}>
          <Box ml="md">
          </Box>
        </Box>
        <ChevronIcon
          className={classes.chevron}
          size={14}
          stroke="1.5"
          style={{
            transform: opened
              ? `rotate(${theme.dir === "rtl" ? -90 : 90}deg)`
              : "none",
          }}
        />
      </Group>
    </UnstyledButton>
    );
};
export default CategorySection;