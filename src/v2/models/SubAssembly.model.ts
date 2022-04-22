import {
  Table,
  Column,
  Model,
  PrimaryKey,
  DataType,
  AutoIncrement,
  BelongsTo,
} from "sequelize-typescript";
// import HarnessManufacturingModel from './HarnessManufacturing.model';

@Table({
  tableName: "harness_manufacturing_sub_assembly",
  schema: process.env.DB_SCHEMAV2,
  timestamps: true,
  paranoid: true,
  underscored: true,
})
export default class SubAssemblyModel extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id: number;

  @Column({
    type: DataType.TEXT,
  })
  name: string;

  @Column({
    field: "deliverable_assembly",
    type: DataType.TEXT,
  })
  deliverableAssembly?: string;

  @Column({
    field: "effective_routes",
    type: DataType.TEXT,
  })
  effectiveRoutes?: string;

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

  // @BelongsTo(() => HarnessManufacturingModel, { foreignKey: 'fk_harness_manufacturing_id', onDelete: 'CASCADE' })
  // hManuf: HarnessManufacturingModel;
}
