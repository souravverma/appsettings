import {
  PrimaryKey,
  AutoIncrement,
  Column,
  DataType,
  Model,
  Table,
  BelongsTo,
  HasMany,
} from "sequelize-typescript";
import DeliverableAssemblyModel from "./DeliverableAssembly.model";
import Harness3dDesignSolutionModel from "./Harness3dDesignSolution.model";
import HarnessManufacturingSubAssemblyModel from "./HarnessManufacturingSubassembly.model";

@Table({
  schema: process.env.DB_SCHEMAV2,
  tableName: "deliverable_assembly_solution",
  timestamps: true,
  paranoid: true,
  underscored: true,
})
export default class DeliverableAssemblySolutionModel extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id: number;

  @Column({
    field: "deliverable_assembly_solution",
    type: DataType.TEXT,
    allowNull: true,
  })
  deliverableAssemblySolution: string;

  @Column({
    field: "status",
    type: DataType.TEXT,
    allowNull: false,
  })
  status: string;

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

  @BelongsTo(() => DeliverableAssemblyModel, "fk_deliverable_assembly_id")
  dA: DeliverableAssemblyModel;

  @HasMany(
    () => Harness3dDesignSolutionModel,
    "fk_deliverable_assembly_solution_id"
  )
  harness3d: Harness3dDesignSolutionModel[];

  @HasMany(
    () => HarnessManufacturingSubAssemblyModel,
    "fk_deliverable_assembly_solution_id"
  )
  hManufSA: Harness3dDesignSolutionModel[];
}
