import {
  Column,
  DataType,
  Model,
  Table,
  ForeignKey,
  PrimaryKey,
  AutoIncrement,
  HasMany,
} from "sequelize-typescript";
import FunctionalItemSolutionPartZoneRelation from "./FunctionalItem3dSolutionPartZoneRelation.model";
import RouteCategoryModel from "./RouteCategory.model";

@Table({
  schema: process.env.DB_SCHEMAV2,
  tableName: "fin_partzone_route_relation",
  underscored: true,
  timestamps: false,
})
export default class FinPartZoneRouteRelation extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id: number;

  @ForeignKey(() => FunctionalItemSolutionPartZoneRelation)
  @Column({
    field: "fk_fin_part_zone_id",
    type: DataType.INTEGER,
    unique: "u_fin_part_zone_route_relation",
  })
  finPartZoneRouteId: number;

  @ForeignKey(() => RouteCategoryModel)
  @Column({
    field: "fk_route_category_id",
    type: DataType.INTEGER,
    unique: "u_fin_part_zone_route_relation",
  })
  routeCategoryId: number;
}
