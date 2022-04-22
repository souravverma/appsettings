import {
  PrimaryKey,
  AutoIncrement,
  Column,
  DataType,
  Model,
  Table,
  BelongsToMany,
  BelongsTo,
  ForeignKey,
} from "sequelize-typescript";
import ModificationProposalModel from "./ModificationProposal.model";
import PartZoneModel from "./Partzone.model";

@Table({
  schema: process.env.DB_SCHEMAV2,
  tableName: "mp_pz_solution_relation",
  underscored: true,
  timestamps: false,
})
export default class ModificationProposalPzSolutionRelationModel extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id: number;

  @Column({
    field: "mp_delta",
    type: DataType.TEXT,
    allowNull: false,
  })
  mpDelta: string;

  @ForeignKey(() => ModificationProposalModel)
  @Column({
    field: "fk_modification_proposal_id",
    type: DataType.INTEGER,
    unique: "u_mp_pz_solution_relation",
    allowNull: false,
  })
  mpDeltaId: number;

  @ForeignKey(() => PartZoneModel)
  @Column({
    field: "fk_part_zone_solution_id",
    type: DataType.INTEGER,
    unique: "u_mp_pz_solution_relation",
    allowNull: false,
  })
  partzone: number;
}
