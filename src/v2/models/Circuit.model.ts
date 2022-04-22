import {
  PrimaryKey,
  AutoIncrement,
  Column,
  DataType,
  Model,
  Table,
  HasMany,
  BelongsTo,
} from "sequelize-typescript";
import FunctionalItemModel from "./FunctionalItem.model";
import AircraftProgramModel from "./AircraftProgram.model";
import AircraftLetterRelationModel from "./AircraftLetterRelation.model";

@Table({
  schema: process.env.DB_SCHEMAV2,
  tableName: "circuit",
  timestamps: true,
  paranoid: true,
  underscored: true,
})
export default class CircuitModel extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id: number;

  @Column({
    field: "letters",
    type: DataType.TEXT,
    allowNull: false,
  })
  letters: string;

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

  @HasMany(() => FunctionalItemModel, "fk_circuit_id")
  FIN: FunctionalItemModel[];

  @BelongsTo(() => AircraftProgramModel, "fk_aircraft_program_id")
  aircraftProg: AircraftProgramModel;
}
