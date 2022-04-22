import {
  PrimaryKey,
  AutoIncrement,
  Column,
  DataType,
  Model,
  Table,
  ForeignKey,
  HasMany,
} from "sequelize-typescript";
import AircraftProgramModel from "./AircraftProgram.model";
import DomainModel from "./Domain.model";

@Table({
  schema: process.env.DB_SCHEMAV2,
  tableName: "aircraft_letter_relation",
  underscored: true,
  timestamps: false,
})
export default class AircraftLetterRelationModel extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id: number;

  @Column({
    field: "aircraft_letter",
    type: DataType.TEXT,
    allowNull: false,
    unique: "u_aircraft_letter_relation",
  })
  aircraftLetter: string;

  @ForeignKey(() => AircraftProgramModel)
  @Column({
    field: "fk_aircraft_program_id",
    type: DataType.INTEGER,
    unique: "u_aircraft_letter_relation",
  })
  aircraftProgramId: number;

  @ForeignKey(() => DomainModel)
  @Column({
    field: "fk_domain_id",
    type: DataType.INTEGER,
    unique: "u_aircraft_letter_relation",
  })
  domainId: number;
}
