import {
  Column,
  DataType,
  Model,
  Table,
  ForeignKey,
  PrimaryKey,
  AutoIncrement,
} from "sequelize-typescript";
import ValidityModel from "./Validity.model";
import DeliverableAssemblySolutionModel from "./DeliverableAssemblySolution.model";

@Table({
  schema: process.env.DB_SCHEMAV2,
  tableName: "validity_da_solution_relation",
  underscored: true,
  timestamps: false,
})
export default class ValidityDaSolutionRelationModel extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id: number;

  @ForeignKey(() => ValidityModel)
  @Column({
    field: "fk_validity_id",
    type: DataType.INTEGER,
    unique: "u_" + Table.name,
  })
  ValidityId: number;

  @ForeignKey(() => DeliverableAssemblySolutionModel)
  @Column({
    field: "fk_deliverable_assembly_solution_id",
    type: DataType.INTEGER,
    unique: "u_" + Table.name,
  })
  DeliverableAssemblySolutionId: number;
}
