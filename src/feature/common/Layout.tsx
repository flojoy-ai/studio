import Header from "./Header";
import ServerStatus from "./ServerStatus";
import { useSocket } from "@src/hooks/useSocket";
import { Box } from "@mantine/core";
import { ProjectName } from "./ProjectName";
import { Flex } from "@mantine/core";

type LayoutProps = {
  children: React.ReactNode;
};

export const Layout = ({ children }: LayoutProps) => {
  const {
    states: { serverStatus },
  } = useSocket();

  return (
    <Box px={30} pos="relative">
      {/* The ServerStatus takes 30px */}
      <Box py={10}>
        <Box pos="absolute" left={42}>
          <ProjectName />
        </Box>
        <ServerStatus serverStatus={serverStatus} />
      </Box>
      {/* The ServerStatus takes 70px */}
      <Header />
      <main style={{ minHeight: "calc(100vh - 170px)" }}>{children}</main>
    </Box>
  );
};
