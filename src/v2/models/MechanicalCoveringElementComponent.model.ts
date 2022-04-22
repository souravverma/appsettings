import {
  PrimaryKey,
  AutoIncrement,
  Column,
  DataType,
  Model,
  Table,
  BelongsTo,
  HasOne,
} from "sequelize-typescript";
import ComponentModel from "./Component.model";

@Table({
  schema: process.env.DB_SCHEMAV2,
  tableName: "mechanical_covering_element_component",
  timestamps: true,
  paranoid: true,
  underscored: true,
})
export default class MechanicalCoveringElementComponentModel extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id: number;

  @Column({
    field: "bend_radius_min_d",
    type: DataType.INTEGER,
    allowNull: true,
  })
  bendRadiusMinD: number;

  @Column({
    field: "colour",
    type: DataType.TEXT,
    allowNull: true,
  })
  colour: string;

  @Column({
    field: "comment",
    type: DataType.TEXT,
    allowNull: true,
  })
  comment: string;

  @Column({
    field: "comment_tresti",
    type: DataType.TEXT,
    allowNull: true,
  })
  commentTresti: string;

  @Column({
    field: "diameter_max_mm",
    type: DataType.INTEGER,
    allowNull: true,
  })
  diameterMaxMm: number;

  @Column({
    field: "diameter_max_mm_tresti",
    type: DataType.INTEGER,
    allowNull: true,
  })
  diameterMaxMmTresti: number;

  @Column({
    field: "diameter_min_mm",
    type: DataType.INTEGER,
    allowNull: true,
  })
  diameterMinMm: number;

  @Column({
    field: "diameter_min_mm_tresti",
    type: DataType.INTEGER,
    allowNull: true,
  })
  diameterMinMmTresti: number;

  @Column({
    field: "environement",
    type: DataType.TEXT,
    allowNull: true,
  })
  environement: string;

  @Column({
    field: "length_mm",
    type: DataType.INTEGER,
    allowNull: true,
  })
  lengthMm: number;

  @Column({
    field: "length_mm_tresti",
    type: DataType.INTEGER,
    allowNull: true,
  })
  lengthMmTresti: number;

  @Column({
    field: "material",
    type: DataType.TEXT,
    allowNull: true,
  })
  material: string;

  @Column({
    field: "order",
    type: DataType.TEXT,
    allowNull: true,
  })
  order: string;

  @Column({
    field: "order_tresti",
    type: DataType.TEXT,
    allowNull: true,
  })
  orderTresti: string;

  @Column({
    field: "size_code",
    type: DataType.TEXT,
    allowNull: true,
  })
  sizeCode: string;

  @Column({
    field: "size_code_tresti",
    type: DataType.TEXT,
    allowNull: true,
  })
  sizeCodeTresti: string;

  @Column({
    field: "sleeve_family",
    type: DataType.TEXT,
    allowNull: true,
  })
  sleeveFamily: string;

  @Column({
    field: "sleeve_family_tresti",
    type: DataType.TEXT,
    allowNull: true,
  })
  sleeveFamilyTresti: string;

  @Column({
    field: "temperature_max_c",
    type: DataType.INTEGER,
    allowNull: true,
  })
  temperatureMaxC: number;

  @Column({
    field: "temperature_min_c",
    type: DataType.INTEGER,
    allowNull: true,
  })
  temperatureMinC: number;

  @Column({
    field: "thickness_coeff_a",
    type: DataType.TEXT,
    allowNull: true,
  })
  thicknessCoeffA: string;

  @Column({
    field: "thickness_coeff_a_tresti",
    type: DataType.TEXT,
    allowNull: true,
  })
  thicknessCoeffATresti: string;

  @Column({
    field: "thickness_coeff_b",
    type: DataType.TEXT,
    allowNull: true,
  })
  thicknessCoeffB: string;

  @Column({
    field: "thickness_coeff_b_tresti",
    type: DataType.TEXT,
    allowNull: true,
  })
  thicknessCoeffBTresti: string;

  @Column({
    field: "weight_g",
    type: DataType.INTEGER,
    allowNull: true,
  })
  weightG: number;

  @Column({
    field: "weight_g_m_tresti",
    type: DataType.INTEGER,
    allowNull: true,
  })
  weightGMTresti: number;

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

  @BelongsTo(() => ComponentModel, "fk_component_id")
  component: ComponentModel;
}
