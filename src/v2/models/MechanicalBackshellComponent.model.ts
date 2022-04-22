import {
  PrimaryKey,
  AutoIncrement,
  Column,
  DataType,
  Model,
  Table,
  HasOne,
  BelongsTo,
} from "sequelize-typescript";
import ComponentModel from "./Component.model";

@Table({
  schema: process.env.DB_SCHEMAV2,
  tableName: "mechanical_backshell_component",
  timestamps: true,
  paranoid: true,
  underscored: true,
})
export default class MechanicalBackshellComponentModel extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id: number;

  @Column({
    field: "material",
    type: DataType.TEXT,
    allowNull: true,
  })
  material: string;

  @Column({
    field: "emi",
    type: DataType.BOOLEAN,
    allowNull: true,
  })
  emi: boolean;

  @Column({
    field: "backshell_type",
    type: DataType.TEXT,
    allowNull: true,
  })
  backshellType: string;

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
