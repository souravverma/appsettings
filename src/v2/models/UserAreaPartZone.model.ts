import {
  PrimaryKey,
  AutoIncrement,
  Column,
  DataType,
  Model,
  Table,
  HasMany,
} from "sequelize-typescript";
import PartZoneModel from "./Partzone.model";
import PartzoneItemModel from "./PartzoneItem.model";

@Table({
  schema: process.env.DB_SCHEMAV2,
  tableName: "user_area_part_zone",
  timestamps: true,
  paranoid: true,
  underscored: true,
})
export default class UserAreaModel extends Model {
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

  @HasMany(() => PartZoneModel, "fk_user_area_id")
  partZone: PartZoneModel[];

  @HasMany(() => PartzoneItemModel, "fk_user_area_id")
  pzItem: PartzoneItemModel[];
}
