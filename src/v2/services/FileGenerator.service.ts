// import { IFileGenerator, IDecFile, IValidity, ILonFile } from '../interfaces/FilesExtracted.interface';
// import HarnessVbModel from '../models/HarnessVb.model';
// import FinDsModel from '../models/functionalItem.model';
// import Branch3DExtremityModel from '../models/Branch3DExtremity.model';
// import Branch3DModel from '../models/Branch3D.model';
// import HarnessManufacturingModel from '../models/HarnessManufacturing.model';
// import SubAssemblyModel from '../models/SubAssembly.model';
// import * as fs  from 'fs';
// import BranchExtremityManufacturingModel from '../models/BranchExtremityManufacturing.model';

// class FileGenerator implements IFileGenerator {

//     constructor() {

//     }

//     generateDecFile(): Promise<string> {
//         return new Promise((resolve, reject) => {
//             this.getAllDecData()
//             .then((decFile) => {
//                 this.storeFile(decFile.join('\r\n'), 'dec');
//                 resolve(decFile.join('\r\n'));
//             })
//             .catch((err: Error) => {
//                 reject(err);
//             });
//         });
//     }

//     generateLonFile(): Promise<string> {
//         return new Promise((resolve, reject) => {
//             this.getAllLonData()
//             .then((lonFile) => {
//                 this.storeFile(lonFile.join('\r\n'), 'lon');
//                 resolve(lonFile.join('\r\n'));
//             })
//             .catch((err: Error) => {
//                 reject(err);
//             });
//         });
//     }

//     private getAllDecData(): Promise<string[]> {
//         return new Promise((resolve, reject) => {
//             HarnessManufacturingModel.findAll({
//                 where: { status : 'validated' },
//                 attributes: ['validity', 'deliverableAssembly'],
//                 subQuery: false,
//                 include: [{
//                     model: SubAssemblyModel,
//                     required: true
//                 }, {
//                     model: HarnessVbModel,
//                     attributes: ['adapDsNumber'],
//                     required: true,
//                     include: [{
//                         model: Branch3DModel,
//                         attributes: ['id', 'effectiveRoutes', 'lengthForced', 'length'],
//                         required: true,
//                         include: [{
//                             model: Branch3DExtremityModel,
//                             attributes: ['id'],
//                             required: true,
//                             include: [{
//                                 model: FinDsModel,
//                                 attributes: ['sequenceNumber', 'circuit', 'suffix', 'appendedLetter', 'effectiveRoutes', 'cDRoot', 'priority'],
//                                 required: true
//                             }, {
//                                 model: BranchExtremityManufacturingModel,
//                                 attributes: ['name'],
//                                 required: true
//                             }]
//                         }]
//                     }]
//                 }],
//             })
//             .then((result: HarnessManufacturingModel[]) => {
//                 if (!result.length)
//                     resolve(['20DEB 1172VT    11    5E    1172VT    11    D955Z6668       4 D955Z6668      8COM  00010     DZ1745     0                   N ']);
//                 const tab: string[] = [];
//                 for (const harnessManufacturing of result) {
//                     for (const branch of harnessManufacturing.hVb.b3D) {
//                         for (const branchExtremity of branch.b3DExt) {
//                             for (const finDsComponent of branchExtremity.finDs) {
//                                 let FIN: string;
//                                 FIN = this.lengthFormated(finDsComponent.sequenceNumber, 4, 'right') + this.lengthFormated(finDsComponent.circuit, 2);
//                                 FIN += finDsComponent.suffix ? this.lengthFormated(finDsComponent.suffix, 3) : this.filler(3);
//                                 FIN += finDsComponent.appendedLetter ? this.lengthFormated(finDsComponent.appendedLetter, 3, 'right') : this.filler(3);
//                                 const validityTab = harnessManufacturing.validity.split(',');
//                                 const drawingRootRegex = new RegExp(/(\d{0,3}[\dzZ]{1})([a-zA-Z-]{2})([0-9a-zA-Z]{0,3})_?([0-9a-zA-Z]{0,3})/).exec(finDsComponent.cDRoot);

//                                 let drawingRoot: string;
//                                 drawingRoot = this.lengthFormated(drawingRootRegex[1], 4, 'right') + this.lengthFormated(drawingRootRegex[2], 2);
//                                 drawingRoot += drawingRootRegex[3] ? this.lengthFormated(drawingRootRegex[3], 3) : this.filler(3);
//                                 drawingRoot += drawingRootRegex[4] ? this.lengthFormated(drawingRootRegex[4], 3, 'right') : this.filler(3);

//                                 for (const validity of validityTab) {
//                                     const splittedValidity = validity.split('_');
//                                     const formatedValidity: IValidity = {
//                                         type: this.lengthFormated(splittedValidity[0], 1),
//                                         code: this.lengthFormated(splittedValidity[1], 5),
//                                         from: this.lengthFormated(splittedValidity[2], 5),
//                                         to: this.lengthFormated(splittedValidity[3], 5)
//                                     };
//                                     const routeList = finDsComponent.effectiveRoutes.split(',');
//                                     for (const route of routeList) {
//                                         const structure: IDecFile = {};
//                                         structure.CCTE = this.lengthFormated('20DE' , 4);
//                                         structure.CAT = this.lengthFormated('B' , 1);
//                                         structure.filler1 = this.filler(1);
//                                         structure.RRPEI = this.lengthFormated(FIN, 15);
//                                         structure.filler2 = this.filler(1);
//                                         structure.LRO = this.lengthFormated(route, 5);
//                                         structure.filler3 = this.filler(1);
//                                         structure.RRABR = this.lengthFormated(drawingRoot, 15);
//                                         structure.filler4 = this.filler(1);
//                                         structure.RENCS = this.lengthFormated(harnessManufacturing.deliverableAssembly, 15);
//                                         structure.filler5 = this.filler(1);
//                                         structure.CSTBD = this.lengthFormated(finDsComponent.priority, 1);
//                                         structure.filler6 = this.filler(1);
//                                         structure.RSEDE = this.lengthFormated(harnessManufacturing.subA.deliverableAssembly, 15);
//                                         structure.CLM = this.lengthFormated(formatedValidity.type, 1);
//                                         structure.CSGVSA = formatedValidity.code || this.filler(5);
//                                         structure.NRGD = formatedValidity.from || this.filler(5);
//                                         structure.NRGDFN = formatedValidity.to || this.filler(5);
//                                         structure.CLS = this.lengthFormated('D', 1);
//                                         structure.PINRO = this.lengthFormated(branchExtremity.bExtManuf.name, 6);
//                                         structure.QLOCB = this.lengthFormated('0', 5, 'right');
//                                         structure.filler7 = this.filler(1);
//                                         structure.CAK = this.filler(3);
//                                         structure.RRFXX2 = this.filler(15);
//                                         structure.CTF = this.lengthFormated('N', 2);

//                                         if (Object.values(structure).join('').length !== 126) {
//                                             reject(new Error('formated line isn\'t equal to 126 caracteres. ' + structure));
//                                         }
//                                         if (!tab.includes(Object.values(structure).join('')))
//                                             tab.push(Object.values(structure).join(''));
//                                     }
//                                 }
//                             }
//                         }
//                     }
//                 }

//                 resolve(tab);
//             })
//             .catch((err: Error) => {
//                 reject(err);
//             });
//         });
//     }

//     private getAllLonData(): Promise<string[]> {
//         return new Promise((resolve, reject) => {
//             Branch3DModel.findAll({
//                 subQuery: false,
//                 include: [{
//                     model: Branch3DExtremityModel,
//                     required: true,
//                     include: [{
//                         model: BranchExtremityManufacturingModel,
//                         required: true
//                     }]
//                 }, {
//                     model: HarnessVbModel,
//                     required: true,
//                     include: [{
//                         model: HarnessManufacturingModel,
//                         where: {status: 'validated'},
//                         required: true
//                     }]
//                 }]
//             })
//             .then((branch3DList: Branch3DModel[]) => {
//                 if (!branch3DList.length)
//                     resolve(['20LOB Z1742          Z1743      D955Z6668            018                        3    N ']);
//                 const tabs: string[] = [];
//                 for (const b3D of branch3DList) {
//                     if (b3D.b3DExt.length === 2) {
//                         const structure: ILonFile = {
//                             CCTE: this.lengthFormated('20LO', 4),
//                             CAT: this.lengthFormated('B', 1),
//                             filler1: this.filler(1),
//                             PDELO: this.lengthFormated(b3D.b3DExt[0].bExtManuf.name, 10),
//                             LRO: this.filler(5),
//                             PARLO: this.lengthFormated(b3D.b3DExt[1].bExtManuf.name, 10),
//                             filler2: this.filler(1),
//                             RENCS: this.lengthFormated(b3D.hVb.hManuf.deliverableAssembly, 15),
//                             filler3: this.filler(6),
//                             NPC: this.lengthFormated('01', 2),
//                             CLM: this.lengthFormated('7', 1),
//                             CSGVSA: this.filler(5),
//                             NRGDE: this.filler(5),
//                             NRGFN: this.filler(5),
//                             filler4: this.filler(5),
//                             QLOCB: b3D.lengthForced !== 0 ? this.lengthFormated(Math.round(b3D.lengthForced / 10), 5, 'right') : this.lengthFormated(Math.round(b3D.length / 10), 5, 'right'),
//                             filler5: this.filler(1),
//                             CAK: this.filler(3),
//                             CTF: this.lengthFormated('N', 2)
//                         };
//                         if (Object.values(structure).join('').length !== 87) {
//                             reject(new Error('formated line isn\'t equal to 126 caracteres. ' + structure));
//                         }
//                         if (!tabs.includes(Object.values(structure).join('')))
//                             tabs.push(Object.values(structure).join(''));
//                     }
//                 }
//                 resolve(tabs);

//             })
//             .catch((err: Error) => {
//                 reject(err);
//             });
//         });
//     }

//     private lengthFormated(input: string | number, filler: number, justify: 'right' | 'left' = 'left'): string {
//         const dataLength = String(input).length;

//         if (typeof(input) === 'undefined') {
//             throw new Error('One or several data are missing');
//         }

//         if (dataLength < filler) {
//             if (justify === 'right') {
//                 return this.filler(filler - dataLength) + input;
//             }
//             else if (justify === 'left') {
//                 return input + this.filler(filler - dataLength);
//             }
//         }
//         else if (dataLength > filler) {
//             throw new Error('Length error with input : ' + input);
//         }
//         else {
//             return String(input);
//         }
//     }

//     private filler(amount: number = 1) {
//         return new Array(1 + amount).join(' ');
//     }

//     private storeFile(content: string, type: 'dec' | 'lon') {
//         const dir = './Dec&Lon';
//         const dateToday = new Date();
//         const todayFormated = `${dateToday.getMonth() + 1}-${dateToday.getDate()}-${dateToday.getFullYear()}`;
//         const dateTomorrow = new Date();
//         dateTomorrow.setDate(dateToday.getDate() - 10);
//         const tomorrowFormated = `${dateTomorrow.getMonth() + 1}-${dateTomorrow.getDate()}-${dateTomorrow.getFullYear()}`;
//         const fileName =  `ADP.TF5N.NIS${type.toUpperCase()}E1-${todayFormated}`;
//         const oldfileName =  `ADP.TF5N.NIS${type.toUpperCase()}E1-${tomorrowFormated}`;
//         if (!fs.existsSync(dir)) {
//             fs.mkdirSync(dir);
//         }

//         fs.open(dir + '/' + fileName, 'w', (err, fd) => {
//             if (err) {
//                 throw err;
//             }

//             fs.write(fd, content, (err) => {
//                 if (err)
//                     throw err;

//                 console.log('File ' + fileName + ' created.');
//             });
//         });

//         console.log(oldfileName);
//         fs.unlink(dir + '/' + oldfileName, (err) => {
//             if (!err) {
//                 console.log('file ' + oldfileName + ' deleted');
//             }
//         });
//     }
// }

// const fileGenerator = new FileGenerator();
// export default fileGenerator;
