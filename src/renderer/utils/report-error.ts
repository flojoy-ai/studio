import { HTTPError } from "ky";
import { Result } from "neverthrow";
import { toast } from "sonner";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";

export const toastQueryError = (
  e: HTTPError | ZodError,
  title: string = "Error while fetching",
) => {
  if (e instanceof ZodError) {
    toast.error("Validation error", {
      description: fromZodError(e).message,
    });
    console.error(e.message);
  } else {
    toast.error(title, {
      description: e.message,
    });
  }
};

export function toastResultPromise<T, E>(
  promise: Promise<Result<T, E>>,
  options: {
    loading: React.ReactNode;
    success: React.ReactNode | ((result: T) => React.ReactNode);
    error: React.ReactNode | ((result: E) => React.ReactNode);
  },
) {
  const { loading, success, error } = options;
  const toastId = toast.loading(loading);
  promise
    .then((result) => {
      result.match(
        (x) => {
          const message = typeof success === "function" ? success(x) : success;
          toast.success(message, { id: toastId });
        },
        (e) => {
          const message = typeof error === "function" ? error(e) : error;
          toast.error(message, { id: toastId });
        },
      );
    })
    .catch((err) => {
      toast.error(`Unexpected error: ${err}`, { id: toastId });
    });
}
