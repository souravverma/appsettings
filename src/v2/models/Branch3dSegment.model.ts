import {
  PrimaryKey,
  AutoIncrement,
  Column,
  DataType,
  Model,
  Table,
  BelongsTo,
} from "sequelize-typescript";
import Branch3dModel from "./Branch3d.model";

@Table({
  schema: process.env.DB_SCHEMAV2,
  tableName: "branch_3d_segment",
  timestamps: true,
  paranoid: true,
  underscored: true,
})
export default class Branch3dSegmentModel extends Model {
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

  @BelongsTo(() => Branch3dModel, "fk_branch_3d_id")
  b3d: Branch3dModel;
}
