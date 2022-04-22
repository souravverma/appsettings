import {
  PrimaryKey,
  AutoIncrement,
  Column,
  DataType,
  Model,
  Table,
  HasMany,
  BelongsToMany,
  BelongsTo,
  HasOne,
} from "sequelize-typescript";
import Harness3dDesignSolutionModel from "./Harness3dDesignSolution.model";
import Harness3dDsPzRelationModel from "./Harness3dDsPzRelation.model";
import Branch3dModel from "./Branch3d.model";
import FunctionalItem3dSolutionModel from "./FunctionalItem3dSolution.model";
import FunctionalItemSolutionPartZoneRelation from "./FunctionalItem3dSolutionPartZoneRelation.model";
import UserAreaModel from "./UserAreaPartZone.model";
import PartzoneItemModel from "./PartzoneItem.model";
import ModificationProposalModel from "./ModificationProposal.model";
import ModificationProposalPzSolutionRelationModel from "./ModificationProposalPzSolutionRelation";

@Table({
  schema: process.env.DB_SCHEMAV2,
  tableName: "part_zone_solution",
  timestamps: true,
  paranoid: true,
  underscored: true,
})
export default class PartZoneModel extends Model {
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
    field: "version",
    type: DataType.TEXT,
    defaultValue: "001",
  })
  version: string;

  @Column({
    field: "issue",
    type: DataType.TEXT,
    defaultValue: "---",
  })
  issue: string;

  @Column({
    field: "type",
    type: DataType.TEXT,
    allowNull: true,
  })
  pzType: string;

  @Column({
    field: "data_type",
    type: DataType.TEXT,
    allowNull: true,
  })
  dataType: string;

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

  @Column({
    field: "data_status",
    type: DataType.TEXT,
    allowNull: true,
    defaultValue: "waiting_data",
  })
  dataStatus: string;

  @Column({
    field: "consolidation_status",
    type: DataType.ENUM("OK", "KO", "N/A"),
    defaultValue: "N/A",
    allowNull: false,
  })
  consolidationStatus: string;

  @Column({
    field: "consolidation_message",
    type: DataType.TEXT,
    defaultValue: "Route continuity check not applicable!",
    allowNull: false,
  })
  consolidationMessage: string;

  @Column({
    field: "release_status",
    type: DataType.TEXT,
    allowNull: true,
  })
  releaseStatus: string;

  @HasMany(() => Branch3dModel, "fk_part_zone_solution_id")
  b3d: Branch3dModel[];

  @HasMany(() => PartzoneItemModel, "fk_part_zone_solution_id")
  pzItem: PartzoneItemModel[];

  @BelongsTo(() => UserAreaModel, "fk_user_area_id")
  userArea: UserAreaModel;

  @BelongsTo(() => PartZoneModel, "fk_origin_id")
  origin: PartZoneModel;

  @BelongsToMany(
    () => Harness3dDesignSolutionModel,
    () => Harness3dDsPzRelationModel,
    "partZoneId"
  )
  harness3d: Harness3dDesignSolutionModel[];

  @BelongsToMany(
    () => FunctionalItem3dSolutionModel,
    () => FunctionalItemSolutionPartZoneRelation,
    "partZoneId"
  )
  finDs: FunctionalItem3dSolutionModel[];

  @BelongsToMany(
    () => ModificationProposalModel,
    () => ModificationProposalPzSolutionRelationModel,
    "partzone"
  )
  modProp: ModificationProposalModel[];
}
