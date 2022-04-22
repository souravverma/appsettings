import {
  PrimaryKey,
  AutoIncrement,
  Column,
  DataType,
  Model,
  Table,
  HasMany,
} from "sequelize-typescript";
import DeliverableAssemblySolutionModel from "./DeliverableAssemblySolution.model";

@Table({
  schema: process.env.DB_SCHEMAV2,
  tableName: "deliverable_assembly",
  timestamps: true,
  paranoid: true,
  underscored: true,
})
export default class DeliverableAssemblyModel extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id: number;

  @Column({
    field: "number",
    type: DataType.TEXT,
    allowNull: true,
  })
  number: string;

  @Column({
    field: "constituent_assembly_number",
    type: DataType.TEXT,
    allowNull: true,
  })
  constituentAssemblyNumber: string;

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

  @HasMany(
    () => DeliverableAssemblySolutionModel,
    "fk_deliverable_assembly_model_id"
  )
  dASol: DeliverableAssemblySolutionModel[];
}
