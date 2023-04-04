import { Authorizer } from "../../../app/server_app/auth/Authorizer";
import { LoginHandler } from "../../../app/server_app/handlers/LoginHandler";
import { IncomingMessage, ServerResponse } from "http";
import {
  HTTP_METHODS,
  HTTP_CODES,
} from "../../../app/server_app/model/ServerModel";

const getRequestBodyMock = jest.fn();

jest.mock("../../../app/server_app/utils/Utils", () => ({
  getRequestBody: () => getRequestBodyMock(),
}));

describe("Login handler suite", () => {
  let sut: LoginHandler;

  const request = {
    method: undefined,
  };

  const responseMock = {
    statusCode: 0,
    writeHead: jest.fn(),
    write: jest.fn(),
  };

  const authorizerMock = {
    login: jest.fn(),
  };

  const someAccount = {
    userName: "someusername",
    password: "somePassword",
  };

  const someToken = "1234";

  beforeEach(() => {
    sut = new LoginHandler(
      request as IncomingMessage,
      responseMock as any as ServerResponse,
      authorizerMock as any as Authorizer
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("Should return token for valid accounts", async () => {
    request.method = HTTP_METHODS.POST as any;
    getRequestBodyMock.mockResolvedValueOnce(someAccount);
    authorizerMock.login.mockResolvedValueOnce(someToken);

    await sut.handleRequest();
    expect(authorizerMock.login).toBeCalledWith(
      someAccount.userName,
      someAccount.password
    );
    expect(responseMock.statusCode).toBe(HTTP_CODES.CREATED);
    expect(responseMock.writeHead).toBeCalledWith(HTTP_CODES.CREATED, {
      "Content-Type": "application/json",
    });
    expect(responseMock.write).toBeCalledWith(
      JSON.stringify({
        token: someToken,
      })
    );
  });

  it("Should return invalid for invalid accounts", async () => {
    request.method = HTTP_METHODS.POST as any;
    getRequestBodyMock.mockResolvedValueOnce(someAccount);
    authorizerMock.login.mockResolvedValueOnce(undefined);

    await sut.handleRequest();
    expect(authorizerMock.login).toBeCalledWith(
      someAccount.userName,
      someAccount.password
    );
    expect(responseMock.statusCode).toBe(HTTP_CODES.NOT_fOUND);
    expect(responseMock.write).toBeCalledWith(
      JSON.stringify("wrong username or password")
    );
  });

  it("Should return bad request for invalid requests", async () => {
    request.method = HTTP_METHODS.POST as any;
    getRequestBodyMock.mockResolvedValueOnce({});

    await sut.handleRequest();
    expect(responseMock.statusCode).toBe(HTTP_CODES.BAD_REQUEST);
    expect(responseMock.write).toBeCalledWith(
      JSON.stringify("userName and password required")
    );
    expect(responseMock.writeHead).toBeCalledWith(HTTP_CODES.BAD_REQUEST, {
      "Content-Type": "application/json",
    });
  });

  it("Should do nothing for invalid HTTP", async () => {
    request.method = "some-method" as any;

    await sut.handleRequest();
    expect(responseMock.statusCode).toBe(HTTP_CODES.BAD_REQUEST);
    expect(responseMock.write).not.toBeCalled();
    expect(responseMock.writeHead).not.toBeCalled();
  });
});
