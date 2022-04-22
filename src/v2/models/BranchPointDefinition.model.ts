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
  tableName: "branch_3d_point_definition",
  timestamps: true,
  paranoid: false,
  underscored: true,
})
export default class BranchPointDefinitionModel extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id: number;

  @Column({
    field: "coordinate_x",
    type: DataType.DOUBLE,
    allowNull: true,
  })
  coordinateX: number;

  @Column({
    field: "coordinate_y",
    type: DataType.DOUBLE,
    allowNull: true,
  })
  coordinateY: number;

  @Column({
    field: "coordinate_z",
    type: DataType.DOUBLE,
    allowNull: true,
  })
  coordinateZ: number;

  @Column({
    field: "vector_x",
    type: DataType.DOUBLE,
    allowNull: true,
  })
  vectorX: number;

  @Column({
    field: "vector_y",
    type: DataType.DOUBLE,
    allowNull: true,
  })
  vectorY: number;

  @Column({
    field: "vector_z",
    type: DataType.DOUBLE,
    allowNull: true,
  })
  vectorZ: number;

  @Column({
    field: "middle",
    type: DataType.BOOLEAN,
    allowNull: true,
  })
  middle: boolean;

  @Column({
    field: "fk_branch_3d_id",
    type: DataType.INTEGER,
    allowNull: true,
  })
  pbranch3d: number;

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
