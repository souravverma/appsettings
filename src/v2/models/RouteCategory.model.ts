import {
  PrimaryKey,
  AutoIncrement,
  Column,
  DataType,
  Model,
  Table,
  BelongsToMany,
  BelongsTo,
} from "sequelize-typescript";
import AircraftProgramModel from "./AircraftProgram.model";
import Branch3dModel from "./Branch3d.model";
import RouteBranch3dRelationModel from "./RouteBranch3dRelation.model";
import FunctionalItemSolutionPartZoneRelation from "./FunctionalItem3dSolutionPartZoneRelation.model";
import FinPartZoneRouteRelation from "./FinPartZoneRouteRelation.model";

@Table({
  schema: process.env.DB_SCHEMAV2,
  tableName: "route_category",
  timestamps: true,
  paranoid: true,
  underscored: true,
})
export default class RouteCategoryModel extends Model {
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
    field: "essential",
    type: DataType.BOOLEAN,
    allowNull: true,
  })
  essential: boolean;

  @Column({
    field: "system",
    type: DataType.INTEGER,
    allowNull: true,
  })
  system: number;

  @Column({
    field: "system_description",
    type: DataType.TEXT,
    allowNull: true,
  })
  systemDescription: string;
  @Column({
    field: "category_code",
    type: DataType.TEXT,
    allowNull: true,
  })
  categoryCode: string;

  @Column({
    field: "category_description",
    type: DataType.TEXT,
    allowNull: true,
  })
  categoryDescription: string;

  @Column({
    field: "remarks",
    type: DataType.TEXT,
    allowNull: true,
  })
  remarks: string;

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

  @BelongsTo(() => AircraftProgramModel, "fk_aircraft_program_id")
  aircraftPrgm: AircraftProgramModel;

  @BelongsToMany(
    () => Branch3dModel,
    () => RouteBranch3dRelationModel,
    "routeCategoryId"
  )
  b3dEffective: Branch3dModel[];

  @BelongsToMany(
    () => FunctionalItemSolutionPartZoneRelation,
    () => FinPartZoneRouteRelation,
    "routeCategoryId"
  )
  finPZ: FunctionalItemSolutionPartZoneRelation[];
}
