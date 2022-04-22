import {
  PrimaryKey,
  AutoIncrement,
  Column,
  DataType,
  Model,
  Table,
  BelongsToMany,
  BelongsTo,
} from "sequelize-typescript";
import AircraftProgramModel from "./AircraftProgram.model";
import ModificationProposalPzSolutionRelationModel from "./ModificationProposalPzSolutionRelation";
import PartZoneModel from "./Partzone.model";

@Table({
  schema: process.env.DB_SCHEMAV2,
  tableName: "modification_proposal",
  underscored: true,
  timestamps: false,
})
export default class ModificationProposalModel extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id: number;

  @Column({
    field: "name",
    type: DataType.TEXT,
    allowNull: false,
  })
  name: string;

  @Column({
    field: "indice",
    type: DataType.TEXT,
    allowNull: true,
  })
  indice: string;

  @Column({
    field: "type",
    type: DataType.TEXT,
    allowNull: true,
  })
  type: string;

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

  @BelongsTo(() => AircraftProgramModel, "fk_aircraft_program_id")
  aircraftPrgm: AircraftProgramModel;

  @BelongsToMany(
    () => PartZoneModel,
    () => ModificationProposalPzSolutionRelationModel,
    "mpDeltaId"
  )
  partzone: PartZoneModel[];
}
