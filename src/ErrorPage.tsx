import { Container, Button, Text, Title } from "@mantine/core";

type ErrorPageProps = {
  error: Error;
  resetErrorBoundary: () => void;
};

export const ErrorPage = ({ error, resetErrorBoundary }: ErrorPageProps) => {
  return (
    <Container size="sm">
      <Title align="center">Oops! Something went wrong.</Title>
      <Text align="center" style={{ marginTop: "1rem" }}>
        {error.message}
      </Text>
      <Button
        style={{ marginTop: "2rem" }}
        fullWidth
        onClick={resetErrorBoundary}
        variant="outline"
      >
        Try Again
      </Button>
    </Container>
  );
};
