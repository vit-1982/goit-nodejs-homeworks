exports.UnauthorizedError = class UnauthorizedError extends (
  Error
) {
  constructor(message) {
    super(message);
    this.status = 401;
    this.stack = "";
  }
};

exports.ValidationError = class ValidationError extends (
  Error
) {
  constructor(message) {
    super(message);
    this.status = 400;
    this.stack = "";
  }
};

exports.ConflictError = class ConflictError extends (
  Error
) {
  constructor(message) {
    super(message);
    this.status = 409;
    this.stack = "";
  }
};

exports.NotFoundError = class NotFoundError extends (
  Error
) {
  constructor(message) {
    super(message);
    this.status = 404;
    this.stack = "";
  }
};
