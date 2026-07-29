const messages: Record<string, string> = {
  AliasExistsException: "An account with this email already exists.",
  CodeMismatchException: "The confirmation code is incorrect.",
  ExpiredCodeException: "That confirmation code has expired. Request a new one.",
  InvalidPasswordException:
    "The password does not meet the Cognito password requirements.",
  LimitExceededException: "Too many attempts. Please wait and try again.",
  NotAuthorizedException: "The email or password is incorrect.",
  PasswordResetRequiredException:
    "You must reset your password before signing in.",
  TooManyFailedAttemptsException:
    "Too many failed attempts. Please wait and try again.",
  TooManyRequestsException: "Too many requests. Please wait and try again.",
  UserAlreadyAuthenticatedException: "You are already signed in.",
  UserNotConfirmedException: "Confirm your email before signing in.",
  UsernameExistsException: "An account with this email already exists.",
};

export function getAuthErrorMessage(error: unknown) {
  if (error instanceof Error) {
    if (messages[error.name]) {
      return messages[error.name];
    }

    if (
      error.message.startsWith("Authentication is not configured") ||
      error.message === "Google sign-in is not enabled."
    ) {
      return error.message;
    }
  }

  return "We could not complete that request. Please try again.";
}
