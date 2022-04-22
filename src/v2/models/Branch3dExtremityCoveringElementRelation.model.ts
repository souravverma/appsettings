import {
  Table,
  Model,
  ForeignKey,
  Column,
  DataType,
  PrimaryKey,
  AutoIncrement,
} from "sequelize-typescript";
import CoveringElement3dModel from "./CoveringElement3d.model";
import Branch3dExtremitySolutionModel from "./Branch3dExtremitySolution.model";

@Table({
  tableName: "branch_3d_extremity_covering_element_relation",
  schema: process.env.DB_SCHEMAV2,
  underscored: true,
  timestamps: false,
})
export default class Branch3dExtremityCoveringElementRelation extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id: number;

  @Column({
    field: "length_mm",
    type: DataType.FLOAT,
    unique: "u_branch_3d_extremity_covering_element_relation",
  })
  lengthMm: number;

  @ForeignKey(() => Branch3dExtremitySolutionModel)
  @Column({
    field: "fk_branch_3d_extremity_id",
    type: DataType.INTEGER,
    unique: "u_branch_3d_extremity_covering_element_relation",
  })
  branch3dExtremityId: number;

  @ForeignKey(() => CoveringElement3dModel)
  @Column({
    field: "fk_covering_element_3d_id",
    type: DataType.INTEGER,
    unique: "u_branch_3d_extremity_covering_element_relation",
  })
  coveringElement3dId: number;
}
