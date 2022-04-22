import {
  PrimaryKey,
  AutoIncrement,
  Column,
  DataType,
  Model,
  Table,
  BelongsTo,
} from "sequelize-typescript";
import DeliverableAssemblySolutionModel from "./DeliverableAssemblySolution.model";

@Table({
  schema: process.env.DB_SCHEMAV2,
  tableName: "harness_manufacturing_sub_assembly",
  timestamps: true,
  paranoid: true,
  underscored: true,
})
export default class HarnessManufacturingSubAssemblyModel extends Model {
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

  @BelongsTo(
    () => DeliverableAssemblySolutionModel,
    "fk_deliverable_assembly_solution_id"
  )
  dASol: DeliverableAssemblySolutionModel;
}
