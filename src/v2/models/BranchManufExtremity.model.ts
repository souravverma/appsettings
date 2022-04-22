import {
  PrimaryKey,
  AutoIncrement,
  Column,
  DataType,
  Model,
  Table,
  HasOne,
} from "sequelize-typescript";
import Branch3dExtremitySolutionModel from "./Branch3dExtremitySolution.model";

@Table({
  schema: process.env.DB_SCHEMAV2,
  tableName: "branch_manuf_extremity",
  timestamps: true,
  paranoid: true,
  underscored: true,
})
export default class BranchManufExtremityModel extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id: number;

  @Column({
    field: "name",
    type: DataType.TEXT,
    allowNull: false,
  })
  name: string;

  @Column({
    field: "usable_for",
    type: DataType.TEXT,
    allowNull: true,
  })
  usableFor: string;

  @Column({
    field: "created_by",
    type: DataType.TEXT,
    defaultValue: "ce-api-harness",
    allowNull: true,
  })
  createdBy: string;

  @Column({
    field: "updated_by",
    type: DataType.TEXT,
    defaultValue: "ce-api-harness",
    allowNull: true,
  })
  updatedBy: string;

  @HasOne(() => Branch3dExtremitySolutionModel, "fk_branch_manuf_extremity_id")
  b3dExt: Branch3dExtremitySolutionModel;
}
