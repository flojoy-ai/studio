import { Button } from "./components/ui/button";

type ErrorPageProps = {
  error: Error;
  resetErrorBoundary: () => void;
};

export const ErrorPage = ({ error, resetErrorBoundary }: ErrorPageProps) => (
  <div className="mx-auto max-w-2xl">
    <h1 className="mt-8 text-center text-3xl font-bold">
      Oops! Something went wrong.
    </h1>
    <p className="mt-4 text-center">
      Note: if the error is a Validation error, then you should check if the
      manifest file is valid.
    </p>
    <Button
      className="mx-4 mt-4 w-full border-accent1 font-semibold text-accent1 hover:bg-accent1/40 hover:text-accent1"
      onClick={resetErrorBoundary}
      variant="outline"
    >
      Try Again
    </Button>
    <p className="mt-4 text-red-500">
      <p className="text-center">
        <b>{error.message}</b>
      </p>
      <pre>{error.stack}</pre>
    </p>
  </div>
);
