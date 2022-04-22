import {
  PrimaryKey,
  AutoIncrement,
  Column,
  DataType,
  Model,
  Table,
  BelongsTo,
  BelongsToMany,
  HasMany,
} from "sequelize-typescript";
import FunctionalItemModel from "./FunctionalItem.model";
import DeliverableAssemblySolutionModel from "./DeliverableAssemblySolution.model";
import MajorComponentAssemblyModel from "./MajorComponentAssembly.model";
import PartZoneModel from "./Partzone.model";
import Harness3dDsPzRelationModel from "./Harness3dDsPzRelation.model";
import FunctionalItemHarness3dDesignSolutionRelationModel from "./FunctionalItemHarness3dDsRelation.model";
import AdapLoModel from "./AdapLo.model";

@Table({
  schema: process.env.DB_SCHEMAV2,
  tableName: "harness_3d_design_solution",
  timestamps: true,
  paranoid: true,
  underscored: true,
})
export default class Harness3dDesignSolutionModel extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id: number;

  @Column({
    field: "adap_design_solution_number",
    type: DataType.TEXT,
    allowNull: true,
  })
  adapDesignSolutionNumber: string;

  @Column({
    field: "adap_ds_version",
    type: DataType.TEXT,
    allowNull: true,
  })
  adapDesignSolutionVersionNumber: string;

  @Column({
    field: "adap_ds_issue",
    type: DataType.TEXT,
    allowNull: true,
  })
  adapDesignSolutionIssueNumber: string;

  @Column({
    field: "type",
    type: DataType.TEXT,
    allowNull: true,
  })
  harnessType: string;

  @Column({
    field: "adap_ds_owner",
    type: DataType.TEXT,
    allowNull: true,
  })
  adapDsOwner: string;

  @Column({
    field: "release_status",
    type: DataType.TEXT,
    allowNull: true,
  })
  releaseStatus: string;

  @Column({
    field: "modification_adap_ds_date",
    type: DataType.DATE,
    allowNull: true,
  })
  modificationAdapDsDate: Date;

  @Column({
    field: "extraction_owner",
    type: DataType.TEXT,
    allowNull: true,
  })
  extractionOwner: string;

  @Column({
    field: "extraction_date_from_3d",
    type: DataType.DATE,
    allowNull: true,
  })
  extractionDateFrom3d: Date;

  @Column({
    field: "storing_owner_in_core_elec",
    type: DataType.TEXT,
    allowNull: true,
  })
  storingOwnerInCoreElec: string;

  @Column({
    field: "storing_date_in_core_elec",
    type: DataType.DATE,
    allowNull: true,
  })
  storingDateInCoreElec: Date;

  @Column({
    field: "cacc_ds_number",
    type: DataType.TEXT,
    allowNull: true,
  })
  caccDsNumber: string;

  @Column({
    field: "cacc_ds_solution",
    type: DataType.TEXT,
    allowNull: false,
  })
  caccDsSolution: string;

  @Column({
    field: "data_status",
    type: DataType.TEXT,
    allowNull: true,
  })
  dataStatus: string;

  @Column({
    field: "consolidation_status",
    type: DataType.ENUM("OK", "SUCCESS", "WARNING", "ERROR", "KO"),
    defaultValue: "KO",
    allowNull: false,
  })
  consolidationStatus: string;

  @Column({
    field: "consolidation_message",
    type: DataType.TEXT,
    defaultValue: "harness not consolidated !",
    allowNull: false,
  })
  consolidationMsg: string;

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
    field: "ps_synchro_status",
    type: DataType.ENUM("OK", "WARNING", "KO"),
    defaultValue: "WARNING",
    allowNull: false,
  })
  psSynchroStatus: string;

  @Column({
    field: "ps_synchro_date",
    type: DataType.DATE,
    defaultValue: null,
    allowNull: true,
  })
  psSynchroDate: Date;

  @Column({
    field: "pdm_release_status",
    type: DataType.TEXT,
    allowNull: true,
  })
  pdmReleaseStatus: string;

  @Column({
    field: "data_type",
    type: DataType.TEXT,
    allowNull: true,
  })
  dataType: string;

  @BelongsTo(
    () => DeliverableAssemblySolutionModel,
    "fk_deliverable_assembly_solution_id"
  )
  dASol: DeliverableAssemblySolutionModel;

  @BelongsTo(
    () => MajorComponentAssemblyModel,
    "fk_major_component_assembly_id"
  )
  majorCA: MajorComponentAssemblyModel;

  @BelongsToMany(
    () => PartZoneModel,
    () => Harness3dDsPzRelationModel,
    "harness3dDesignSolutionId"
  )
  partZone: PartZoneModel[];

  @BelongsToMany(
    () => FunctionalItemModel,
    () => FunctionalItemHarness3dDesignSolutionRelationModel,
    "harness3dDesignSolutionId"
  )
  fin: FunctionalItemModel[];

  @HasMany(() => AdapLoModel, "fk_harness_3d_ds_id")
  adapLo: AdapLoModel[];
}
