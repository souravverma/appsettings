import {
  Table,
  Model,
  ForeignKey,
  Column,
  DataType,
  PrimaryKey,
  AutoIncrement,
} from "sequelize-typescript";
import Branch3dModel from "./Branch3d.model";
import Branch3dExtremitySolutionModel from "./Branch3dExtremitySolution.model";

@Table({
  tableName: "branch_3d_extremity_relation",
  schema: process.env.DB_SCHEMAV2,
  underscored: true,
  timestamps: false,
})
export default class Branch3dExtremityRelationModel extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id: number;

  @Column({
    field: "vector_x",
    type: DataType.FLOAT,
    allowNull: false,
  })
  vectorX: number;

  @Column({
    field: "vector_y",
    type: DataType.FLOAT,
    allowNull: false,
  })
  vectorY: number;

  @Column({
    field: "vector_z",
    type: DataType.FLOAT,
    allowNull: false,
  })
  vectorZ: number;

  @ForeignKey(() => Branch3dModel)
  @Column({
    field: "fk_branch_3d_id",
    type: DataType.INTEGER,
    unique: "u_branch_3d_extremity_relation",
  })
  branch3dId: number;

  @ForeignKey(() => Branch3dExtremitySolutionModel)
  @Column({
    field: "fk_branch_3d_extremity_id",
    type: DataType.INTEGER,
    unique: "u_branch_3d_extremity_relation",
  })
  branch3dExtremityId: number;
}
