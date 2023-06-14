export default class UnauthorizedError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 401;
  }
}

// const UnauthorizedError = new UnauthorizedErrorClass();

// export default UnauthorizedError;
