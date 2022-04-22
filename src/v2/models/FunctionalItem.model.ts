import {
  PrimaryKey,
  AutoIncrement,
  Column,
  DataType,
  Model,
  Table,
  HasMany,
  BelongsTo,
  BelongsToMany,
} from "sequelize-typescript";
import Harness3dDesignSolutionModel from "./Harness3dDesignSolution.model";
import CircuitModel from "./Circuit.model";
import AircraftProgramModel from "./AircraftProgram.model";
import FunctionalItem3dSolutionModel from "./FunctionalItem3dSolution.model";
import FunctionalItemHarness3dDesignSolutionRelationModel from "./FunctionalItemHarness3dDsRelation.model";

@Table({
  schema: process.env.DB_SCHEMAV2,
  tableName: "functional_item",
  timestamps: true,
  paranoid: true,
  underscored: true,
})
export default class FunctionalItemModel extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id: number;

  @Column({
    field: "sequence_number",
    type: DataType.TEXT,
    allowNull: false,
  })
  sequenceNumber: string;

  @Column({
    field: "suffix",
    type: DataType.TEXT,
    allowNull: true,
  })
  suffix: string;

  @Column({
    field: "appended_letter",
    type: DataType.TEXT,
    allowNull: true,
  })
  appendedLetter: string;

  @Column({
    field: "supplementary_part",
    type: DataType.TEXT,
    allowNull: true,
  })
  supplementaryPart: string;

  @Column({
    field: "description",
    type: DataType.TEXT,
    allowNull: true,
  })
  description: string;

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

  @HasMany(() => FunctionalItem3dSolutionModel, "fk_functional_item_id")
  finSol: FunctionalItem3dSolutionModel[];

  @BelongsTo(() => CircuitModel, "fk_circuit_id")
  circuit: CircuitModel;

  @BelongsTo(() => AircraftProgramModel, "fk_aircraft_program_id")
  aircraftPrgm: AircraftProgramModel;

  @BelongsToMany(
    () => Harness3dDesignSolutionModel,
    () => FunctionalItemHarness3dDesignSolutionRelationModel,
    "functionalItemId"
  )
  harness3d: Harness3dDesignSolutionModel[];
}
