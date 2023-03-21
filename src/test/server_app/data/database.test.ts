import { DataBase } from "../../../app/server_app/data/DataBase";
import * as IdGenerator from "../../../app/server_app/data/IdGenerator";
type someTypeWithid = {
  id: string;
  name: string;
  color: string;
};

describe("Database test suites", () => {
  let sut: DataBase<someTypeWithid>;

  const fakeId = "1234";

  const someObject = {
    id: "",
    name: "someName",
    color: "blue",
  };

  const someObject2 = {
    id: "",
    name: "someOtherName",
    color: "blue",
  };

  beforeEach(() => {
    sut = new DataBase();
    jest.spyOn(IdGenerator, "generateRandomId").mockReturnValue(fakeId);
  });

  it("should return id after insert", async () => {
    const actual = await sut.insert({
      id: "",
    } as any);
    expect(actual).toBe(fakeId);
  });

  it("should get element after insert", async () => {
    const id = await sut.insert(someObject);
    const actual = await sut.getBy("id", id);
    expect(actual).toBe(someObject);
  });

  it("should get all elements", async () => {
    await sut.insert(someObject);
    await sut.insert(someObject2);

    const expected = [someObject, someObject2];
    const actual = await sut.findAllBy("color", "blue");
    expect(actual).toEqual(expected);
  });

  it("should update elements", async () => {
    const id = await sut.insert(someObject);
    const expectedColor = "red";
    await sut.update(id, "color", expectedColor);
    const object: any = await sut.getBy("id", id);

    const actualColor = object.color;
    expect(actualColor).toBe(expectedColor);
  });

  it("should delete elements", async () => {
    const id = await sut.insert(someObject);
    await sut.delete(id);
    const actual = await sut.getBy("id", id);

    expect(actual).toBeUndefined();
  });

  it("should update elements", async () => {
    await sut.insert(someObject);
    await sut.insert(someObject2);
    const actual = await sut.getAllElements();
    const expected = [someObject, someObject2];
    expect(actual).toEqual(expected);
  });
});
