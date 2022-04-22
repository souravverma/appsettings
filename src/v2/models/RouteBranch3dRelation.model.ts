import {
  Column,
  DataType,
  Model,
  Table,
  ForeignKey,
  PrimaryKey,
  AutoIncrement,
} from "sequelize-typescript";
import Branch3dModel from "./Branch3d.model";
import RouteCategoryModel from "./RouteCategory.model";

@Table({
  schema: process.env.DB_SCHEMAV2,
  tableName: "route_branch_3d_relation",
  underscored: true,
  timestamps: false,
})
export default class RouteBranch3dRelationModel extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id: number;

  @ForeignKey(() => Branch3dModel)
  @Column({
    field: "fk_branch_3d_id",
    type: DataType.INTEGER,
    unique: "u_route_branch_3d_relation",
  })
  branch3dId: number;

  @ForeignKey(() => RouteCategoryModel)
  @Column({
    field: "fk_route_category_id",
    type: DataType.INTEGER,
    unique: "u_route_branch_3d_relation",
  })
  routeCategoryId: number;
}
