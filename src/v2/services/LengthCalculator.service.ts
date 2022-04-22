// import FunctionalItem3dSolutionModel from '../models/FunctionalItem3dSolution.model';
// import Branch3dExtremitySolutionModel from '../models/Branch3dExtremitySolution.model';
// import Branch3dExtremityTypeModel from '../models/Branch3dExtremityType.model';
// import Branch3dModel from '../models/Branch3d.model';
// import PartZoneModel from '../models/Partzone.model';
// import Harness3dDesignSolutionModel from '../models/Harness3dDesignSolution.model';
// import { performance } from 'perf_hooks';
// import Graph from 'node-dijkstra';

// interface BodyInfo {
//     data: FromToData[];
// }
// interface FromToData {
//     from: FinSequenced;
//     to: FinSequenced;
// }

// interface FinSequenced {
//     sequenceNumber: string;
//     circuit: string;
//     suffix?: string;
//     appendedLetter?: string;
//     supplementaryPart?: string;
// }

// interface Response {
//     from: FinSequenced[];
//     to: FinSequenced[];
//     lengthMm: number;
// }

// interface IMappedGraph {
//     [k: string]: {
//         [x: string]: number
//     };
// }
// export class LengthCalculatorService {

//     private branches: any[] = [];
//     private branchExtremities: any[] = [];

//     private listFromTo: any[] = [];
//     private listPath: any[] = [];
//     private listPathTmp: any[] = [];
//     private notConnectedCrossRef: number = 0;
//     private listFin: any[] = [];
//     // private pool = workerpool.pool(__dirname + '/LengthCalculator.service.js');
//     // private file = fs.createWriteStream('./example.txt');
//     constructor(private adapDsNumber: string, private bodyInfo: BodyInfo) {
//         console.log(__dirname);
//     }

//     start(algorithm: string): Promise<Array<Response>> {
//         return new Promise((resolve, reject) => {
//             const t0 = performance.now();
//             console.log('Starting calculation ...');
//             this.mappingData()
//                 .then(() => {
//                     // console.log(this.branchExtremities);
//                     if (algorithm === 'dijsktra')
//                         return this.dijkstra(); // will run Dijsktra
//                     else
//                         return this.startCompute(); // will run depth first
//                 })
//                 .then((result) => {
//                     const t1 = performance.now();
//                     const date = new Date(t1 - t0);
//                     const m = date.getMinutes();
//                     const s = date.getSeconds();
//                     const ms = date.getMilliseconds();
//                     const returnablePath = this.responseFormating();

//                     console.log('Number of path found : ', this.listPath.length);
//                     console.log('Number of FIN total : ', this.listFin.length);
//                     console.log('Maximum depth : ', this.maxDepth);
//                     console.log('Number of Extremities : ', this.branchExtremities.filter((v) => v.type === 'CONNECTOR').length);
//                     console.log('Number of CrossRef not connected : ', this.notConnectedCrossRef);
//                     console.log('Algorithme took : ' + m + 'm ' + s + 's ' + ms + 'ms to performe.');
//                     // this.file.end();
//                     // return this.dijkstra();
//                     resolve(returnablePath);
//                 })
//                 .catch((err: Error) => reject(err));
//         });
//     }

//     mappingData(): Promise<void> {
//         console.log('Getting data from coreElec ...');
//         const t1 = performance.now();

//         return new Promise((resolve, reject) => {
//             Harness3dDesignSolutionModel.findAll({
//                 attributes: ['id', 'adapDesignSolutionNumber'],
//                 where: {
//                     adapDesignSolutionNumber: this.adapDsNumber
//                 },
//                 include: [{
//                     model: PartZoneModel,
//                     attributes: ['id'],
//                     include: [{
//                         model: Branch3dModel,
//                         attributes: ['id', 'name', 'lengthMm', 'notExtractible'],
//                         where: { notExtractible: false },
//                         include: [{
//                             model: Branch3dExtremitySolutionModel,
//                             attributes: ['id', 'name', 'electricalCoordinateX', 'electricalCoordinateY', 'electricalCoordinateZ'],
//                             include: [{
//                                 model: FunctionalItem3dSolutionModel,
//                                 attributes: ['id', 'instanceName3d'],
//                             },
//                             {
//                                 model: Branch3dExtremityTypeModel,
//                                 attributes: ['id', 'name']
//                             },
//                             {
//                                 model: Branch3dModel,
//                                 attributes: ['id', 'name', 'lengthMm', 'notExtractible'],
//                                 where: { notExtractible: false }
//                             }
//                             ]
//                         }]
//                     }]
//                 }]
//             })
//                 .then((harness3dDesignSolutionList) => {
//                     const t2 = performance.now();
//                     console.log(t2 - t1, ' time to get models');
//                     console.log('Data received from coreElec ...');
//                     for (const harness of harness3dDesignSolutionList) {
//                         for (const partZone of harness.partZone) {
//                             for (const branch of partZone.b3d) {
//                                 for (const branchExt of branch.b3dExt) {
//                                     if (branchExt.type.name === 'CROSSREF') {
//                                         const cross = this.branchExtremities.find((bExt) => bExt.name === branchExt.name);
//                                         // const cross = this.branchExtremities.find((bExt) => {
//                                         //     const euclideanDistance: number = Math.sqrt(((bExt.electricalCoordinateX - branchExt.electricalCoordinateX) ** 2) +
//                                         //         ((bExt.electricalCoordinateY - branchExt.electricalCoordinateY) ** 2) +
//                                         //         ((bExt.electricalCoordinateZ - branchExt.electricalCoordinateZ) ** 2));

//                                         //     return euclideanDistance < 4;
//                                         // });

//                                         if (cross) {
//                                             this.notConnectedCrossRef--;
//                                             if (!cross.b3d.some((b: any) => b.id === branch.id)) {
//                                                 cross.b3d.push(branch);
//                                             }

//                                             branch.b3dExt.splice(branch.b3dExt.findIndex((v) => v.id === branchExt.id), 1, cross);
//                                         } else {
//                                             this.notConnectedCrossRef++;

//                                             this.branchExtremities.push(Object.assign(branchExt, { type: branchExt.type.name }));
//                                         }
//                                     } else {
//                                         const existing = this.branchExtremities.find((bExt) => bExt.id === branchExt.id);
//                                         if (existing) {
//                                             if (!existing.b3d.some((b: any) => b.id === branch.id)) {
//                                                 existing.b3d.push(branch);
//                                             }
//                                         }
//                                         else {
//                                             this.branchExtremities.push(Object.assign(branchExt, { type: branchExt.type.name }));
//                                         }
//                                     }
//                                     for (const fin of branchExt.finDs) {
//                                         if (!this.listFin.includes(fin.id))
//                                             this.listFin.push(fin.id);
//                                     }
//                                 }
//                                 this.branches.push(branch);
//                             }
//                         }
//                     }
//                     const t3 = performance.now();
//                     console.log(t3 - t1, ' time to build models');
//                     resolve();
//                 })
//                 .catch((err: Error) => reject(err));
//         });
//     }

//     responseFormating(): Response[] {
//         const finalResult = [];
//         if (this.bodyInfo && this.bodyInfo.data) {

//             for (const info of this.bodyInfo.data) {
//                 if (info.to) {
//                     finalResult.push(...this.listPath.filter((v) => {
//                         return this.ObjectIncluded(v.to, info.to) && this.ObjectIncluded(v.from, info.from);
//                     }));
//                 } else if (info.from) {
//                     finalResult.push(...this.listPath.filter((v) => {
//                         return this.ObjectIncluded(v.from, info.from);
//                     }));
//                 }
//             }

//             return finalResult;
//         } else {
//             return this.listPath;
//         }
//     }

//     startCompute() {
//         // console.log(this.branchExtremities.find((b) => b.type === 'CROSSREF').b3d);
//         // const newPath: Array<string> = [];
//         // return this.getListPath(null, this.branchExtremities.filter((v) => v.type === 'CONNECTOR' && v.name === 'EXT0155')[0], this.branchExtremities.filter((v) => v.type === 'CONNECTOR' && v.name === 'EXT0155')[0], newPath, 0, 0);
//         console.log('Starting to compute using DEPTH FIRST...');

//         let rangedExtremities: Array<any>;

//         // if from are given in the post body we filter by them
//         if (this.bodyInfo && this.bodyInfo.data) {
//             const instancesName = this.bodyInfo.data.map((v) => {
//                 let complete = v.from.sequenceNumber;
//                 complete += v.from.circuit;
//                 v.from.suffix ? complete += v.from.suffix : '';
//                 v.from.appendedLetter ? complete += '_' + v.from.appendedLetter : '';

//                 return complete;
//             });

//             // const instancesName = this.bodyInfo.data.map((v) => v.from );
//             rangedExtremities = this.branchExtremities.filter((v) => {
//                 return v.finDs.some((t: any) => instancesName.includes(t.instanceName3d));
//             });
//         }
//         else {
//             rangedExtremities = this.branchExtremities.filter((v) => v.type === 'CONNECTOR');
//         }

//         let starting = 0;
//         const max = this.branchExtremities.filter((v) => v.type === 'CONNECTOR').length;
//         // for each extremity from, calcul every to related

//         return rangedExtremities.reduce((previousPromise, vertice) => {
//             return previousPromise.then(() => {
//                 starting++;
//                 const newPath: Array<string> = [];
//                 console.log(Math.round((starting * 100) / max) + ' % -- ' + this.listPath.length + ' paths.');
//                 return this.getListPath(null, vertice, vertice, newPath, 0, 0);
//             });
//         }, Promise.resolve());

//     }

//     // Depth first algorithm
//     private maxDepth: number = 0;
//     getListPath(currentEdge: any, currentVertice: any, startingVertice: any, newPath: any[], totalLength: number, depthLevel: number): Promise<void> {
//         return Promise.all(currentVertice.b3d.map((edge: any) => {
//             if (newPath.some((v) => v.id === edge.id))
//                 return false;

//             if (depthLevel > this.maxDepth) {
//                 this.maxDepth = depthLevel;
//             }

//             if (depthLevel >= 200) {
//                 return false;
//             }

//             if (currentEdge && edge.id === currentEdge.id) {
//                 return false;
//             }
//             else {
//                 const newEdge = this.branches.find((b: any) => b.id === edge.id);
//                 newPath.push(newEdge);
//                 totalLength += newEdge.lengthMm;
//                 const newVertice = this.branchExtremities.find((bExt: any) => bExt.id === newEdge.b3dExt.find((v: any) => v.id != currentVertice.id).id);
//                 if (newVertice) {
//                     if (newVertice.type === 'CONNECTOR') {
//                         const FromTo = [startingVertice.id, newVertice.id];
//                         if (!this.listFromTo.some((l) => l.includes(FromTo[0]) && l.includes(FromTo[1])) || !this.existing(this.listPathTmp, newPath)) {
//                             // if (this.bodyInfo && this.bodyInfo.data.some((v) => v.to === newVertice.finDs[0].instanceName3d)) {
//                                 this.listPathTmp.push(newPath.map((v) => v.id));
//                                 this.listFromTo.push(FromTo);
//                                 this.listPath.push({
//                                     from: this.formatFin(startingVertice.finDs.map((v: any) => v.instanceName3d)),
//                                     to: this.formatFin(newVertice.finDs.map((v: any) => v.instanceName3d)),
//                                     lengthMm: Math.round(totalLength)
//                                 });
//                                 // this.file.write(startingVertice.finDs.map((v: any) => v.instanceName3d) + '  ' + newVertice.finDs.map((v: any) => v.instanceName3d) + '\n');
//                             // }
//                         }
//                     }
//                     else if (newVertice.b3d.some((b: any) => b.id !== newEdge.id)) {
//                         this.getListPath(newEdge, newVertice, startingVertice, newPath, totalLength, (depthLevel + 1));
//                     }
//                 }
//                 totalLength -= newEdge.lengthMm;
//                 newPath.splice(-1, 1);
//             }
//         }))
//             .then(() => {
//                 Promise.resolve();
//             });
//     }

//     // dijkstra algorithm
//     dijkstra() {
//         return new Promise((resolve, reject) => {
//             console.log('Starting to compute using DISJKTRA...');

//             const t1 = performance.now();
//             let rangedFromExtremities: any[];
//             if (this.bodyInfo && this.bodyInfo.data && this.bodyInfo.data.some((v) => v.from ? true : false)) {
//                 const instancesFromName = this.bodyInfo.data.map((v) => {
//                     let complete = v.from.sequenceNumber;
//                     complete += v.from.circuit;
//                     v.from.suffix ? complete += v.from.suffix : '';
//                     v.from.appendedLetter ? complete += '_' + v.from.appendedLetter : '';

//                     return complete;
//                 });
//                 // const instancesFromName = this.bodyInfo.data.map((v) => v.from);
//                 rangedFromExtremities = this.branchExtremities.filter((v) => {
//                     return v.finDs.some((t: any) => instancesFromName.includes(t.instanceName3d));
//                 });
//             } else {
//                 rangedFromExtremities = this.branchExtremities;
//             }

//             let rangedToExtremities: any[];

//             if (this.bodyInfo && this.bodyInfo.data && this.bodyInfo.data.some((v) => v.to ? true : false)) {
//                 const instancesToName = this.bodyInfo.data.map((v) => {
//                     let complete = v.to.sequenceNumber;
//                     complete += v.to.circuit;
//                     v.to.suffix ? complete += v.to.suffix : '';
//                     v.to.appendedLetter ? complete += '_' + v.to.appendedLetter : '';

//                     return complete;
//                 });
//                 // const instancesToName = this.bodyInfo.data.map((v) => v.to);

//                 rangedToExtremities = this.branchExtremities.filter((v) => {
//                     return v.finDs.some((t: any) => instancesToName.includes(t.instanceName3d));
//                 });
//             } else {
//                 rangedToExtremities = this.branchExtremities;
//             }

//             // after getting usefull extremities we create the dijkstra graph
//             let mappedGraph: IMappedGraph = {};
//             for (const mainExtremity of this.branchExtremities) {
//                 if (mainExtremity.type === 'CONNECTOR' && !rangedToExtremities.concat(rangedFromExtremities).some((v) => v.id === mainExtremity.id)) continue;
//                 mappedGraph = { ...mappedGraph, [mainExtremity.id]: {} };
//                 for (const bTmp of mainExtremity.b3d) {
//                     const branch = this.branches.find((b) => b.id === bTmp.id);
//                     branch.b3dExt.forEach((reachableExtremity: any) => {
//                         if (reachableExtremity.id === mainExtremity.id) return;
//                         if (reachableExtremity.type === 'CONNECTOR' && !rangedToExtremities.concat(rangedFromExtremities).some((v) => v.id === reachableExtremity.id)) return;
//                         mappedGraph[mainExtremity.id] = { ...mappedGraph[mainExtremity.id], [reachableExtremity.id]: branch.lengthMm };
//                     });
//                 }
//             }

//             const graph = new Graph(<any> mappedGraph);
//             const t2 = performance.now();
//             console.log(t2 - t1, ' time to create graph');
//             const t3  = performance.now();

//             const max: number = rangedFromExtremities.length;
//             let currentIteration: number = 0;
//             const finalResult: any[] = [];

//             // return forkable({rangedFromExtremities, rangedToExtremities, graph})
//             //     .then((result: any) => {
//             //         this.listPath = result;
//             //     })
//             return Promise.all(rangedFromExtremities.map((v) => {
//                 rangedToExtremities.forEach((t) => {
//                     if ((v.type === 'CONNECTOR' && t.type === 'CONNECTOR') && v.id !== t.id) {
//                         const result = graph.path(t.id.toString(), v.id.toString(), { cost: true });
//                         if (result.path) {
//                             if (!finalResult.some((existing) => {
//                                 return existing.path.includes(v.id.toString()) && existing.path.includes(t.id.toString());
//                             })) {
//                                 finalResult.push(result);
//                                 // this.listPath.push({
//                                 //     from: v.finDs.map((q: any) => q.instanceName3d),
//                                 //     to: t.finDs.map((q: any) => q.instanceName3d),
//                                 //     lengthMm: Math.round(result.cost)
//                                 // });
//                                 this.listPath.push({
//                                     from: this.formatFin(v.finDs.map((q: any) => q.instanceName3d)),
//                                     to: this.formatFin(t.finDs.map((q: any) => q.instanceName3d)),
//                                     lengthMm: Math.round(result.cost)
//                                 });
//                             }
//                         }
//                     }
//                 });
//                 currentIteration++;
//                 console.log(Math.round((currentIteration * 100) / max) + ' % -- ' + this.listPath.length + ' paths.');
//             }))
//                 .then(() => {
//                     const t4 = performance.now();
//                     console.log(t4 - t3, ' time to find all paths');
//                     resolve(); // => [ 'A', 'B', 'C', 'D' ]
//                 });
//         });
//     }

//     private existing(arr1: Array<Array<any>>, arr2: Array<any>) {

//         if (!arr1.length || !arr2) {
//             return false;
//         }

//         for (const arrItem of arr1) {
//             if (arrItem.length !== arr2.length) continue;
//             let tmp: boolean = true;
//             for (const e2 of arr2) {
//                 if (!arrItem.includes(e2.id)) {
//                     tmp = false;
//                     break;
//                 }
//             }
//             if (tmp) {
//                 return true;
//             }
//         }
//         return false;

//     }

//     private formatFin(fin: Array<string>): FinSequenced[] {
//         const regex = new RegExp(/([0-9]{0,3}[0-9zZ]{1})([a-zA-Z]{2})([0-9a-zA-Z]{0,3})_?([0-9a-zA-Z]{0,3})/, 'g');
//         const mappedData: Array<any> = [];
//         let finRegexed: any;

//         while ((finRegexed = regex.exec(fin.toString()) || undefined) !== undefined) {
//             mappedData.push({
//                 sequenceNumber: finRegexed[1],
//                 circuit: finRegexed[2],
//                 suffix: finRegexed[3] || undefined,
//                 appendedLetter: finRegexed[4] || undefined,
//                 supplementaryPart: finRegexed[5] || undefined
//             });
//         }

//         return mappedData;
//     }

//     private ObjectIncluded(arr1: any, obj2: any) {
//         // Loop through properties in object 1
//         let isIncluded: boolean = false;
//         for (const obj1 of arr1) {
//             if (!isIncluded) {
//                 let tmp: boolean = true;
//                 for (const p in obj1) {
//                     if (obj1[p]) {
//                         if (!obj2.hasOwnProperty(p)) tmp = false;

//                         if (obj1[p] != obj2[p]) tmp = false;
//                     }
//                 }
//                 if (tmp)
//                     isIncluded = true;
//             }
//         }
//         return isIncluded;
//     }
// }
