import { DataBase } from "../../../app/server_app/data/DataBase";
import { SessionTokenDataAccess } from "../../../app/server_app/data/SessionTokenDataAccess";
import { Account, SessionToken } from "../../../app/server_app/model/AuthModel";
import * as IdGenerator from "../../../app/server_app/data/IdGenerator";

const insertMock = jest.fn();
const getByMock = jest.fn();
const mockUpdate = jest.fn();

jest.mock("../../../app/server_app/data/DataBase", () => {
  return {
    DataBase: jest.fn().mockImplementation(() => {
      return {
        insert: insertMock,
        getBy: getByMock,
        update: mockUpdate,
      };
    }),
  };
});

describe("Session Token Data suite", () => {
  let sut: SessionTokenDataAccess;

  const someSessionToken: SessionToken = {
    id: "",
    userName: "someUserName",
    valid: true || false,
    expirationDate: new Date(),
  };

  const someAccount: Account = {
    id: "",
    password: "somepassword",
    userName: "someUserName",
  };

  const fakeID = "00112";

  beforeEach(() => {
    sut = new SessionTokenDataAccess();
    expect(DataBase).toHaveBeenCalledTimes(1);
    jest.spyOn(global.Date, "now").mockReturnValue(0);
    jest.spyOn(IdGenerator, "generateRandomId").mockReturnValue(fakeID);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should generate token", async () => {
    insertMock.mockResolvedValueOnce(fakeID);
    const actualToken = await sut.generateToken(someAccount);
    expect(actualToken).toBe(fakeID);
    expect(insertMock).toBeCalledWith({
      id: "",
      userName: someAccount.userName,
      valid: true,
      expirationDate: new Date(1000 * 60 * 60),
    });
  });

  it("should invalidate token", async () => {
    mockUpdate.mockResolvedValueOnce(fakeID);
    await sut.invalidateToken(fakeID);
    expect(mockUpdate).toBeCalledWith(fakeID, "valid", false);
  });

  it("should check valid token", async () => {
    getByMock.mockResolvedValueOnce({ valid: true });
    const actualToken = await sut.isValidToken(fakeID);
    expect(actualToken).toBe(true);
    expect(getByMock).toBeCalledWith("id", fakeID);
  });

  it("should check invalid token", async () => {
    getByMock.mockResolvedValueOnce({ valid: false });
    const actualToken = await sut.isValidToken(fakeID);
    expect(actualToken).toBe(false);
    expect(getByMock).toBeCalledWith("id", fakeID);
  });

  it("should validate token", async () => {
    getByMock.mockResolvedValueOnce(undefined);
    const actualToken = await sut.isValidToken(fakeID);
    expect(actualToken).toBe(false);
  });
});
