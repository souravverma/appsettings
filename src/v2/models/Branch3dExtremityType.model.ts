import {
  PrimaryKey,
  AutoIncrement,
  Column,
  DataType,
  Model,
  Table,
  BelongsToMany,
  HasMany,
} from "sequelize-typescript";
import Branch3dExtremitySolutionModel from "./Branch3dExtremitySolution.model";

@Table({
  schema: process.env.DB_SCHEMAV2,
  tableName: "branch_3d_extremity_type",
  timestamps: true,
  paranoid: true,
  underscored: true,
})
export default class Branch3dExtremityTypeModel extends Model {
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

  @HasMany(
    () => Branch3dExtremitySolutionModel,
    "fk_branch_3d_extremity_type_id"
  )
  b3dExt: Branch3dExtremitySolutionModel[];
}
