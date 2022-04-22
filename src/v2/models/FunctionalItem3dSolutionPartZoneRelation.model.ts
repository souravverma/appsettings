import {
  PrimaryKey,
  AutoIncrement,
  Column,
  DataType,
  Model,
  Table,
  ForeignKey,
  BelongsToMany,
  BelongsTo,
} from "sequelize-typescript";
import FunctionalItem3dSolutionModel from "./FunctionalItem3dSolution.model";
import PartZoneModel from "./Partzone.model";
import RouteCategoryModel from "./RouteCategory.model";
import FinPartZoneRouteRelation from "./FinPartZoneRouteRelation.model";
import ConnectionStatus from "./ConnectionStatus.model";

@Table({
  schema: process.env.DB_SCHEMAV2,
  tableName: "functional_item_3d_solution_partzone_relation",
  underscored: true,
  timestamps: false,
})
export default class FunctionalItemSolutionPartZoneRelation extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column({
    field: "id",
    type: DataType.INTEGER,
  })
  id: number;

  @Column({
    field: "mounting_priority",
    type: DataType.TEXT,
  })
  mountingPriority: string;

  @ForeignKey(() => FunctionalItem3dSolutionModel)
  @Column({
    field: "fk_functional_item_3d_solution_id",
    type: DataType.INTEGER,
    unique: "u_functional_item_3d_solution_partzone_relation",
  })
  functionalItem3dSolutionId: number;

  @ForeignKey(() => PartZoneModel)
  @Column({
    field: "fk_part_zone_solution_id",
    type: DataType.INTEGER,
    unique: "u_functional_item_3d_solution_partzone_relation",
  })
  partZoneId: number;

  @BelongsToMany(
    () => RouteCategoryModel,
    () => FinPartZoneRouteRelation,
    "finPartZoneRouteId"
  )
  effectiveRoutes: RouteCategoryModel[];

  @BelongsTo(() => ConnectionStatus, "fk_connection_status_id")
  connStatus: ConnectionStatus;
}
