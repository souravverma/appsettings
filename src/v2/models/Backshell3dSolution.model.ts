import {
  PrimaryKey,
  AutoIncrement,
  Column,
  DataType,
  Model,
  Table,
  BelongsTo,
} from "sequelize-typescript";
import ComponentModel from "./Component.model";
import FunctionalItem3dSolutionModel from "./FunctionalItem3dSolution.model";

@Table({
  schema: process.env.DB_SCHEMAV2,
  tableName: "backshell_3d_solution",
  timestamps: true,
  paranoid: true,
  underscored: true,
})
export default class Backshell3dSolutionModel extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id: number;

  @Column({
    field: "fk_fin_sol_id",
    type: DataType.INTEGER,
    allowNull: true,
  })
  fkFinSol: number;

  @Column({
    field: "backshell_orientation",
    type: DataType.TEXT,
    allowNull: true,
  })
  backshellOrientation: string;

  @Column({
    field: "backshell_orientation_reference",
    type: DataType.TEXT,
    allowNull: true,
  })
  backshellOrientationReference: string;

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
    field: "type",
    type: DataType.TEXT,
    allowNull: true,
  })
  type: string;

  @Column({
    field: "part_number_3d",
    type: DataType.TEXT,
    allowNull: true,
  })
  partNumber3d: string;

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

  @BelongsTo(() => FunctionalItem3dSolutionModel, "fk_fin_sol_id")
  finSol: FunctionalItem3dSolutionModel;

  @BelongsTo(() => ComponentModel, "fk_component_id")
  component: ComponentModel;
}
