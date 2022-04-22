import { Request } from "express";
import {
  Branch3DInterface,
  Branch3DExtremityRelationInterface,
  Branch3DExtremityInterface,
  FinDsInterface,
  HarnessVbInterface,
} from "../interfaces/kbl.interfaces";
import { isArray } from "util";

export class KblController {
  private mappedData: any;
  constructor() {}

  /**
   * @description Will validate the imported file formate and start the mapping
   * @param {Request} req
   */
  public buildData(req: Request) {
    return new Promise(async (resolve, reject) => {
      this.mappedData = req.body;
      try {
        await this.validateKblFile();
        resolve(await this.setFinDsVb());
      } catch (err) {
        reject(err);
      }
    });
  }

  private setFinDsVb(): Promise<FinDsInterface> {
    return new Promise(async (resolve, reject) => {
      const structure: FinDsInterface = {
        sequenceNumber: this.mappedData.finDsVB.sequenceNumber,
        circuit: this.mappedData.finDsVB.circuit,

        aircraftProgram: this.mappedData.fileInfos.aircraftProgram,
        domain: this.mappedData.fileInfos.domain,
        majorComponentAssembly:
          this.mappedData.fileInfos.majorComponentAssembly,
        finType: "VB",
      };

      structure.hVb = await this.setHarnessVb();

      resolve(structure);
    });
  }

  /**
   * @description Will create the harness object from the imported file
   */
  private setHarnessVb(): Promise<HarnessVbInterface> {
    return new Promise(async (resolve, reject) => {
      const structure: HarnessVbInterface = this.mappedData.hVb;
      structure.b3D = await this.setBranches3D();

      resolve(structure);
    });
  }

  /**
   * @description Will create the branches object from the imported file
   */
  private setBranches3D(): Promise<Branch3DInterface[]> {
    return new Promise((resolve, reject) => {
      const branchesList: Promise<Branch3DInterface>[] = [];
      let branchesFromKbl: any = this.mappedData.b3D;
      if (!isArray(branchesFromKbl)) branchesFromKbl = [branchesFromKbl];

      branchesFromKbl.forEach((branch: any) => {
        branchesList.push(
          new Promise(async (resolve, reject) => {
            const structure: Branch3DInterface = {
              branchId: branch.branchId,
              lengthForced: branch.lengthForced,
              length: branch.length,
              extraLength: branch.extraLength,
              effectiveRoutes: branch.effectiveRoutes || undefined,
              diameter3dMm: branch.diameter3DMm || undefined,
              bendradius: branch.bendRadius || undefined,
              notExtractible: branch.notExtractible,
              partzoneNumber: branch.partzoneNumber,
              branch3DExtremities: await this.setBranch3DExtremity(branch),
              branch3DExtremitiesRelation:
                await this.setBranch3DExtremityRelation(branch),
            };

            resolve(structure);
          })
        );
      });

      Promise.all(branchesList)
        .then((result) => {
          resolve(result);
        })
        .catch((err: Error) => {
          reject(err);
        });
    });
  }

  /**
   * @description Will create the branch extremities relation object from the imported file
   */
  private setBranch3DExtremityRelation(
    branch: any
  ): Promise<Branch3DExtremityRelationInterface[]> {
    return new Promise((resolve, reject) => {
      const relationList: Promise<Branch3DExtremityRelationInterface>[] = [];
      const start_vectors = {
        X: branch.startVectorX,
        Y: branch.startVectorY,
        Z: branch.startVectorZ,
      };
      const end_vectors = {
        X: branch.endVectorX,
        Y: branch.endVectorY,
        Z: branch.endVectorZ,
      };

      for (const startOrEnd of ["start", "end"]) {
        relationList.push(
          new Promise((resolve, reject) => {
            const relatedNode =
              startOrEnd === "start" ? branch.start_node : branch.end_node;
            const vectors =
              startOrEnd === "start" ? start_vectors : end_vectors;
            const structure: Branch3DExtremityRelationInterface = {
              branch3DExtremityRelationId: relatedNode,
              vectorX: vectors.X,
              vectorY: vectors.Y,
              vectorZ: vectors.Z,
            };
            resolve(structure);
          })
        );
      }

      Promise.all(relationList)
        .then((result) => {
          resolve(result);
        })
        .catch((err: Error) => {
          reject(err);
        });
    });
  }

  /**
   * @description Will create the branch extremities object from the imported file
   */
  private setBranch3DExtremity(
    branch: any
  ): Promise<Branch3DExtremityInterface[]> {
    return new Promise((resolve, reject) => {
      let extremities = branch.nodes;
      if (!isArray(extremities)) extremities = [extremities];

      const extremitiesList: Promise<Branch3DExtremityInterface>[] = [];
      extremities.forEach((extremity: any) => {
        extremitiesList.push(
          new Promise(async (resolve, reject) => {
            const structure: Branch3DExtremityInterface = {
              branchExtremityNaming: extremity.id,
              electricalCoordinateX: extremity.coordinateX,
              electricalCoordinateY: extremity.coordinateY,
              electricalCoordinateZ: extremity.coordinateZ,
              type: extremity.type,
            };
            if (extremity.referenced_components) {
              const component = isArray(this.mappedData.cMPT)
                ? this.mappedData.cMPT.filter(
                    (value: any) =>
                      value.componentNaming === extremity.referenced_components
                  )[0]
                : this.mappedData.cMPT;
              structure.finDs = await this.setFinDs(component);
            }
            resolve(structure);
          })
        );
      });
      Promise.all(extremitiesList)
        .then((result) => {
          resolve(result);
        })
        .catch((err: Error) => {
          reject(err);
        });
    });
  }

  /**
   * @description Will create the fin DS component object from the imported file
   */
  private setFinDs(component: any): Promise<FinDsInterface> {
    return new Promise((resolve, reject) => {
      let finDsComponents = component.findDsComponent;
      const finDsComponentList: Promise<FinDsInterface>[] = [];
      if (!isArray(finDsComponents)) {
        finDsComponents = [finDsComponents];
      }
      const branchRelatedList = this.mappedData.b3D.filter((value: any) => {
        let boolean = false;
        for (const node of value.nodes) {
          if (node.referenced_components === component.componentNaming)
            boolean = true;
        }
        return boolean;
      });
      let effectiveRoutes = "";

      for (const branchRelated of branchRelatedList) {
        if (!effectiveRoutes) effectiveRoutes = branchRelated.effectiveRoutes;
        else if (!effectiveRoutes.includes(branchRelated.effectiveRoutes))
          effectiveRoutes += "," + branchRelated.effectiveRoutes;
      }

      finDsComponents.forEach((finDscomponent: any) => {
        finDsComponentList.push(
          new Promise((resolve, reject) => {
            if (component.related_component) {
              component = this.mappedData.cMPT.filter(
                (value: any) =>
                  value.componentNaming === component.related_component
              )[0];
            }
            let finId = finDscomponent.sequenceNumber + finDscomponent.circuit;
            let newLocal = finDscomponent.suffix
              ? (finId += finDscomponent.suffix)
              : "";
            newLocal = finDscomponent.appendedLetter
              ? (finId += "_" + finDscomponent.appendedLetter)
              : "";
            const structure: FinDsInterface = {
              sequenceNumber: finDscomponent.sequenceNumber,
              circuit: finDscomponent.circuit,
              suffix: finDscomponent.suffix,
              appendedLetter: finDscomponent.appendedLetter,
              cDRoot: finId,
              effectiveRoutes: effectiveRoutes,
              aircraftProgram: this.mappedData.fileInfos.aircraftProgram,
              domain: this.mappedData.fileInfos.domain,
              majorComponentAssembly:
                this.mappedData.fileInfos.majorComponentAssembly,

              finType: "component",

              cMPT: {
                componentNaming: component.componentNaming,
                partNumber: component.partNumber,
                componentType: component.componentType,
                masterSourceId: component.masterSourceId,
                mSCreationDate: component.masterSourceCreationDate,
                mSModifDate: component.masterSourceModificationDate,
                mSUserModifId: component.masterSourceUserModificationId,
                mSUserCreationId: component.masterSourceUserCreationId,
              },
              mPoint: {
                positionX: component.coordinateX,
                positionY: component.coordinateY,
                positionZ: component.coordinateZ,
                type: "functional_item_solution",
              },
            };

            resolve(structure);
          })
        );
      });

      Promise.all(finDsComponentList).then((result: any) => resolve(result));
    });
  }

  /**
   * @description Will validate if the given file contains every thing we need
   */
  private validateKblFile(): Promise<any> {
    return new Promise((resolve, reject) => {
      if (!this.mappedData.fileInfos)
        reject(new Error("No file infos found in kbl data"));
      else if (!this.mappedData.hVb)
        reject(new Error("No harness found in kbl data"));
      else if (!this.mappedData.b3D)
        reject(new Error("No b3D found in kbl data"));
      else if (!this.mappedData.cMPT)
        reject(new Error("No component found in kbl data"));
      else if (!this.mappedData.finDsVB)
        reject(new Error("No finDsVB found in kbl data"));

      resolve();
    });
  }
}

/**
 * @description Singleton
 */
const kblController = new KblController();
export default kblController;
