import {
  Table,
  Model,
  ForeignKey,
  Column,
  DataType,
  PrimaryKey,
  AutoIncrement,
} from "sequelize-typescript";
import Branch3dExtremitySolutionModel from "./Branch3dExtremitySolution.model";
import FunctionalItem3dSolutionModel from "./FunctionalItem3dSolution.model";

@Table({
  tableName: "branch_3d_extremity_fin_ds_relation",
  schema: process.env.DB_SCHEMAV2,
  underscored: true,
  timestamps: false,
})
export default class Branch3dExtremityFinDsRelationModel extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id: number;

  @ForeignKey(() => Branch3dExtremitySolutionModel)
  @Column({
    field: "fk_branch_3d_extremity_id",
    type: DataType.INTEGER,
    unique: "u_branch_3d_extremity_fin_ds_relation",
  })
  branch3dExtremityId: number;

  @ForeignKey(() => FunctionalItem3dSolutionModel)
  @Column({
    field: "fk_fin_ds_id",
    type: DataType.INTEGER,
    unique: "u_branch_3d_extremity_fin_ds_relation",
  })
  finDsId: number;
}
