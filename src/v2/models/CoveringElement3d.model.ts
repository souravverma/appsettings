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
import Branch3dExtremityCoveringElementRelation from "./Branch3dExtremityCoveringElementRelation.model";
import Branch3dModel from "./Branch3d.model";
import Branch3dCoveringElementSolutionRelationModel from "./Branch3dCoveringElementSolutionRelation.model";
import CoveringElementTypeModel from "./CoveringElementType.model";
import ComponentModel from "./Component.model";

@Table({
  schema: process.env.DB_SCHEMAV2,
  tableName: "covering_element_3d",
  timestamps: true,
  paranoid: true,
  underscored: true,
})
export default class CoveringElement3dModel extends Model {
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
    field: "length_mm",
    type: DataType.INTEGER,
    allowNull: true,
  })
  lengthMm: number;

  @Column({
    field: "diameter_mm",
    type: DataType.INTEGER,
    allowNull: true,
  })
  diameterMm: number;

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

  @Column({
    field: "printed_label_1",
    type: DataType.TEXT,
    allowNull: true,
  })
  printedLabel1: string;

  @Column({
    field: "printed_label_2",
    type: DataType.TEXT,
    allowNull: true,
  })
  printedLabel2: string;

  @Column({
    field: "printed_label_3",
    type: DataType.TEXT,
    allowNull: true,
  })
  printedLabel3: string;

  @BelongsToMany(
    () => Branch3dModel,
    () => Branch3dCoveringElementSolutionRelationModel,
    "coveringElement3dId"
  )
  branch: Branch3dModel[];

  @BelongsTo(() => CoveringElementTypeModel, "fk_covering_element_type_id")
  cvrgElemType: CoveringElementTypeModel;

  @BelongsTo(() => ComponentModel, "fk_component_id")
  component: ComponentModel;

  @HasMany(
    () => Branch3dExtremityCoveringElementRelation,
    "fk_covering_element_3d_id"
  )
  b3dExt: Branch3dExtremityCoveringElementRelation[];
}
