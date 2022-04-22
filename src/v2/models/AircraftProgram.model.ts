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
import DomainModel from "./Domain.model";
import AircraftLetterRelationModel from "./AircraftLetterRelation.model";
import FunctionalItemModel from "./FunctionalItem.model";
import CircuitModel from "./Circuit.model";
import RouteCategoryModel from "./RouteCategory.model";
import ModificationProposalModel from "./ModificationProposal.model";

@Table({
  schema: process.env.DB_SCHEMAV2,
  tableName: "aircraft_program",
  timestamps: true,
  paranoid: true,
  underscored: true,
})
export default class AircraftProgramModel extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id: number;

  @Column({
    field: "family_name",
    type: DataType.TEXT,
    allowNull: false,
  })
  familyName: string;

  // @Column({
  //   field: 'aircraft_letter_code',
  //   type: DataType.TEXT,
  //   allowNull: false
  // })
  // mainAircraftLetterCode: string;

  @Column({
    field: "taksy_project_key",
    type: DataType.INTEGER,
    allowNull: true,
  })
  taksyProjectKey: number;

  @Column({
    field: "taksy_short_code",
    type: DataType.TEXT,
    allowNull: true,
  })
  taksyShortCode: string;

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

  @HasMany(() => FunctionalItemModel, "fk_aircraft_program_id")
  FIN: FunctionalItemModel[];

  @HasMany(() => CircuitModel, "fk_aircraft_program_id")
  circuits: CircuitModel[];

  @HasMany(() => RouteCategoryModel, "fk_aircraft_program_id")
  routes: RouteCategoryModel[];

  @HasMany(() => ModificationProposalModel, "fk_aircraft_program_id")
  mpDeltaId: ModificationProposalModel[];

  // @HasMany(() => ValidityModel, 'fk_aircraft_program_id')
  // validities: ValidityModel[];

  @HasMany(() => AircraftLetterRelationModel, "fk_aircraft_program_id")
  domain: AircraftLetterRelationModel[];
}
