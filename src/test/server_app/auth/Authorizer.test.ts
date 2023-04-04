import { UserCredentialsDataAccess } from "../../../app/server_app/data/UserCredentialsDataAccess";
import { SessionTokenDataAccess } from "../../../app/server_app/data/SessionTokenDataAccess";
import { Authorizer } from "../../../app/server_app/auth/Authorizer";

const addUserMock = jest.fn();
const getUserByUserNameMock = jest.fn();
const isValidTokenMock = jest.fn();
const invalidateTokenMock = jest.fn();
const generateTokenMock = jest.fn();

jest.mock("../../../app/server_app/data/UserCredentialsDataAccess", () => {
  return {
    UserCredentialsDataAccess: jest.fn().mockImplementation(() => {
      return {
        addUser: addUserMock,
        getUserByUserName: getUserByUserNameMock,
      };
    }),
  };
});

jest.mock("../../../app/server_app/data/SessionTokenDataAccess", () => {
  return {
    SessionTokenDataAccess: jest.fn().mockImplementation(() => {
      return {
        isValidToken: isValidTokenMock,
        invalidateToken: invalidateTokenMock,
        generateToken: generateTokenMock,
      };
    }),
  };
});

describe("Authorizer suites", () => {
  let sut: Authorizer;

  const someId = "1234";

  const somePassword = "somePassword";
  const someUserName = "someUserName";

  beforeEach(() => {
    sut = new Authorizer();
    expect(SessionTokenDataAccess).toHaveBeenCalledTimes(1);
    expect(UserCredentialsDataAccess).toHaveBeenCalledTimes(1);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return true if token is valid", async () => {
    isValidTokenMock.mockResolvedValueOnce(false);
    const actual = await sut.validateToken(someId);
    expect(actual).toBe(false);
  });

  it("should return register user and return ID", async () => {
    addUserMock.mockResolvedValueOnce(someId);
    const actualId = await sut.registerUser(someUserName, somePassword);
    expect(actualId).toBe(someId);
  });

  it("should should login user", async () => {
    getUserByUserNameMock.mockResolvedValueOnce({
      password: somePassword,
    });
    generateTokenMock.mockResolvedValueOnce(someId);
    const actualUser = await sut.login(someUserName, somePassword);
    expect(actualUser).toBe(someId);
  });

  it("should should return invalid if invalid credentials", async () => {
    getUserByUserNameMock.mockResolvedValueOnce({
      password: somePassword,
    });
    generateTokenMock.mockResolvedValueOnce(undefined);
    const actualUser = await sut.login(someUserName, somePassword);
    expect(actualUser).toBeUndefined();
  });

  it("should logOut user", async () => {
    invalidateTokenMock.mockResolvedValueOnce(someId);
    await sut.logout(someId);
  });
});
