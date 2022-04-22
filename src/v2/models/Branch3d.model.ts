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
import PartZoneModel from "./Partzone.model";
import EnvironmentsTypeModel from "./EnvironmentType.model";
import Branch3dEnvironmentRelationModel from "./Branch3dEnvironmentRelation.model";
import Branch3dExtremitySolutionModel from "./Branch3dExtremitySolution.model";
import Branch3dExtremityRelationModel from "./Branch3dExtremityRelation.model";
import Branch3dSegmentModel from "./Branch3dSegment.model";
import BranchPointDefinitionModel from "./BranchPointDefinition.model";
import CoveringElement3dModel from "./CoveringElement3d.model";
import Branch3dCoveringElementSolutionRelationModel from "./Branch3dCoveringElementSolutionRelation.model";
import RouteCategoryModel from "./RouteCategory.model";
import RouteBranch3dRelationModel from "./RouteBranch3dRelation.model";

@Table({
  schema: process.env.DB_SCHEMAV2,
  tableName: "branch_3d",
  timestamps: true,
  paranoid: true,
  underscored: true,
})
export default class Branch3dModel extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id: number;

  @Column({
    field: "name",
    type: DataType.TEXT,
    allowNull: false,
  })
  name: string;

  @Column({
    field: "branch_id",
    type: DataType.TEXT,
    allowNull: true,
  })
  branchId: string;

  @Column({
    field: "diameter_3d_mm",
    type: DataType.DOUBLE,
    allowNull: false,
  })
  diameter3dMm: number;

  @Column({
    field: "bend_radius",
    type: DataType.INTEGER,
    allowNull: true,
  })
  bendRadius: number;

  @Column({
    field: "length_mm",
    type: DataType.DOUBLE,
    allowNull: false,
  })
  lengthMm: number;

  @Column({
    field: "length_forced_mm",
    type: DataType.DOUBLE,
    defaultValue: 0,
    allowNull: false,
  })
  lengthForcedMm: number;

  @Column({
    field: "extra_length_mm",
    type: DataType.DOUBLE,
    defaultValue: 0,
    allowNull: false,
  })
  extraLengthMm: number;

  // @Column({
  //   field: 'admissible_routes',
  //   type: DataType.TEXT,
  //   allowNull: true
  // })
  // admissibleRoutes: string;

  // @Column({
  //   field: 'effective_routes',
  //   type: DataType.TEXT,
  //   allowNull: true
  // })
  // effectiveRoutes: string;

  @Column({
    field: "not_extractible",
    type: DataType.BOOLEAN,
    defaultValue: false,
    allowNull: true,
  })
  notExtractible: boolean;

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

  //public whereClause = { name: this.name };

  @BelongsTo(() => PartZoneModel, "fk_part_zone_solution_id")
  partZone: PartZoneModel;

  @BelongsToMany(
    () => EnvironmentsTypeModel,
    () => Branch3dEnvironmentRelationModel,
    "branch3dId"
  )
  environment: EnvironmentsTypeModel[];

  @BelongsToMany(
    () => Branch3dExtremitySolutionModel,
    () => Branch3dExtremityRelationModel,
    "branch3dId"
  )
  b3dExt: Branch3dExtremitySolutionModel[];

  @BelongsToMany(
    () => CoveringElement3dModel,
    () => Branch3dCoveringElementSolutionRelationModel,
    "branch3dId"
  )
  cvrgElem: CoveringElement3dModel[];

  @BelongsToMany(
    () => RouteCategoryModel,
    () => RouteBranch3dRelationModel,
    "branch3dId"
  )
  effectiveRoutes: RouteCategoryModel[];

  @HasMany(() => Branch3dSegmentModel, "fk_branch_3d_id")
  segments: Branch3dSegmentModel[];

  @HasMany(() => BranchPointDefinitionModel, "fk_branch_3d_id")
  b3dpointDef: BranchPointDefinitionModel[];
}
