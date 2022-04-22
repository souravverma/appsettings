import {
  Column,
  DataType,
  Model,
  Table,
  ForeignKey,
  PrimaryKey,
  AutoIncrement,
} from "sequelize-typescript";
import CoveringElement3dModel from "./CoveringElement3d.model";
import Branch3dModel from "./Branch3d.model";

@Table({
  schema: process.env.DB_SCHEMAV2,
  tableName: "branch_3d_covering_element_solution_relation",
  underscored: true,
  timestamps: false,
})
export default class Branch3dCoveringElementSolutionRelationModel extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id: number;

  @ForeignKey(() => Branch3dModel)
  @Column({
    field: "fk_branch_3d_id",
    type: DataType.INTEGER,
    unique: "u_branch_3d_covering_element_solution_relation",
  })
  branch3dId: number;

  @ForeignKey(() => CoveringElement3dModel)
  @Column({
    field: "fk_covering_element_3d_id",
    type: DataType.INTEGER,
    unique: "u_branch_3d_covering_element_solution_relation",
  })
  coveringElement3dId: number;
}
