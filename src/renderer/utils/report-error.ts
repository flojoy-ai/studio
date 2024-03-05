import { HTTPError } from "ky";
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
