import {
  Table,
  Model,
  ForeignKey,
  Column,
  DataType,
  PrimaryKey,
  AutoIncrement,
} from "sequelize-typescript";
import EnvironmentsTypeModel from "./EnvironmentType.model";
import Branch3dModel from "./Branch3d.model";

@Table({
  tableName: "branch_3d_environment_type_relation",
  schema: process.env.DB_SCHEMAV2,
  underscored: true,
  timestamps: false,
})
export default class Branch3dEnvironmentRelationModel extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id: number;

  @ForeignKey(() => Branch3dModel)
  @Column({
    field: "fk_branch_3d_id",
    type: DataType.INTEGER,
    unique: "u_branch_3d_environment_type_relation",
  })
  branch3dId: number;

  @ForeignKey(() => EnvironmentsTypeModel)
  @Column({
    field: "fk_environment_type_id",
    type: DataType.INTEGER,
    unique: "u_branch_3d_environment_type_relation",
  })
  environmentId: number;
}
