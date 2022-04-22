import {
  PrimaryKey,
  AutoIncrement,
  Column,
  DataType,
  Model,
  Table,
  BelongsTo,
  BelongsToMany,
  HasMany,
} from "sequelize-typescript";
import FunctionalItemModel from "./FunctionalItem.model";
import PartZoneModel from "./Partzone.model";
import FunctionalItemSolutionPartZoneRelation from "./FunctionalItem3dSolutionPartZoneRelation.model";
import Branch3dExtremitySolutionModel from "./Branch3dExtremitySolution.model";
import Branch3dExtremityFinDsRelationModel from "./Branch3dExtremityFinDsRelation.model";
import Backshell3dSolutionModel from "./Backshell3dSolution.model";

@Table({
  schema: process.env.DB_SCHEMAV2,
  tableName: "functional_item_3d_solution",
  timestamps: true,
  paranoid: true,
  underscored: true,
})
export default class FunctionalItem3dSolutionModel extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id: number;

  @Column({
    field: "solution_number",
    type: DataType.TEXT,
    allowNull: true,
  })
  solutionNumber: string;

  @Column({
    field: "part_number_3d",
    type: DataType.TEXT,
    allowNull: false,
  })
  partNumber3d: string;

  @Column({
    field: "instance_name_3d",
    type: DataType.TEXT,
    allowNull: true,
  })
  instanceName3d: string;

  @Column({
    field: "definition_zone",
    type: DataType.TEXT,
    allowNull: true,
  })
  definitionZone: string;

  @Column({
    field: "panel",
    type: DataType.TEXT,
    allowNull: true,
  })
  panel: string;

  @Column({
    field: "long_part_number",
    type: DataType.TEXT,
    allowNull: true,
  })
  longPartNumber: string;

  @Column({
    field: "mounting_priority",
    type: DataType.TEXT,
    allowNull: true,
  })
  mountingPriority: string;

  @Column({
    field: "master_source_id",
    type: DataType.TEXT,
    allowNull: true,
  })
  masterSourceId: string;

  @Column({
    field: "position_x",
    type: DataType.DOUBLE,
    allowNull: true,
  })
  positionX: number;

  @Column({
    field: "position_y",
    type: DataType.DOUBLE,
    allowNull: true,
  })
  positionY: number;

  @Column({
    field: "position_z",
    type: DataType.DOUBLE,
    allowNull: true,
  })
  positionZ: number;

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

  @BelongsTo(() => FunctionalItemModel, "fk_functional_item_id")
  fin: FunctionalItemModel;

  @BelongsTo(() => FunctionalItem3dSolutionModel, "fk_mounting_fin_master_id")
  mountingFin: FunctionalItem3dSolutionModel;

  @BelongsToMany(
    () => PartZoneModel,
    () => FunctionalItemSolutionPartZoneRelation,
    "functionalItem3dSolutionId"
  )
  partZone: PartZoneModel[];

  @HasMany(
    () => FunctionalItemSolutionPartZoneRelation,
    "fk_functional_item_3d_solution_id"
  )
  FinPzRelations: FunctionalItemSolutionPartZoneRelation[];

  @BelongsToMany(
    () => Branch3dExtremitySolutionModel,
    () => Branch3dExtremityFinDsRelationModel,
    "finDsId"
  )
  b3dExt: Branch3dExtremitySolutionModel[];

  @HasMany(() => Backshell3dSolutionModel, "fk_fin_sol_id")
  backshells: Backshell3dSolutionModel[];
}
