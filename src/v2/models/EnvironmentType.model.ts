import {
  PrimaryKey,
  AutoIncrement,
  Column,
  DataType,
  Model,
  Table,
  BelongsToMany,
} from "sequelize-typescript";
import Branch3dEnvironmentRelationModel from "./Branch3dEnvironmentRelation.model";
import Branch3dModel from "./Branch3d.model";

@Table({
  schema: process.env.DB_SCHEMAV2,
  tableName: "environment_type",
  timestamps: true,
  paranoid: true,
  underscored: true,
})
export default class EnvironmentsTypeModel extends Model {
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

  @BelongsToMany(
    () => Branch3dModel,
    () => Branch3dEnvironmentRelationModel,
    "environmentId"
  )
  branches: Branch3dModel[];
}
