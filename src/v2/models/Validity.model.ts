import {
  PrimaryKey,
  AutoIncrement,
  Column,
  DataType,
  Model,
  Table,
  BelongsTo,
} from "sequelize-typescript";
import AircraftProgramModel from "./AircraftProgram.model";

@Table({
  schema: process.env.DB_SCHEMAV2,
  tableName: "validity",
  timestamps: true,
  paranoid: true,
  underscored: true,
})
export default class ValidityModel extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id: number;

  @Column({
    field: "code",
    type: DataType.TEXT,
    allowNull: false,
  })
  code: string;

  @Column({
    field: "rank_number_from",
    type: DataType.INTEGER,
    allowNull: false,
  })
  rankNumberFrom: number;

  @Column({
    field: "rank_number_to",
    type: DataType.INTEGER,
    allowNull: false,
  })
  rankNumberTo: number;

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
}
