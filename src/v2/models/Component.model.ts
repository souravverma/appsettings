import {
  PrimaryKey,
  AutoIncrement,
  Column,
  DataType,
  Model,
  Table,
  HasMany,
  HasOne,
  BelongsTo,
} from "sequelize-typescript";
import MarkerComponentModel from "./markerComponent.model";
import MechanicalBackshellComponentModel from "./MechanicalBackshellComponent.model";
import Backshell3dSolutionModel from "./Backshell3dSolution.model";
import MechanicalCoveringElementComponentModel from "./MechanicalCoveringElementComponent.model";
import CoveringElement3dModel from "./CoveringElement3d.model";

@Table({
  schema: process.env.DB_SCHEMAV2,
  tableName: "component",
  timestamps: true,
  paranoid: true,
  underscored: true,
})
export default class ComponentModel extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id: number;

  @Column({
    field: "part_number",
    type: DataType.TEXT,
    allowNull: false,
  })
  partNumber: string;

  @Column({
    field: "norm",
    type: DataType.TEXT,
    allowNull: true,
  })
  norm: string;

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

  @HasMany(() => Backshell3dSolutionModel, "fk_component_id")
  backshells: Backshell3dSolutionModel[];

  @HasMany(() => MechanicalBackshellComponentModel, "fk_component_id")
  mechaBackshellCpnts: MechanicalBackshellComponentModel[];

  @HasMany(() => MechanicalCoveringElementComponentModel, "fk_component_id")
  mechaCvrgElemCpnts: MechanicalCoveringElementComponentModel[];

  @HasMany(() => CoveringElement3dModel, "fk_component_id")
  cvrgElem: CoveringElement3dModel[];

  @HasMany(() => MarkerComponentModel, "fk_component_id")
  markerComponents: MarkerComponentModel[];
}
