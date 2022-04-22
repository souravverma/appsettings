import {
  PrimaryKey,
  AutoIncrement,
  Column,
  DataType,
  Model,
  Table,
  ForeignKey,
  HasMany,
} from "sequelize-typescript";
import AdapItemModel from "./AdapItem.model";
import PartzoneItemModel from "./PartzoneItem.model";

@Table({
  schema: process.env.DB_SCHEMAV2,
  tableName: "adap_item_pz_item_relation",
  underscored: true,
  timestamps: false,
})
export default class AdapItemPartzoneItemRelationModel extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id: number;

  @ForeignKey(() => PartzoneItemModel)
  @Column({
    field: "fk_pz_item_id",
    type: DataType.INTEGER,
    unique: "u_adap_item_partzone_item_relation",
  })
  pzItemId: number;

  @ForeignKey(() => AdapItemModel)
  @Column({
    field: "fk_adap_item_id",
    type: DataType.INTEGER,
    unique: "u_adap_item_partzone_item_relation",
  })
  adapItemId: number;
}
