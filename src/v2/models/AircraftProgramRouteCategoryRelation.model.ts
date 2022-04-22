import {
  PrimaryKey,
  AutoIncrement,
  Column,
  DataType,
  Model,
  Table,
  HasMany,
  ForeignKey,
} from "sequelize-typescript";
import AircraftProgramModel from "./AircraftProgram.model";
import RouteCategoryModel from "./RouteCategory.model";

@Table({
  schema: process.env.DB_SCHEMAV2,
  tableName: "aircraft_program_route_category_relation",
  underscored: true,
  timestamps: false,
})
export default class AircraftProgramRouteCategoryRelation extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id: number;

  @ForeignKey(() => AircraftProgramModel)
  @Column({
    field: "fk_aircraft_program_id",
    type: DataType.INTEGER,
    unique: "u_aircraft_pg_route_relation",
  })
  aircraftProgramId: number;

  @ForeignKey(() => RouteCategoryModel)
  @Column({
    field: "fk_route_category_id",
    type: DataType.INTEGER,
    unique: "u_aircraft_pg_route_relation",
  })
  routeCategoryId: number;
}
