import {
  PrimaryKey,
  AutoIncrement,
  Column,
  DataType,
  Model,
  Table,
  HasMany,
} from "sequelize-typescript";
import Harness3dDesignSolutionModel from "./Harness3dDesignSolution.model";

@Table({
  schema: process.env.DB_SCHEMAV2,
  tableName: "major_component_assembly",
  timestamps: true,
  paranoid: true,
  underscored: true,
})
export default class MajorComponentAssemblyModel extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id: number;

  @Column({
    field: "name",
    type: DataType.TEXT,
    allowNull: true,
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

  @HasMany(() => Harness3dDesignSolutionModel, "fk_major_component_assembly_id")
  harness3d: Harness3dDesignSolutionModel[];
}
