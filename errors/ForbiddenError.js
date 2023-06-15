export default class ForbiddenError extends Error {
  constructor(message) {
    super(message);
    this.name = 'NotOwnerError';
    this.statusCode = 403;
  }
}
