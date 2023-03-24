import { getRequestBody } from "../../../app/server_app/utils/Utils";
import { IncomingMessage } from "http";

const requestMock = {
  on: jest.fn(),
};

const someObject = {
  name: "John",
  age: 20,
  city: "Lagos",
};

const someObjectAsString = JSON.stringify(someObject);

describe("Utils test suite", () => {
  it("should return data object for valid json", async () => {
    requestMock.on.mockImplementation((event, cb) => {
      if (event == "data") {
        cb(someObjectAsString);
      } else {
        cb();
      }
    });

    const actual = await getRequestBody(requestMock as any as IncomingMessage);
    expect(actual).toEqual(someObject);
  });

  it("should throw error for invalid json", async () => {
    requestMock.on.mockImplementation((event, cb) => {
      if (event == "end") {
        cb("a" + someObjectAsString);
      } else {
        cb();
      }
    });
    await expect(getRequestBody(requestMock as any)).rejects.toThrow(
      "Unexpected token u in JSON at position 0"
    );
  });

  it("should throw error for unexpected error", async () => {
    const someError = new Error("Something went wrong");
    requestMock.on.mockImplementation((event, cb) => {
      if (event == "error") {
        cb(someError);
      }
    });
    await expect(getRequestBody(requestMock as any)).rejects.toThrow(someError);
  });
});
