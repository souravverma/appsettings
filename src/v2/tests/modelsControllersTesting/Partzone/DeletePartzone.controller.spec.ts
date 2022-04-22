import DeletePartzone from "../../../modelsControllers/Partzone/DeletePartzone.controller";

jest.mock("../../../models/Partzone.model", () => {
  const SequelizeMock = require("sequelize-mock");
  const dbMock = new SequelizeMock();
  return dbMock.define("PartzoneModel", {
    id: "26",
    name: "E929XXXXXXXXXX",
    version: "001",
    updated_at: "2021-11-10T05:28:38.067Z",
    $set: jest.fn(),
  });
});

describe("Unit Tests for DeletePartzone Class", () => {
  const deletePartZone = new DeletePartzone();

  it("should return void for unlinkOtherPartzones", async () => {
    const result = await deletePartZone.unlinkOtherPartzones({
      id: 26,
      name: "E929XXXXXXXXXX",
      version: "001",
    } as any);
    expect(result).toBe(undefined);
  });
});
