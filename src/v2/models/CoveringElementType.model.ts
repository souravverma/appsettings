import {
  PrimaryKey,
  AutoIncrement,
  Column,
  DataType,
  Model,
  Table,
  HasMany,
} from "sequelize-typescript";
import CoveringElement3dModel from "./CoveringElement3d.model";

@Table({
  schema: process.env.DB_SCHEMAV2,
  tableName: "covering_element_type",
  timestamps: true,
  paranoid: true,
  underscored: true,
})
export default class CoveringElementTypeModel extends Model {
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

  @HasMany(() => CoveringElement3dModel, "fk_covering_element_type_id")
  cvrgElem: CoveringElement3dModel[];
}
