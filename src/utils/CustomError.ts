interface CustomErrorProps {
  statusCode: number;
  statusText: string;
}

export class CustomError extends Error {
  private data: CustomErrorProps;
  constructor(data: CustomErrorProps, ...params:any) {
    super(...params);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, CustomError);
    }

    this.name = "CustomError";
    this.data = data;
    Object.setPrototypeOf(this, CustomError.prototype);
  }
}
