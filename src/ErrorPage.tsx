import { Container, Button, Text, Title } from "@mantine/core";

type ErrorPageProps = {
  error: Error;
  resetErrorBoundary: () => void;
};

export const ErrorPage = ({ error, resetErrorBoundary }: ErrorPageProps) => (
  <Container size="sm">
    <Title align="center">Oops! Something went wrong.</Title>
    <Button
      style={{ marginTop: "2rem" }}
      fullWidth
      onClick={resetErrorBoundary}
      variant="outline"
    >
      Try Again
    </Button>
    <Text align="center" style={{ marginTop: "1rem" }}>
      {error.message}
    </Text>
  </Container>
);
