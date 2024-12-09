class CustomError extends Error {
  public serverMessage?: string;
  public clientMessage: string;
  public statusCode: number;

  constructor(
    serverMessage: string | undefined = undefined,
    clientMessage: string = "Something Went Wrong",
    statusCode: number = 500,
  ) {
    super(serverMessage || clientMessage);
    this.serverMessage = serverMessage;
    this.clientMessage = clientMessage;
    this.statusCode = statusCode;
    Object.setPrototypeOf(this, CustomError.prototype);
    Error.captureStackTrace(this, this.constructor);
  }
}

export default CustomError;
