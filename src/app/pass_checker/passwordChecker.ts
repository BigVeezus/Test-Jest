export enum PasswordErrors {
  SHORT = "Password is too short",
  NO_UPPER_CASE = "Upper case letter required!",
  NO_LOWER_CASE = "Lower case letter required!",
}

export interface checkResult {
  valid: boolean;
  reasons: string[];
}

export class PasswordChecker {
  public checkPassword(password: string): boolean {
    if (password.length < 8) {
      return false;
    }
    if (password == password.toLowerCase()) {
      return false;
    }
    if (password == password.toUpperCase()) {
      return false;
    }
    return true;
  }
}
