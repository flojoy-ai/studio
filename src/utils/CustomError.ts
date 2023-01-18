interface CustomErrorProps {
  statusCode: number;
  statusMessage: string;
}

export class CustomError extends Error {
  private data: CustomErrorProps;
  constructor(data: CustomErrorProps, ...params) {
    super(...params);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, CustomError);
    }

    this.name = "CustomError";
    this.data = data;
    Object.setPrototypeOf(this, CustomError.prototype);
  }
}
