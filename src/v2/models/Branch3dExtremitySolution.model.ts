import {
  PrimaryKey,
  AutoIncrement,
  Column,
  DataType,
  Model,
  Table,
  BelongsToMany,
  BelongsTo,
  HasMany,
} from "sequelize-typescript";
import CoveringElement3dModel from "./CoveringElement3d.model";
import Branch3dExtremityCoveringElementRelation from "./Branch3dExtremityCoveringElementRelation.model";
import Branch3dModel from "./Branch3d.model";
import Branch3dExtremityRelationModel from "./Branch3dExtremityRelation.model";
import BranchManufExtremityModel from "./BranchManufExtremity.model";
import Branch3dExtremityTypeModel from "./Branch3dExtremityType.model";
import FunctionalItem3dSolutionModel from "./FunctionalItem3dSolution.model";
import Branch3dExtremityFinDsRelationModel from "./Branch3dExtremityFinDsRelation.model";

@Table({
  schema: process.env.DB_SCHEMAV2,
  tableName: "branch_3d_extremity_solution",
  timestamps: true,
  paranoid: true,
  underscored: true,
})
export default class Branch3dExtremitySolutionModel extends Model {
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
    field: "electrical_coordinate_x",
    type: DataType.FLOAT,
    allowNull: false,
  })
  electricalCoordinateX: number;

  @Column({
    field: "electrical_coordinate_y",
    type: DataType.FLOAT,
    allowNull: false,
  })
  electricalCoordinateY: number;

  @Column({
    field: "electrical_coordinate_z",
    type: DataType.FLOAT,
    allowNull: false,
  })
  electricalCoordinateZ: number;

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

  @BelongsTo(() => BranchManufExtremityModel, "fk_branch_manuf_extremity_id")
  bManuf: BranchManufExtremityModel;

  @BelongsTo(() => Branch3dExtremityTypeModel, "fk_branch_3d_extremity_type_id")
  type: Branch3dExtremityTypeModel;

  @HasMany(
    () => Branch3dExtremityCoveringElementRelation,
    "fk_branch_3d_extremity_id"
  )
  cvrgElem: Branch3dExtremityCoveringElementRelation[];

  @BelongsToMany(
    () => FunctionalItem3dSolutionModel,
    () => Branch3dExtremityFinDsRelationModel,
    "branch3dExtremityId"
  )
  finDs: FunctionalItem3dSolutionModel[];

  @BelongsToMany(
    () => Branch3dModel,
    () => Branch3dExtremityRelationModel,
    "branch3dExtremityId"
  )
  b3d: Branch3dModel[];
}
