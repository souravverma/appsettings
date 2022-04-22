import ComponentModel from "../../models/Component.model";
import FunctionalItem3dSolutionModel from "../../models/FunctionalItem3dSolution.model";
import CapitalHX2MLGenerationService from "../../services/CapitalHX2MLGeneration.service";
import xformatter from "xml-formatter";
import "jest-xml-matcher";
import { harness3dDesignSolution, harness3dRouteFilter } from "../mockJson/harness3d";
import { partZone, partZoneRouteFilter } from "../mockJson/partZone";
import { result, resultRouteFilter, resultMultiRouteFilter, branchPointResult } from "../mockJson/harnessXmlresult";


describe("CapitalHX2MLGenerationService", () => {
  const capitalXMLGenerationService = new CapitalHX2MLGenerationService();
  const sendMock = jest.fn();
  it("capitalXMLGenerationService should be defined", () => {
    expect(capitalXMLGenerationService).toBeDefined();
  });

  it("createBaseHX2MLfile - success", async () => {
    (capitalXMLGenerationService as any).moveTopVal = [-1, -1, -1, -181];
    jest
      .spyOn(ComponentModel, "findAll")
      .mockResolvedValue(Promise.resolve([]));
    jest
      .spyOn(FunctionalItem3dSolutionModel, "findAll")
      .mockResolvedValue(Promise.resolve([]));
    const xml = await capitalXMLGenerationService.createBaseHX2MLfile(
      harness3dDesignSolution,
      partZone
    );
    expect(result).toEqualXML(xformatter(xml));
  });

  // Test cases for post filtering on routes
  it("createBaseHX2MLfile - post filter on route", async () => {
    (capitalXMLGenerationService as any).moveTopVal = [-1, -1, -1, -181];
    (capitalXMLGenerationService as any).routes = ['6M'];
    jest
      .spyOn(ComponentModel, "findAll")
      .mockResolvedValue(Promise.resolve([]));
    jest
      .spyOn(FunctionalItem3dSolutionModel, "findAll")
      .mockResolvedValue(Promise.resolve([]));
    const xml = await capitalXMLGenerationService.createBaseHX2MLfile(
      harness3dRouteFilter,
      partZoneRouteFilter
    );
    expect(resultRouteFilter).toEqualXML(xformatter(xml));
  });

  it("createBaseHX2MLfile - post filter on multi-route", async () => {
    (capitalXMLGenerationService as any).moveTopVal = [-1, -1, -1, -181];
    (capitalXMLGenerationService as any).routes = ['6M', '7ME'];
    jest
      .spyOn(ComponentModel, "findAll")
      .mockResolvedValue(Promise.resolve([]));
    jest
      .spyOn(FunctionalItem3dSolutionModel, "findAll")
      .mockResolvedValue(Promise.resolve([]));
    const xml = await capitalXMLGenerationService.createBaseHX2MLfile(
      harness3dRouteFilter,
      partZoneRouteFilter
    );
    expect(resultMultiRouteFilter).toEqualXML(xformatter(xml));
  });

  it("createBaseHX2MLfile - post filter on route fails", async () => {
    sendMock.mockRejectedValue(new Error('Error while executing post filtering on routes'));
    try {
      (capitalXMLGenerationService as any).moveTopVal = [-1, -1, -1, -181];
      (capitalXMLGenerationService as any).routes = [];
      jest
        .spyOn(ComponentModel, "findAll")
        .mockResolvedValue(Promise.resolve([]));
      jest
        .spyOn(FunctionalItem3dSolutionModel, "findAll")
        .mockResolvedValue(Promise.resolve([]));
      await capitalXMLGenerationService.createBaseHX2MLfile(
        harness3dRouteFilter,
        partZoneRouteFilter
      );
    } catch (err) {
      expect(err).toBeInstanceOf(Error);
      expect(err.message).toBe('Error while executing post filtering on routes');
    }
  });

  //Test cases for branch point activation in geometry
  it("createBaseHX2MLfile - branch point is activated", async () => {
    (capitalXMLGenerationService as any).moveTopVal = [-1, -1, -1, -181];
    (capitalXMLGenerationService as any).option_branch_point = true;
    jest
      .spyOn(ComponentModel, "findAll")
      .mockResolvedValue(Promise.resolve([]));
    jest
      .spyOn(FunctionalItem3dSolutionModel, "findAll")
      .mockResolvedValue(Promise.resolve([]));
    const xml = await capitalXMLGenerationService.createBaseHX2MLfile(
      harness3dDesignSolution,
      partZone
    );
    expect(result).toEqualXML(xformatter(xml));
  });

  it("createBaseHX2MLfile - branch point is not activated", async () => {
    (capitalXMLGenerationService as any).moveTopVal = [-1, -1, -1, -181];
    (capitalXMLGenerationService as any).option_branch_point = false;
    jest
      .spyOn(ComponentModel, "findAll")
      .mockResolvedValue(Promise.resolve([]));
    jest
      .spyOn(FunctionalItem3dSolutionModel, "findAll")
      .mockResolvedValue(Promise.resolve([]));
    const xml = await capitalXMLGenerationService.createBaseHX2MLfile(
      harness3dDesignSolution,
      partZone
    );
    expect(branchPointResult).toEqualXML(xformatter(xml));
  });
});