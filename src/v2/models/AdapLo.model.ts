import {
  PrimaryKey,
  AutoIncrement,
  Column,
  DataType,
  Model,
  Table,
  BelongsTo,
} from "sequelize-typescript";
import AdapItemModel from "./AdapItem.model";
import Harness3dDesignSolutionModel from "./Harness3dDesignSolution.model";

@Table({
  schema: process.env.DB_SCHEMAV2,
  tableName: "adap_lo",
  underscored: true,
  timestamps: false,
})
export default class AdapLoModel extends Model {
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
    field: "PoE",
    type: DataType.TEXT,
    allowNull: false,
  })
  poe: string;

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

  @BelongsTo(() => AdapItemModel, "fk_adap_item_id")
  adapItem: AdapItemModel;

  @BelongsTo(() => Harness3dDesignSolutionModel, "fk_harness_3d_ds_id")
  harness3d: Harness3dDesignSolutionModel;
}
