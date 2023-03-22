import { DataBase } from "../../../app/server_app/data/DataBase";
import * as IdGenerator from "../../../app/server_app/data/IdGenerator";
import { ReservationsDataAccess } from "../../../app/server_app/data/ReservationsDataAccess";
import { Reservation } from "../../../app/server_app/model/ReservationModel";

const insertMock = jest.fn();
const getByMock = jest.fn();
const mockUpdate = jest.fn();
const mockDelete = jest.fn();
const getAllElementsMock = jest.fn();

jest.mock("../../../app/server_app/data/DataBase", () => {
  return {
    DataBase: jest.fn().mockImplementation(() => {
      return {
        insert: insertMock,
        getBy: getByMock,
        update: mockUpdate,
        delete: mockDelete,
        getAllElements: getAllElementsMock,
      };
    }),
  };
});

describe("Reservations data access suites", () => {
  let sut: ReservationsDataAccess;

  const someReservation: Reservation = {
    id: "",
    room: "someRoom",
    user: "someUser",
    startDate: "someStartDate",
    endDate: "someEndDate",
  };

  const someId = "2334";

  beforeEach(() => {
    sut = new ReservationsDataAccess();
    expect(DataBase).toHaveBeenCalledTimes(1);
    jest.spyOn(IdGenerator, "generateRandomId").mockReturnValueOnce(someId);
  });

  afterEach(() => {
    jest.clearAllMocks();
    someReservation.id = "";
  });

  it("Should create reservation and return ID", async () => {
    insertMock.mockResolvedValueOnce(someId);
    const actualId = await sut.createReservation(someReservation);
    expect(actualId).toBe(someId);
    expect(insertMock).toHaveBeenCalledWith(someReservation);
  });

  it("Should update Reservation", async () => {
    await sut.updateReservation(someId, "room", "someOtherRoom");
    expect(mockUpdate).toBeCalledWith(someId, "room", "someOtherRoom");
  });

  it("Should delete Reservation", async () => {
    await sut.deleteReservation(someId);
    expect(mockDelete).toBeCalledWith(someId);
  });

  it("Should get Reservation", async () => {
    getByMock.mockResolvedValueOnce(someReservation);
    const actualReservation = await sut.getReservation(someId);
    expect(actualReservation).toEqual(someReservation);
    expect(getByMock).toBeCalledWith("id", someId);
  });

  it("Should get all Reservations", async () => {
    getAllElementsMock.mockResolvedValueOnce(someReservation);
    const actual = await sut.getAllReservations();
    expect(actual).toEqual(someReservation);
  });
});
