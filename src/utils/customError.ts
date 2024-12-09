class CustomError extends Error {
  public serverMessage?: string;
  public clientMessage: string;
  public statusCode: number;

  constructor(
    // undefined when server doesn't needs to know
    // unknown or string by default
    serverMessage: string | undefined | unknown,
    clientMessage: string = "Something Went Wrong",
    statusCode: number = 500,
  ) {
    super(typeof serverMessage === "string" ? serverMessage : clientMessage);

    this.serverMessage = typeof serverMessage === "string"
      ? serverMessage
      : undefined;
    this.clientMessage = clientMessage;
    this.statusCode = statusCode;

    Error.captureStackTrace(this, this.constructor);
  }
}

export default CustomError;
