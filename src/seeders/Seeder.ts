// import BranchExtremityManufacturingModel from '../v1/models/BranchExtremityManufacturing.model';

class Seeders {
  async start() {
    console.log("Seeder started;");
    await this.BranchExtManuf();
  }

  /**
   * @description Populate the table branch_manuf_extremity with manufactural points used for example for circe-p sending (through ftp).
   *
   * @returns Promise<any>
   * @memberof Seeders
   */
  BranchExtManuf(): Promise<null> {
    const insertablaPoints: Array<any> = [];
    for (let i = 1740; i <= 8999; i++) {
      insertablaPoints.push({ name: "Z" + i, NIS: true });
    }
    // await BranchExtremityManufacturingModel.bulkCreate(insertablaPoints);
    console.log("seed ended.");
    return Promise.resolve(null);
  }
}

const seeder = new Seeders();
export default seeder;
