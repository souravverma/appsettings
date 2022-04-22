import {
  Column,
  DataType,
  Model,
  Table,
  ForeignKey,
  PrimaryKey,
  AutoIncrement,
} from "sequelize-typescript";
import Harness3dDesignSolutionModel from "./Harness3dDesignSolution.model";
import PartZoneModel from "./Partzone.model";

@Table({
  schema: process.env.DB_SCHEMAV2,
  tableName: "harness_3d_ds_pz_relation",
  underscored: true,
  timestamps: false,
})
export default class Harness3dDsPzRelationModel extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id: number;

  @ForeignKey(() => Harness3dDesignSolutionModel)
  @Column({
    field: "fk_harness_3d_design_solution_id",
    type: DataType.INTEGER,
    unique: "u_harness_3d_ds_pz_relation",
  })
  harness3dDesignSolutionId: number;

  @ForeignKey(() => PartZoneModel)
  @Column({
    field: "fk_part_zone_solution_id",
    type: DataType.INTEGER,
    unique: "u_harness_3d_ds_pz_relation",
  })
  partZoneId: number;

  @Column({
    field: "pz_status",
    type: DataType.TEXT,
    allowNull: true,
  })
  pzStatus: string;
}
