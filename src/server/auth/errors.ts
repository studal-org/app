export abstract class AuthError extends Error {
  constructor(message: string) {
    super(message);
  }
}

export class InvalidPayloadError extends AuthError {
  constructor() {
    super("Invalid session token payload");
  }
}

export class NotFoundError extends AuthError {
  constructor() {
    super("Session token not found");
  }
}

export class NotPresentError extends AuthError {
  constructor() {
    super("Session token not present");
  }
}
