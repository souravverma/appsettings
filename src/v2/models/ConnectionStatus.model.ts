import {
  PrimaryKey,
  AutoIncrement,
  Column,
  DataType,
  Model,
  Table,
  HasMany,
} from "sequelize-typescript";
import FunctionalItemSolutionPartZoneRelation from "./FunctionalItem3dSolutionPartZoneRelation.model";

@Table({
  schema: process.env.DB_SCHEMAV2,
  tableName: "connection_status",
  timestamps: true,
  paranoid: true,
  underscored: true,
})
export default class ConnectionStatusModel extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column({
    field: "id",
    type: DataType.INTEGER,
  })
  id: number;

  @Column({
    field: "name",
    type: DataType.TEXT,
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

  @HasMany(
    () => FunctionalItemSolutionPartZoneRelation,
    "fk_connection_status_id"
  )
  finSolPartZone: FunctionalItemSolutionPartZoneRelation[];
}
