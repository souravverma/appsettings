import {
  Column,
  DataType,
  BelongsTo,
  Model,
  Table,
  ForeignKey,
  PrimaryKey,
  AutoIncrement,
} from "sequelize-typescript";
import Harness3dDesignSolutionModel from "./Harness3dDesignSolution.model";
import FunctionalItemModel from "./FunctionalItem.model";

@Table({
  schema: process.env.DB_SCHEMAV2,
  tableName: "functional_item_harness_3d_design_solution_relation",
  underscored: true,
  timestamps: false,
})
export default class FunctionalItemHarness3dDesignSolutionRelationModel extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id: number;

  @ForeignKey(() => Harness3dDesignSolutionModel)
  @Column({
    field: "fk_harness_3d_design_solution_id",
    type: DataType.INTEGER,
    unique: "u_functional_item_harness_3d_design_solution_relation",
  })
  harness3dDesignSolutionId: number;

  @ForeignKey(() => FunctionalItemModel)
  @Column({
    field: "fk_functional_item_id",
    type: DataType.INTEGER,
    unique: "u_functional_item_harness_3d_design_solution_relation",
  })
  functionalItemId: number;
}
