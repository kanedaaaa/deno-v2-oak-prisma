class CustomError extends Error {
  public serverMessage?: string;
  public clientMessage: string;
  public statusCode: number;

  constructor(
    serverMessage: string | undefined = undefined,
    clientMessage: string = "Something Went Wrong",
    statusCode: number = 500,
  ) {
    // Use clientMessage as the base error message if serverMessage is not a string
    super(serverMessage || clientMessage);

    // Ensure type safety
    this.serverMessage = serverMessage;
    this.clientMessage = clientMessage;
    this.statusCode = statusCode;

    // Maintain prototype chain for proper instanceof checks
    Object.setPrototypeOf(this, CustomError.prototype);

    // Capture stack trace
    Error.captureStackTrace(this, this.constructor);
  }
}

export default CustomError;
