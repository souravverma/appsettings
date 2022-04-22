DROP TABLE IF EXISTS "playground_nis_harness"."harness_manufactuing_sub_assembly" CASCADE;
DROP TABLE IF EXISTS "playground_nis_harness"."morpho_point" CASCADE;
DROP TABLE IF EXISTS "playground_nis_harness"."harness_manufacturing" CASCADE;
DROP TABLE IF EXISTS "playground_nis_harness"."branches3D_extremities_relation" CASCADE;
DROP TABLE IF EXISTS "playground_nis_harness"."branches3D_extremities_finDs_relation" CASCADE;
DROP TABLE IF EXISTS "playground_nis_harness"."branch3D_extremity" CASCADE;
DROP TABLE IF EXISTS "playground_nis_harness"."branch3D" CASCADE;
DROP TABLE IF EXISTS "playground_nis_harness"."harness_vb" CASCADE;
DROP TABLE IF EXISTS "playground_nis_harness"."functional_item_number_solution" CASCADE;
DROP TABLE IF EXISTS "playground_nis_harness"."component" CASCADE;
DROP TABLE IF EXISTS "playground_nis_harness"."branch_manuf_extremity" CASCADE;

DROP TYPE IF EXISTS "playground_nis_harness"."aircraftProgramEnum" CASCADE;
DROP TYPE IF EXISTS "playground_nis_harness"."domainEnum" CASCADE;
DROP TYPE IF EXISTS "playground_nis_harness"."majorComponentAssemblyEnum" CASCADE;
DROP TYPE IF EXISTS "playground_nis_harness"."extremityTypeEnum" CASCADE;

CREATE TYPE "playground_nis_harness"."aircraftProgramEnum" AS ENUM ('A320', 'A330', 'A340', 'A350', 'A380', 'ATR', 'A400M');
CREATE TYPE "playground_nis_harness"."domainEnum" AS ENUM ('normal_installation', 'flight_test_installation', 'laboratory', 'customer_services', 'A380', 'map', 'FTI');
CREATE TYPE "playground_nis_harness"."majorComponentAssemblyEnum" AS ENUM ('AD', 'AF', 'AU', 'AE');
CREATE TYPE "playground_nis_harness"."extremityTypeEnum" AS ENUM ('CROSSREF', 'DERIVATION', 'CONNECTOR');

CREATE TABLE IF NOT EXISTS "playground_nis_harness"."component" ("id"  SERIAL , "component_naming" TEXT NOT NULL, "part_number" TEXT, "component_type" TEXT, "master_source_creation_date" TIMESTAMP WITH TIME ZONE, "master_source_modification_date" TIMESTAMP WITH TIME ZONE, "master_source_deletion_date" TIMESTAMP WITH TIME ZONE, "master_source_user_creation_id" TEXT, "master_source_user_modification_id" TEXT, "master_source_user_deletion_id" TEXT, "master_source_id" TEXT, "meta" JSONB, PRIMARY KEY ("id"));

CREATE TABLE IF NOT EXISTS "playground_nis_harness"."functional_item_number_solution" ("id"  SERIAL , "sequence_number" VARCHAR(255), "circuit" VARCHAR(255) NOT NULL, "suffix" VARCHAR(255), "appended_letter" VARCHAR(255), "supplementary_part" VARCHAR(255), "solution" VARCHAR(255), "solution_origin" VARCHAR(255), "aircraft_program" "playground_nis_harness"."aircraftProgramEnum", "domain" "playground_nis_harness"."domainEnum", "major_component_assembly" "playground_nis_harness"."majorComponentAssemblyEnum", "fin_description" VARCHAR(255), "fin_type" VARCHAR(255), "position_in_label" VARCHAR(255), "associated_fin" VARCHAR(255), "labeling_edition" VARCHAR(255), "harness_vb_cacc_ds_number" VARCHAR(255), "panel_vu_ve_cacc_ds_number" VARCHAR(255), "connector_component_part_number" VARCHAR(255), "equipment_part_number" VARCHAR(255), "component_to_categorise_part_number " VARCHAR(255), "parameter_sketch" VARCHAR(255), "mp_number" VARCHAR(255), "parameter_ansi_code" VARCHAR(255), "parameter_aircraft_zone" INTEGER, "effective_routes" VARCHAR(255), "connection_drawing_root" VARCHAR(255), "functional_item_number_priority_mounting " VARCHAR(255), "master_source_creation_date" TIMESTAMP WITH TIME ZONE, "master_source_modification_date" TIMESTAMP WITH TIME ZONE, "master_source_deletion_date" TIMESTAMP WITH TIME ZONE, "master_source_user_creation_id" TEXT, "master_source_user_modification_id" TEXT, "master_source_user_deletion_id" TEXT, "master_source_id" TEXT, "meta" JSONB, "componentId" INTEGER REFERENCES "playground_nis_harness"."component" ("id") ON DELETE CASCADE ON UPDATE CASCADE, UNIQUE ("sequence_number", "circuit", "suffix", "appended_letter", "supplementary_part", "solution", "aircraft_program", "domain", "major_component_assembly"), PRIMARY KEY ("id"));

CREATE TABLE IF NOT EXISTS "playground_nis_harness"."harness_vb" ("id"  SERIAL , "cacc_ds_number" VARCHAR(255), "cacc_ds_solution" TEXT, "cacc_ds_update_date" TIMESTAMP WITH TIME ZONE, "cacc_ci_number" TEXT, "cacc_ds_version_creation_date" TIMESTAMP WITH TIME ZONE, "cacc_ds_master_creation_date" TIMESTAMP WITH TIME ZONE, "section" VARCHAR(255), "data_type" VARCHAR(255), "description" VARCHAR(255), "adap_ds_number" TEXT, "adap_ds_issue_index" TEXT, "adap_ds_state" TEXT, "adap_ds_msn_rangeto" TEXT, "adap_ds_generic_pdm_version" TEXT, "adap_ds_msn_rangefrom" TEXT, "master_source_creation_date" TIMESTAMP WITH TIME ZONE, "master_source_modification_date" TIMESTAMP WITH TIME ZONE, "master_source_deletion_date" TIMESTAMP WITH TIME ZONE, "master_source_user_creation_id" TEXT, "master_source_user_modification_id" TEXT, "master_source_user_deletion_id" TEXT, "master_source_id" TEXT, "meta" JSONB, "finDsId" INTEGER REFERENCES "playground_nis_harness"."functional_item_number_solution" ("id") ON DELETE CASCADE ON UPDATE CASCADE, PRIMARY KEY ("id"));

CREATE TABLE IF NOT EXISTS "playground_nis_harness"."branch3D" ("id"  SERIAL , "branch_id" TEXT NOT NULL, "user_area" TEXT, "diameter_min_mm" FLOAT, "diameter_max_mm" FLOAT, "weigth" FLOAT, "admissible_routes" TEXT, "effective_routes" TEXT, "diameter_3d_mm" FLOAT, "bendradius" FLOAT, "length_forced" FLOAT NOT NULL, "extra_length" FLOAT NOT NULL, "length" FLOAT NOT NULL, "environmental_area" TEXT, "partzone_number" TEXT, "branch_consolidation_status" BOOLEAN, "not_extractible" BOOLEAN, "master_source_creation_date" TIMESTAMP WITH TIME ZONE, "master_source_modification_date" TIMESTAMP WITH TIME ZONE, "master_source_deletion_date" TIMESTAMP WITH TIME ZONE, "master_source_user_creation_id" TEXT, "master_source_user_modification_id" TEXT, "master_source_user_deletion_id" TEXT, "master_source_id" TEXT, "meta" JSONB, "harnessVbId" INTEGER REFERENCES "playground_nis_harness"."harness_vb" ("id") ON DELETE CASCADE ON UPDATE CASCADE, PRIMARY KEY ("id"));

CREATE TABLE IF NOT EXISTS "playground_nis_harness"."branch_manuf_extremity" ("id"  SERIAL , "name" TEXT, "NIS" BOOLEAN, PRIMARY KEY ("id"));

CREATE TABLE IF NOT EXISTS "playground_nis_harness"."branch3D_extremity" ("id"  SERIAL , "branch_extremity_naming" TEXT, "electrical_coordinate_x" FLOAT, "electrical_coordinate_y" FLOAT, "electrical_coordinate_z" FLOAT, "type" "playground_nis_harness"."extremityTypeEnum" NOT NULL, "master_source_creation_date" TIMESTAMP WITH TIME ZONE, "master_source_modification_date" TIMESTAMP WITH TIME ZONE, "master_source_deletion_date" TIMESTAMP WITH TIME ZONE, "master_source_user_creation_id" TEXT, "master_source_user_modification_id" TEXT, "master_source_user_deletion_id" TEXT, "master_source_id" TEXT, "meta" JSONB, "bExtManufId" INTEGER REFERENCES "playground_nis_harness"."branch_manuf_extremity" ("id") ON DELETE SET NULL ON UPDATE CASCADE, PRIMARY KEY ("id"));

CREATE TABLE IF NOT EXISTS "playground_nis_harness"."branches3D_extremities_finDs_relation" ("branch3DExtremityId" INTEGER  REFERENCES "playground_nis_harness"."branch3D_extremity" ("id") ON DELETE CASCADE ON UPDATE CASCADE, "finDsId" INTEGER  REFERENCES "playground_nis_harness"."functional_item_number_solution" ("id") ON DELETE CASCADE ON UPDATE CASCADE, UNIQUE ("branch3DExtremityId", "finDsId"), PRIMARY KEY ("branch3DExtremityId","finDsId"));

CREATE TABLE IF NOT EXISTS "playground_nis_harness"."branches3D_extremities_relation" ("branch3d_extremity_relation_id" VARCHAR(255), "vector_x" FLOAT, "vector_y" FLOAT, "vector_z" FLOAT, "branch3DId" INTEGER  REFERENCES "playground_nis_harness"."branch3D" ("id") ON DELETE CASCADE ON UPDATE CASCADE, "branch3DExtremityId" INTEGER  REFERENCES "playground_nis_harness"."branch3D_extremity" ("id") ON DELETE CASCADE ON UPDATE CASCADE, UNIQUE ("branch3DId", "branch3DExtremityId"), PRIMARY KEY ("branch3DId","branch3DExtremityId"));

CREATE TABLE IF NOT EXISTS "playground_nis_harness"."harness_manufacturing" ("id"  SERIAL , "deliverable_assembly" TEXT, "deliverable_assembly_solution" TEXT, "validity" TEXT, "status" TEXT, "harnessVbId" INTEGER REFERENCES "playground_nis_harness"."harness_vb" ("id") ON DELETE SET NULL ON UPDATE CASCADE, PRIMARY KEY ("id"));

CREATE TABLE IF NOT EXISTS "playground_nis_harness"."morpho_point" ("id"  SERIAL , "segment_extremity" TEXT, "position_x" FLOAT, "position_y" FLOAT, "position_z" FLOAT, "position_vector_x" FLOAT, "position_vector_y" FLOAT, "position_vector_z" FLOAT, "type" TEXT, "coordinate_segment_extremity_x" FLOAT, "coordinate_segment_extremity_y" FLOAT, "coordinate_segment_extremity_z" FLOAT, "finDsId" INTEGER REFERENCES "playground_nis_harness"."functional_item_number_solution" ("id") ON DELETE CASCADE ON UPDATE CASCADE, PRIMARY KEY ("id"));

CREATE TABLE IF NOT EXISTS "playground_nis_harness"."harness_manufactuing_sub_assembly" ("id"  SERIAL , "name" TEXT, "deliverable_assembly" TEXT, "effective_routes" TEXT, "harnessManufacturingId" INTEGER REFERENCES "playground_nis_harness"."harness_manufacturing" ("id") ON DELETE SET NULL ON UPDATE CASCADE, PRIMARY KEY ("id"));



GRANT ALL ON TABLE "playground_nis_harness"."component" TO team_lost_in_installation;
GRANT ALL ON TABLE "playground_nis_harness"."functional_item_number_solution" TO team_lost_in_installation;
GRANT ALL ON TABLE "playground_nis_harness"."harness_vb" TO team_lost_in_installation;
GRANT ALL ON TABLE "playground_nis_harness"."branch3D" TO team_lost_in_installation;
GRANT ALL ON TABLE "playground_nis_harness"."branch3D_extremity" TO team_lost_in_installation;
GRANT ALL ON TABLE "playground_nis_harness"."branches3D_extremities_finDs_relation" TO team_lost_in_installation;
GRANT ALL ON TABLE "playground_nis_harness"."branches3D_extremities_relation" TO team_lost_in_installation;
GRANT ALL ON TABLE "playground_nis_harness"."harness_manufacturing" TO team_lost_in_installation;
GRANT ALL ON TABLE "playground_nis_harness"."morpho_point" TO team_lost_in_installation;
GRANT ALL ON TABLE "playground_nis_harness"."harness_manufactuing_sub_assembly" TO team_lost_in_installation;
GRANT ALL ON TABLE "playground_nis_harness"."branch_manuf_extremity" TO team_lost_in_installation;
 
GRANT ALL ON TABLE "playground_nis_harness"."component" TO app_ce_api_harness;
GRANT ALL ON TABLE "playground_nis_harness"."functional_item_number_solution" TO app_ce_api_harness;
GRANT ALL ON TABLE "playground_nis_harness"."harness_vb" TO app_ce_api_harness;
GRANT ALL ON TABLE "playground_nis_harness"."branch3D" TO app_ce_api_harness;
GRANT ALL ON TABLE "playground_nis_harness"."branch3D_extremity" TO app_ce_api_harness;
GRANT ALL ON TABLE "playground_nis_harness"."branches3D_extremities_finDs_relation" TO app_ce_api_harness;
GRANT ALL ON TABLE "playground_nis_harness"."branches3D_extremities_relation" TO app_ce_api_harness;
GRANT ALL ON TABLE "playground_nis_harness"."harness_manufacturing" TO app_ce_api_harness;
GRANT ALL ON TABLE "playground_nis_harness"."morpho_point" TO app_ce_api_harness;
GRANT ALL ON TABLE "playground_nis_harness"."harness_manufactuing_sub_assembly" TO app_ce_api_harness;
GRANT ALL ON TABLE "playground_nis_harness"."branch_manuf_extremity" TO app_ce_api_harness;

GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA playground_nis_harness TO app_ce_api_harness;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA playground_nis_harness TO team_lost_in_installation;