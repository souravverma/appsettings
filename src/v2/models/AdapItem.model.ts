import {
  PrimaryKey,
  AutoIncrement,
  Column,
  DataType,
  Model,
  Table,
  BelongsToMany,
  HasMany,
} from "sequelize-typescript";
import AdapItemPartzoneItemRelationModel from "./AdapItemPartzoneItemRelation.model";
import AdapLoModel from "./AdapLo.model";
import PartzoneItemModel from "./PartzoneItem.model";

@Table({
  schema: process.env.DB_SCHEMAV2,
  tableName: "adap_item",
  underscored: true,
  timestamps: false,
})
export default class AdapItemModel extends Model {
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

  @HasMany(() => AdapLoModel, "fk_adap_item_id")
  adapLo: AdapLoModel[];

  @BelongsToMany(
    () => PartzoneItemModel,
    () => AdapItemPartzoneItemRelationModel,
    "adapItemId"
  )
  pzItem: PartzoneItemModel[];
}
