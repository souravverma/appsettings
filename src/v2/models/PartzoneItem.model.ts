import {
  PrimaryKey,
  AutoIncrement,
  Column,
  DataType,
  Model,
  Table,
  BelongsToMany,
  BelongsTo,
} from "sequelize-typescript";
import AdapItemModel from "./AdapItem.model";
import AdapItemPartzoneItemRelationModel from "./AdapItemPartzoneItemRelation.model";
import PartZoneModel from "./Partzone.model";
import UserAreaModel from "./UserAreaPartZone.model";

@Table({
  schema: process.env.DB_SCHEMAV2,
  tableName: "part_zone_item",
  underscored: true,
  timestamps: false,
})
export default class PartzoneItemModel extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id: number;

  @Column({
    field: "number",
    type: DataType.TEXT,
    allowNull: false,
  })
  number: string;

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

  @BelongsTo(() => UserAreaModel, "fk_user_area_id")
  userArea: UserAreaModel;

  @BelongsTo(() => PartZoneModel, "fk_part_zone_solution_id")
  partzone: PartZoneModel;

  @BelongsToMany(
    () => AdapItemModel,
    () => AdapItemPartzoneItemRelationModel,
    "pzItemId"
  )
  adapItem: AdapItemModel[];
}
