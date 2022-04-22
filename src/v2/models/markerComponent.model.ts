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

@Table({
  schema: process.env.DB_SCHEMAV2,
  tableName: "marker_component",
  timestamps: true,
  paranoid: true,
  underscored: true,
})
export default class MarkerComponentModel extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id: number;

  @Column({
    field: "Type",
    type: DataType.TEXT,
    allowNull: true,
  })
  type: string;

  @Column({
    field: "Colour",
    type: DataType.TEXT,
    allowNull: true,
  })
  colour: string;

  @Column({
    field: "Material",
    type: DataType.TEXT,
    allowNull: true,
  })
  material: string;

  @Column({
    field: "Function",
    type: DataType.TEXT,
    allowNull: true,
  })
  function: string;

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

  @BelongsTo(() => ComponentModel, "fk_component_id")
  component: ComponentModel;
}
