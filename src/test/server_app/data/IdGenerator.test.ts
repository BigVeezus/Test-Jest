import { generateRandomId } from "../../../app/server_app/data/IdGenerator";

describe("ID Generator suite", () => {
  it("should return a random string", () => {
    const randomID = generateRandomId();
    expect(randomID.length).toBe(20);
  });
});
