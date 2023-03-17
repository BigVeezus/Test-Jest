import {
  PasswordChecker,
  PasswordErrors,
} from "../../app/pass_checker/passwordChecker";

describe("PasswordChecker test suite", () => {
  let sut: PasswordChecker;

  beforeEach(() => {
    sut = new PasswordChecker();
  });

  it("Password with less than 8 characters is invalid", () => {
    const actual = sut.checkPassword("1234567");

    expect(actual.valid).toBe(false);
    expect(actual.reasons).toContain(PasswordErrors.SHORT);
  });

  it("Password with 8 or more characters is valid", () => {
    const actual = sut.checkPassword("12345678Aa");
    expect(actual.valid).toBe(true);
    expect(actual.reasons).not.toContain(PasswordErrors.SHORT);
  });

  it("Password without an Uppercase character is invalid", () => {
    const actual = sut.checkPassword("13ab78");
    expect(actual.reasons).toContain(PasswordErrors.NO_UPPER_CASE);
    expect(actual.valid).toBe(false);
  });

  it("Password without a lowercase character is invalid", () => {
    const actual = sut.checkPassword("3AB78");
    expect(actual.reasons).toContain(PasswordErrors.NO_LOWER_CASE);
    expect(actual.valid).toBe(false);
  });

  it("Admin password with no number is invalid", () => {
    const actual = sut.checkAdminPassword("ABcdngnhyyy");
    expect(actual.reasons).toContain(PasswordErrors.NO_NUMBER);
    expect(actual.valid).toBe(false);
  });

  it("Admin password with number is valid", () => {
    const actual = sut.checkAdminPassword("ABc1jhjgjhd");
    expect(actual.reasons).not.toContain(PasswordErrors.NO_NUMBER);
    expect(actual.valid).toBe(true);
  });
});
