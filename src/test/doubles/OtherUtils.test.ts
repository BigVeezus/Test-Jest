import {
  calculateComplexity,
  OtherStringUtils,
  toUpperCaseWithCb,
} from "../../app/doubles/OtherUtils";
import { toUpperCase } from "../../app/utils";

describe("Other Utils test suite", () => {
  describe.only("OtherStringUtils tests with spies", () => {
    let sut: OtherStringUtils;

    beforeEach(() => {
      sut = new OtherStringUtils();
    });

    test("Use a spy to track calls", () => {
      const toUpperCaseSpy = jest.spyOn(sut, "toUpperCase");
      sut.toUpperCase("asa");
      expect(toUpperCaseSpy).toBeCalledWith("asa");
    });

    test("Use a spy to track calls to other module", () => {
      const consoleLogSpy = jest.spyOn(console, "log");
      sut.logString("abc");
      expect(consoleLogSpy).toBeCalledWith("abc");
    });

    test("Use a spy to replace implementation of method", () => {
      jest.spyOn(sut, "callExternalService").mockImplementation(() => {
        console.log("calling mocked implementation!");
      });
      sut.callExternalService();
    });
  });

  describe("Tracking callbacks with Jest mocks", () => {
    const callbackMock = jest.fn();

    afterEach(() => {
      jest.clearAllMocks();
    });

    it("calls callback for invalid argument", () => {
      const actual = toUpperCaseWithCb("", callbackMock);
      expect(actual).toBeUndefined();
      expect(callbackMock).toBeCalledWith("Invalid argument!");
      expect(callbackMock).toBeCalledTimes(1);
    });

    it("calls callback for valid argument", () => {
      const actual = toUpperCaseWithCb("abc", callbackMock);
      expect(actual).not.toBeUndefined();
      expect(actual).toBe("ABC");
      expect(callbackMock).not.toBeCalledWith("Invalid argument!");
      expect(callbackMock).toBeCalledWith("called function with abc");
      expect(callbackMock).toBeCalledTimes(1);
    });

    describe("Tracking callbacks", () => {
      let cbArgs: string[] = [];
      let timesCalled = 0;

      function callbackMock(arg: string) {
        cbArgs.push(arg);
        timesCalled++;
      }

      afterEach(() => {
        // claering fields
        cbArgs = [];
        timesCalled = 0;
      });

      it("calls callback for invalid argument", () => {
        const actual = toUpperCaseWithCb("", callbackMock);
        expect(actual).toBeUndefined();
        expect(cbArgs).toContain("Invalid argument!");
        expect(timesCalled).toBe(1);
      });

      it("calls callback for valid argument", () => {
        const actual = toUpperCaseWithCb("abc", callbackMock);
        expect(actual).not.toBeUndefined();
        expect(actual).toBe("ABC");
        expect(cbArgs).not.toContain("Invalid argument!");
        expect(cbArgs).toContain("called function with abc");
        expect(timesCalled).toBe(1);
      });
    });

    it("To uppercase - calls callback for invalid argument", () => {
      const actual = toUpperCaseWithCb("", () => {});
      expect(actual).toBeUndefined();
    });

    it("To uppercase - calls callback for valid argument", () => {
      const actual = toUpperCaseWithCb("abc", () => {});
      expect(actual).toBe("ABC");
    });

    it("calculates complexity", () => {
      const someInfo = {
        length: 5,
        extraInfo: {
          field1: "someInfo",
          field2: "someOtherInfo",
        },
      };
      const actual = calculateComplexity(someInfo as any);
      expect(actual).toBe(10);
    });
  });
});
