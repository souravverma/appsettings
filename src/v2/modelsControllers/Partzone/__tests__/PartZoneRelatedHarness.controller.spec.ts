import 'reflect-metadata';
import PartZoneHelper from "../PartzoneHelper.controller";
import PartZoneRelatedHarness from "../PartZoneRelatedHarness.controller";
import { mockData } from "../__mock__/PartZoneHelper.mock";

describe("Unit test for PartZoneRelatedHarness", () => {

  const partZoneHelper = new PartZoneHelper();
  const partZoneRelatedHarness = new PartZoneRelatedHarness(partZoneHelper);
  jest.spyOn(partZoneHelper, "getAllHarnessesForPartZone").mockImplementation(() => Promise.resolve(mockData));

  it("should throw an error when UserArea does not exist for ADAP DS harness", async () => {
    const partZoneName = 'D92911111111A1';
    const userArea = 'A2';
    const version = '001';
    const promise = partZoneRelatedHarness.getPartzoneRelatedToHarness(partZoneName, userArea, version);

    await expect(promise).rejects.toThrowError()
  });

  it("should not throw an error when UserArea exists for ADAP DS harness", async () => {
    const partZoneName = 'D92911111111A1';
    const userArea = 'A1';
    const version = '001';
    const promise = partZoneRelatedHarness.getPartzoneRelatedToHarness(partZoneName, userArea, version);

    await expect(promise).resolves.not.toThrowError();
  });
})