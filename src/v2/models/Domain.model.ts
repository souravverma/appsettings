import {
  PrimaryKey,
  AutoIncrement,
  Column,
  DataType,
  Model,
  Table,
  BelongsToMany,
  HasMany,
} from "sequelize-typescript";
import AircraftProgramModel from "./AircraftProgram.model";
import AircraftLetterRelationModel from "./AircraftLetterRelation.model";

@Table({
  schema: process.env.DB_SCHEMAV2,
  tableName: "domain",
  timestamps: true,
  paranoid: true,
  underscored: true,
})
export default class DomainModel extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id: number;

  @Column({
    field: "name",
    type: DataType.TEXT,
  })
  name: string;

  @Column({
    field: "code",
    type: DataType.TEXT,
    allowNull: false,
  })
  code: string;

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

  @HasMany(() => AircraftLetterRelationModel, "fk_domain_id")
  aircraftProgram: AircraftLetterRelationModel[];
}
