import { PasswordChecker } from "../../app/pass_checker/passwordChecker";

describe("PasswordChecker test suite", () => {
  let sut: PasswordChecker;

  beforeEach(() => {
    sut = new PasswordChecker();
  });

  it("Password with less than 8 characters is invalid", () => {
    const actual = sut.checkPassword("1234567");

    expect(actual).toBe(false);
  });

  it("Password with 8 or more characters is valid", () => {
    const actual = sut.checkPassword("12345678Aa");

    expect(actual).toBe(true);
  });

  it("Password without an Uppercase character is invalid", () => {
    const actual = sut.checkPassword("123abc45678");

    expect(actual).toBe(false);
  });

  it("Password without a lowercase character is invalid", () => {
    const actual = sut.checkPassword("123ABC45678");

    expect(actual).toBe(false);
  });
});
