-- # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # - - made: 08 oct.2019 - alexis.dare.external @airbus.com 

DROP TABLE IF EXISTS "playground_proptool_harness"."validity_da_solution_relation" CASCADE;

DROP TABLE IF EXISTS "playground_proptool_harness"."validity" CASCADE;

DROP TABLE IF EXISTS "playground_proptool_harness"."harness_manufactuing_sub_assembly" CASCADE;

DROP TABLE IF EXISTS "playground_proptool_harness"."route_branch_3d_relation" CASCADE;

DROP TABLE IF EXISTS "playground_proptool_harness"."harness_manufacturing" CASCADE;

DROP TABLE IF EXISTS "playground_proptool_harness"."harness_3d_ds_pz_relation" CASCADE;

DROP TABLE IF EXISTS "playground_proptool_harness"."functional_item_harness_3d_design_solution_relation" CASCADE;

DROP TABLE IF EXISTS "playground_proptool_harness"."harness_3d_design_solution" CASCADE;

DROP TABLE IF EXISTS "playground_proptool_harness"."major_component_assembly" CASCADE;

DROP TABLE IF EXISTS "playground_proptool_harness"."fin_part_zone_route_relation" CASCADE;

DROP TABLE IF EXISTS "playground_proptool_harness"."functional_item_3d_solution_partzone_relation" CASCADE;

DROP TABLE IF EXISTS "playground_proptool_harness"."deliverable_assembly_solution" CASCADE;

DROP TABLE IF EXISTS "playground_proptool_harness"."deliverable_assembly" CASCADE;

DROP TABLE IF EXISTS "playground_proptool_harness"."connection_status" CASCADE;

DROP TABLE IF EXISTS "playground_proptool_harness"."branch_3d_point_definition" CASCADE;

DROP TABLE IF EXISTS "playground_proptool_harness"."branch_3d_segment" CASCADE;

DROP TABLE IF EXISTS "playground_proptool_harness"."branch_3d_extremity_relation" CASCADE;

DROP TABLE IF EXISTS "playground_proptool_harness"."branch_3d_extremity_fin_ds_relation" CASCADE;

DROP TABLE IF EXISTS "playground_proptool_harness"."branch_3d_extremity_solution" CASCADE;

DROP TABLE IF EXISTS "playground_proptool_harness"."branch_3d_extremity_type" CASCADE;

DROP TABLE IF EXISTS "playground_proptool_harness"."branch_manuf_extremity" CASCADE;

DROP TABLE IF EXISTS "playground_proptool_harness"."branch_3d_environment_type_relation" CASCADE;

DROP TABLE IF EXISTS "playground_proptool_harness"."environments_type" CASCADE;

DROP TABLE IF EXISTS "playground_proptool_harness"."branch_3d_covering_element_solution_relation" CASCADE;

DROP TABLE IF EXISTS "playground_proptool_harness"."covering_element_3d" CASCADE;

DROP TABLE IF EXISTS "playground_proptool_harness"."branch_3d_extremity_covering_element_relation" CASCADE;

DROP TABLE IF EXISTS "playground_proptool_harness"."covering_element_type" CASCADE;

DROP TABLE IF EXISTS "playground_proptool_harness"."branch_3d" CASCADE;

DROP TABLE IF EXISTS "playground_proptool_harness"."part_zone" CASCADE;

DROP TABLE IF EXISTS "playground_proptool_harness"."user_area" CASCADE;

DROP TABLE IF EXISTS "playground_proptool_harness"."backshell_3d_solution" CASCADE;

DROP TABLE IF EXISTS "playground_proptool_harness"."functional_item_3d_solution" CASCADE;

DROP TABLE IF EXISTS "playground_proptool_harness"."functional_item" CASCADE;

DROP TABLE IF EXISTS "playground_proptool_harness"."circuit" CASCADE;

DROP TABLE IF EXISTS "playground_proptool_harness"."component" CASCADE;

DROP TABLE IF EXISTS "playground_proptool_harness"."mechanical_covering_element_component" CASCADE;

DROP TABLE IF EXISTS "playground_proptool_harness"."mechanical_backshell_component" CASCADE;

DROP TABLE IF EXISTS "playground_proptool_harness"."aircraft_program_route_category_relation" CASCADE;

DROP TABLE IF EXISTS "playground_proptool_harness"."route_category" CASCADE;

DROP TABLE IF EXISTS "playground_proptool_harness"."aircraft_program" CASCADE;

DROP TYPE IF EXISTS "playground_proptool_harness"."enum_harness_3d_design_solution_consolidation_status" CASCADE;

CREATE TYPE "playground_proptool_harness"."enum_harness_3d_design_solution_consolidation_status" AS ENUM ('SUCCESS', 'WARNING', 'ERROR', 'KO');

CREATE TABLE IF NOT EXISTS "playground_proptool_harness"."aircraft_program" (
    "id" SERIAL,
    "family_name" TEXT NOT NULL,
    "aircraft_letter_code" TEXT NOT NULL,
    "taksy_project_key" INTEGER,
    "taksy_short_code" TEXT,
    "created_at" TIMESTAMP WITH TIME ZONE NOT NULL,
    "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL,
    "created_by" TEXT,
    "updated_by" TEXT,
    "deleted_at" TIMESTAMP WITH TIME ZONE,
    PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "playground_proptool_harness"."route_category" (
    "id" SERIAL,
    "name" TEXT,
    "essential" BOOLEAN,
    "system" INTEGER,
    "system_description" TEXT,
    "category_code" TEXT,
    "category_description" TEXT,
    "remarks" TEXT,
    "created_at" TIMESTAMP WITH TIME ZONE NOT NULL,
    "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL,
    "created_by" TEXT,
    "updated_by" TEXT,
    "deleted_at" TIMESTAMP WITH TIME ZONE,
    PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "playground_proptool_harness"."aircraft_program_route_category_relation" (
    "id" SERIAL,
    "fk_aircraft_program_id" INTEGER REFERENCES "playground_proptool_harness"."aircraft_program" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    "fk_route_category_id" INTEGER REFERENCES "playground_proptool_harness"."route_category" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    UNIQUE ("fk_aircraft_program_id", "fk_route_category_id"),
    PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "playground_proptool_harness"."mechanical_backshell_component" (
    "id" SERIAL,
    "material" TEXT,
    "emi" BOOLEAN,
    "backshell_type" TEXT,
    "created_at" TIMESTAMP WITH TIME ZONE NOT NULL,
    "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL,
    "created_by" TEXT,
    "updated_by" TEXT,
    "deleted_at" TIMESTAMP WITH TIME ZONE,
    PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "playground_proptool_harness"."mechanical_covering_element_component" (
    "id" SERIAL,
    "bend_radius_min_d" INTEGER,
    "colour" TEXT,
    "comment" TEXT,
    "comment_tresti" TEXT,
    "diameter_max_mm" INTEGER,
    "diameter_max_mm_tresti" INTEGER,
    "diameter_min_mm" INTEGER,
    "diameter_min_mm_tresti" INTEGER,
    "environement" TEXT,
    "length_mm" INTEGER,
    "length_mm_tresti" INTEGER,
    "material" TEXT,
    "order" TEXT,
    "order_tresti" TEXT,
    "size_code" TEXT,
    "size_code_tresti" TEXT,
    "sleeve_family" TEXT,
    "sleeve_family_tresti" TEXT,
    "temperature_max_c" INTEGER,
    "temperature_min_c" INTEGER,
    "thickness_coeff_a" TEXT,
    "thickness_coeff_a_tresti" TEXT,
    "thickness_coeff_b" TEXT,
    "thickness_coeff_b_tresti" TEXT,
    "weight_g" INTEGER,
    "weight_g_m_tresti" INTEGER,
    "created_at" TIMESTAMP WITH TIME ZONE NOT NULL,
    "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL,
    "created_by" TEXT,
    "updated_by" TEXT,
    "deleted_at" TIMESTAMP WITH TIME ZONE,
    PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "playground_proptool_harness"."component" (
    "id" SERIAL,
    "part_number" TEXT NOT NULL,
    "norm" TEXT,
    "created_at" TIMESTAMP WITH TIME ZONE NOT NULL,
    "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL,
    "created_by" TEXT,
    "updated_by" TEXT,
    "deleted_at" TIMESTAMP WITH TIME ZONE,
    "fk_mechanical_backshell_component_id" INTEGER REFERENCES "playground_proptool_harness"."mechanical_backshell_component" ("id") ON DELETE
    SET
        NULL ON UPDATE CASCADE,
        "fk_mechanical_covering_element_component_id" INTEGER REFERENCES "playground_proptool_harness"."mechanical_covering_element_component" ("id") ON DELETE
    SET
        NULL ON UPDATE CASCADE,
        PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "playground_proptool_harness"."circuit" (
    "id" SERIAL,
    "letters" TEXT NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP WITH TIME ZONE NOT NULL,
    "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL,
    "created_by" TEXT,
    "updated_by" TEXT,
    "deleted_at" TIMESTAMP WITH TIME ZONE,
    PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "playground_proptool_harness"."functional_item" (
    "id" SERIAL,
    "sequence_number" TEXT NOT NULL,
    "suffix" TEXT,
    "appended_letter" TEXT,
    "supplementary_part" TEXT,
    "description" TEXT,
    "created_at" TIMESTAMP WITH TIME ZONE NOT NULL,
    "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL,
    "created_by" TEXT,
    "updated_by" TEXT,
    "deleted_at" TIMESTAMP WITH TIME ZONE,
    "fk_aircraft_program_id" INTEGER REFERENCES "playground_proptool_harness"."aircraft_program" ("id") ON DELETE
    SET
        NULL ON UPDATE CASCADE,
        "fk_circuit_id" INTEGER REFERENCES "playground_proptool_harness"."circuit" ("id") ON DELETE
    SET
        NULL ON UPDATE CASCADE,
        PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "playground_proptool_harness"."functional_item_3d_solution" (
    "id" SERIAL,
    "solution_number" TEXT,
    "part_number_3d" TEXT NOT NULL,
    "instance_name_3d" TEXT,
    "definition_zone" TEXT,
    "panel" TEXT,
    "long_part_number" TEXT,
    "mounting_priority" TEXT,
    "master_source_id" TEXT,
    "position_x" DOUBLE PRECISION,
    "position_y" DOUBLE PRECISION,
    "position_z" DOUBLE PRECISION,
    "created_at" TIMESTAMP WITH TIME ZONE NOT NULL,
    "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL,
    "created_by" TEXT,
    "updated_by" TEXT,
    "deleted_at" TIMESTAMP WITH TIME ZONE,
    "fk_functional_item_id" INTEGER REFERENCES "playground_proptool_harness"."functional_item" ("id") ON DELETE
    SET
        NULL ON UPDATE CASCADE,
        "fk_mounting_fin_master_id" INTEGER REFERENCES "playground_proptool_harness"."functional_item_3d_solution" ("id") ON DELETE
    SET
        NULL ON UPDATE CASCADE,
        PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "playground_proptool_harness"."backshell_3d_solution" (
    "id" SERIAL,
    "backshell_orientation" TEXT,
    "backshell_orientation_reference" TEXT,
    "position_x" DOUBLE PRECISION,
    "position_y" DOUBLE PRECISION,
    "position_z" DOUBLE PRECISION,
    "created_at" TIMESTAMP WITH TIME ZONE NOT NULL,
    "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL,
    "created_by" TEXT,
    "updated_by" TEXT,
    "deleted_at" TIMESTAMP WITH TIME ZONE,
    "fk_component_id" INTEGER REFERENCES "playground_proptool_harness"."component" ("id") ON DELETE
    SET
        NULL ON UPDATE CASCADE,
        "fk_functional_item_solution_id" INTEGER REFERENCES "playground_proptool_harness"."functional_item_3d_solution" ("id") ON DELETE
    SET
        NULL ON UPDATE CASCADE,
        PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "playground_proptool_harness"."user_area" (
    "id" SERIAL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP WITH TIME ZONE NOT NULL,
    "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL,
    "created_by" TEXT,
    "updated_by" TEXT,
    "deleted_at" TIMESTAMP WITH TIME ZONE,
    PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "playground_proptool_harness"."part_zone" (
    "id" SERIAL,
    "name" TEXT NOT NULL,
    "part_zone_version" TEXT,
    "created_at" TIMESTAMP WITH TIME ZONE NOT NULL,
    "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL,
    "created_by" TEXT,
    "updated_by" TEXT,
    "deleted_at" TIMESTAMP WITH TIME ZONE,
    "fk_user_area_id" INTEGER REFERENCES "playground_proptool_harness"."user_area" ("id") ON DELETE
    SET
        NULL ON UPDATE CASCADE,
        PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "playground_proptool_harness"."branch_3d" (
    "id" SERIAL,
    "name" TEXT NOT NULL,
    "branch_id" TEXT,
    "diameter_3d_mm" DOUBLE PRECISION NOT NULL,
    "bend_radius" INTEGER,
    "length_mm" DOUBLE PRECISION NOT NULL,
    "length_forced_mm" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "extra_length_mm" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "not_extractible" BOOLEAN DEFAULT false,
    "created_at" TIMESTAMP WITH TIME ZONE NOT NULL,
    "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL,
    "created_by" TEXT,
    "updated_by" TEXT,
    "deleted_at" TIMESTAMP WITH TIME ZONE,
    "fk_part_zone_id" INTEGER REFERENCES "playground_proptool_harness"."part_zone" ("id") ON DELETE
    SET
        NULL ON UPDATE CASCADE,
        PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "playground_proptool_harness"."covering_element_type" (
    "id" SERIAL,
    "name" TEXT,
    "created_at" TIMESTAMP WITH TIME ZONE NOT NULL,
    "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL,
    "created_by" TEXT,
    "updated_by" TEXT,
    "deleted_at" TIMESTAMP WITH TIME ZONE,
    PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "playground_proptool_harness"."branch_3d_extremity_covering_element_relation" (
    "id" SERIAL,
    "length_mm" FLOAT,
    "fk_branch_3d_extremity_id" INTEGER,
    "fk_covering_element_3d_id" INTEGER,
    UNIQUE (
        "fk_branch_3d_extremity_id",
        "fk_covering_element_3d_id",
        "length_mm"
    ),
    PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "playground_proptool_harness"."covering_element_3d" (
    "id" SERIAL,
    "name" TEXT,
    "length" INTEGER,
    "diameter" INTEGER,
    "created_at" TIMESTAMP WITH TIME ZONE NOT NULL,
    "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL,
    "created_by" TEXT,
    "updated_by" TEXT,
    "deleted_at" TIMESTAMP WITH TIME ZONE,
    "fk_component_id" INTEGER REFERENCES "playground_proptool_harness"."component" ("id") ON DELETE
    SET
        NULL ON UPDATE CASCADE,
        "fk_covering_element_type_id" INTEGER REFERENCES "playground_proptool_harness"."covering_element_type" ("id") ON DELETE
    SET
        NULL ON UPDATE CASCADE,
        "fk_covering_element_3d_id" INTEGER REFERENCES "playground_proptool_harness"."branch_3d_extremity_covering_element_relation" ("id") ON DELETE
    SET
        NULL ON UPDATE CASCADE,
        PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "playground_proptool_harness"."branch_3d_covering_element_solution_relation" (
    "id" SERIAL,
    "fk_branch_3d_id" INTEGER REFERENCES "playground_proptool_harness"."branch_3d" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    "fk_covering_element_3d_id" INTEGER REFERENCES "playground_proptool_harness"."covering_element_3d" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    UNIQUE ("fk_branch_3d_id", "fk_covering_element_3d_id"),
    PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "playground_proptool_harness"."environments_type" (
    "id" SERIAL,
    "name" TEXT,
    "created_at" TIMESTAMP WITH TIME ZONE NOT NULL,
    "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL,
    "created_by" TEXT,
    "updated_by" TEXT,
    "deleted_at" TIMESTAMP WITH TIME ZONE,
    PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "playground_proptool_harness"."branch_3d_environment_type_relation" (
    "id" SERIAL,
    "fk_branch_3d_id" INTEGER REFERENCES "playground_proptool_harness"."branch_3d" ("id") ON
DELETE CASCADE ON UPDATE CASCADE,
    "fk_environment_type_id" INTEGER REFERENCES "playground_proptool_harness"."environments_type" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    UNIQUE ("fk_branch_3d_id", "fk_environment_type_id"),
    PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "playground_proptool_harness"."branch_manuf_extremity" (
    "id" SERIAL,
    "name" TEXT NOT NULL,
    "usable_for" TEXT,
    "created_at" TIMESTAMP WITH TIME ZONE NOT NULL,
    "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL,
    "created_by" TEXT,
    "updated_by" TEXT,
    "deleted_at" TIMESTAMP WITH TIME ZONE,
    PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "playground_proptool_harness"."branch_3d_extremity_type" (
    "id" SERIAL,
    "name" TEXT,
    "created_at" TIMESTAMP WITH TIME ZONE NOT NULL,
    "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL,
    "created_by" TEXT,
    "updated_by" TEXT,
    "deleted_at" TIMESTAMP WITH TIME ZONE,
    PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "playground_proptool_harness"."branch_3d_extremity_solution" (
    "id" SERIAL,
    "name" TEXT NOT NULL,
    "electrical_coordinate_x" FLOAT NOT NULL,
    "electrical_coordinate_y" FLOAT NOT NULL,
    "electrical_coordinate_z" FLOAT NOT NULL,
    "created_at" TIMESTAMP WITH TIME ZONE NOT NULL,
    "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL,
    "created_by" TEXT,
    "updated_by" TEXT,
    "deleted_at" TIMESTAMP WITH TIME ZONE,
    "fk_branch_manuf_extremity_id" INTEGER REFERENCES "playground_proptool_harness"."branch_manuf_extremity" ("id") ON DELETE
    SET
        NULL ON UPDATE CASCADE,
        "fk_branch_3d_extremity_type_id" INTEGER REFERENCES "playground_proptool_harness"."branch_3d_extremity_type" ("id") ON DELETE
    SET
        NULL ON UPDATE CASCADE,
        "fk_branch_3d_extremity_id" INTEGER REFERENCES "playground_proptool_harness"."branch_3d_extremity_covering_element_relation" ("id") ON DELETE
    SET
        NULL ON UPDATE CASCADE,
        "branch_manuf_extremity_id" INTEGER REFERENCES "playground_proptool_harness"."branch_manuf_extremity" ("id") ON DELETE
    SET
        NULL ON UPDATE CASCADE,
        PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "playground_proptool_harness"."branch_3d_extremity_fin_ds_relation" (
    "id" SERIAL,
    "fk_branch_3d_extremity_id" INTEGER REFERENCES "playground_proptool_harness"."branch_3d_extremity_solution" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    "fk_functional_item_3d_solution_id" INTEGER REFERENCES "playground_proptool_harness"."functional_item_3d_solution" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    UNIQUE (
        "fk_branch_3d_extremity_id",
        "fk_functional_item_3d_solution_id"
    ),
    PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "playground_proptool_harness"."branch_3d_extremity_relation" (
    "id" SERIAL,
    "vector_x" FLOAT NOT NULL,
    "vector_y" FLOAT NOT NULL,
    "vector_z" FLOAT NOT NULL,
    "fk_branch_3d_id" INTEGER REFERENCES "playground_proptool_harness"."branch_3d" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    "fk_branch_3d_extremity_id" INTEGER REFERENCES "playground_proptool_harness"."branch_3d_extremity_solution" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    UNIQUE ("fk_branch_3d_id", "fk_branch_3d_extremity_id"),
    PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "playground_proptool_harness"."branch_3d_segment" (
    "id" SERIAL,
    "name" TEXT,
    "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL,
    "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL,
    "created_by" TEXT,
    "updated_by" TEXT,
    "deletedAt" TIMESTAMP WITH TIME ZONE,
    "fk_branch_3d_id" INTEGER REFERENCES "playground_proptool_harness"."branch_3d" ("id") ON DELETE
    SET
        NULL ON UPDATE CASCADE,
        PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "playground_proptool_harness"."branch_3d_point_definition" (
    "id" SERIAL,
    "coordinate_x" DOUBLE PRECISION,
    "coordinate_y" DOUBLE PRECISION,
    "coordinate_z" DOUBLE PRECISION,
    "vector_x" DOUBLE PRECISION,
    "vector_y" DOUBLE PRECISION,
    "vector_z" DOUBLE PRECISION,
    "middle" BOOLEAN,
    "created_at" TIMESTAMP WITH TIME ZONE NOT NULL,
    "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL,
    "created_by" TEXT,
    "updated_by" TEXT,
    "deleted_at" TIMESTAMP WITH TIME ZONE,
    "fk_branch_3d_id" INTEGER REFERENCES "playground_proptool_harness"."branch_3d" ("id") ON DELETE
    SET
        NULL ON
UPDATE CASCADE,
        "fk_branch_3d_point_definition_id" INTEGER REFERENCES "playground_proptool_harness"."branch_3d" ("id") ON DELETE
    SET
        NULL ON UPDATE CASCADE,
        PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "playground_proptool_harness"."connection_status" (
    "id" SERIAL,
    "name" TEXT,
    "created_at" TIMESTAMP WITH TIME ZONE NOT NULL,
    "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL,
    "created_by" TEXT,
    "updated_by" TEXT,
    "deleted_at" TIMESTAMP WITH TIME ZONE,
    PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "playground_proptool_harness"."deliverable_assembly" (
    "id" SERIAL,
    "number" TEXT,
    "constituent_assembly_number" TEXT,
    "created_at" TIMESTAMP WITH TIME ZONE NOT NULL,
    "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL,
    "created_by" TEXT,
    "updated_by" TEXT,
    "deleted_at" TIMESTAMP WITH TIME ZONE,
    PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "playground_proptool_harness"."deliverable_assembly_solution" (
    "id" SERIAL,
    "deliverable_assembly_solution" TEXT,
    "status" TEXT NOT NULL,
    "created_at" TIMESTAMP WITH TIME ZONE NOT NULL,
    "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL,
    "created_by" TEXT,
    "updated_by" TEXT,
    "deleted_at" TIMESTAMP WITH TIME ZONE,
    "fk_deliverable_assembly_model_id" INTEGER REFERENCES "playground_proptool_harness"."deliverable_assembly" ("id") ON DELETE
    SET
        NULL ON UPDATE CASCADE,
        "fk_deliverable_assembly_id" INTEGER REFERENCES "playground_proptool_harness"."deliverable_assembly" ("id") ON DELETE
    SET
        NULL ON UPDATE CASCADE,
        PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "playground_proptool_harness"."functional_item_3d_solution_partzone_relation" (
    "id" SERIAL,
    "mounting_priority" TEXT,
    "fk_functional_item_3d_solution_id" INTEGER REFERENCES "playground_proptool_harness"."functional_item_3d_solution" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    "fk_part_zone_id" INTEGER REFERENCES "playground_proptool_harness"."part_zone" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    "fk_connection_status_id" INTEGER REFERENCES "playground_proptool_harness"."connection_status" ("id") ON DELETE
    SET
        NULL ON UPDATE CASCADE,
        UNIQUE (
            "fk_functional_item_3d_solution_id",
            "fk_part_zone_id"
        ),
        PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "playground_proptool_harness"."fin_part_zone_route_relation" (
    "id" SERIAL,
    "fk_fin_part_zone_id" INTEGER REFERENCES "playground_proptool_harness"."functional_item_3d_solution_partzone_relation" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    "fk_route_category_id" INTEGER REFERENCES "playground_proptool_harness"."route_category" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    UNIQUE ("fk_fin_part_zone_id", "fk_route_category_id"),
    PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "playground_proptool_harness"."major_component_assembly" (
    "id" SERIAL,
    "name" TEXT,
    "created_at" TIMESTAMP WITH TIME ZONE NOT NULL,
    "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL,
    "created_by" TEXT,
    "updated_by" TEXT,
    "deleted_at" TIMESTAMP WITH TIME ZONE,
    PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "playground_proptool_harness"."harness_3d_design_solution" (
    "id" SERIAL,
    "adap_design_solution_number" TEXT,
    "adap_ds_version" TEXT,
    "adap_ds_owner" TEXT,
    "modification_adap_ds_date" TIMESTAMP WITH TIME ZONE,
    "extraction_owner" TEXT,
    "extraction_date_from_3d" TIMESTAMP WITH TIME ZONE,
    "storing_owner_in_core_elec" TEXT,
    "storing_date_in_core_elec" TIMESTAMP WITH TIME ZONE,
    "cacc_ds_number" TEXT,
    "cacc_ds_solution" INTEGER NOT NULL,
    "consolidation_status" "playground_proptool_harness"."enum_harness_3d_design_solution_consolidation_status" NOT NULL DEFAULT 'KO',
    "consolidation_message" TEXT NOT NULL DEFAULT 'harness not consolidated !',
    "created_at" TIMESTAMP WITH TIME ZONE NOT NULL,
    "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL,
    "created_by" TEXT,
    "updated_by" TEXT,
    "deleted_at" TIMESTAMP WITH TIME ZONE,
    "fk_deliverable_assembly_solution_id" INTEGER REFERENCES "playground_proptool_harness"."deliverable_assembly_solution" ("id") ON DELETE
    SET
        NULL ON UPDATE CASCADE,
        "fk_major_component_assembly_id" INTEGER REFERENCES "playground_proptool_harness"."major_component_assembly" ("id") ON DELETE
    SET
        NULL ON UPDATE CASCADE,
        PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "playground_proptool_harness"."functional_item_harness_3d_design_solution_relation" (
    "id" SERIAL,
    "fk_harness_3d_design_solution_id" INTEGER REFERENCES "playground_proptool_harness"."harness_3d_design_solution" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    "fk_functional_item_id" INTEGER REFERENCES "playground_proptool_harness"."functional_item" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    UNIQUE (
        "fk_harness_3d_design_solution_id",
        "fk_functional_item_id"
    ),
    PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "playground_proptool_harness"."harness_3d_ds_pz_relation" (
    "id" SERIAL,
    "fk_harness_3d_design_solution_id" INTEGER REFERENCES "playground_proptool_harness"."harness_3d_design_solution" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    "fk_part_zone_id" INTEGER REFERENCES "playground_proptool_harness"."part_zone" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    UNIQUE (
        "fk_harness_3d_design_solution_id",
        "fk_part_zone_id"
    ),
    PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "playground_proptool_harness"."harness_manufacturing" (
    "id" SERIAL,
    "deliverable_assembly" TEXT,
    "deliverable_assembly_solution" TEXT,
    "validity" TEXT,
    "status" TEXT,
    "created_at" TIMESTAMP WITH TIME ZONE NOT NULL,
    "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL,
    "created_by" TEXT,
    "updated_by" TEXT,
    "deleted_at" TIMESTAMP WITH TIME ZONE,
    "fk_harness_vb_id" INTEGER REFERENCES "playground_proptool_harness"."harness_3d_design_solution" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "playground_proptool_harness"."harness_manufacturing_sub_assembly" (
    "id" SERIAL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP WITH TIME ZONE NOT NULL,
    "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL,
    "created_by" TEXT,
    "updated_by" TEXT,
    "deleted_at" TIMESTAMP WITH TIME ZONE,
    "fk_deliverable_assembly_solution_id" INTEGER REFERENCES "playground_proptool_harness"."deliverable_assembly_solution" ("id") ON DELETE
    SET
        NULL ON UPDATE CASCADE,
        PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "playground_proptool_harness"."route_branch_3d_relation" (
    "id" SERIAL,
    "fk_branch_3d_id" INTEGER REFERENCES "playground_proptool_harness"."branch_3d" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    "fk_route_category_id" INTEGER REFERENCES "playground_proptool_harness"."route_category" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    UNIQUE ("fk_branch_3d_id", "fk_route_category_id"),
    PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "playground_proptool_harness"."harness_manufactuing_sub_assembly" (
    "id" SERIAL,
    "name" TEXT,
    "deliverable_assembly" TEXT,
    "effective_routes" TEXT,
    "created_at" TIMESTAMP WITH TIME ZONE NOT NULL,
    "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL,
    "created_by" TEXT,
    "updated_by" TEXT,
    "deleted_at" TIMESTAMP WITH TIME ZONE,
    "harnessManufacturingId" INTEGER REFERENCES "playground_proptool_harness"."harness_manufacturing" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    "fk_harness_manufacturing_id" INTEGER REFERENCES "playground_proptool_harness"."harness_manufacturing" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "playground_proptool_harness"."validity" (
    "id" SERIAL,
    "code" TEXT NOT NULL,
    "rank_number_from" INTEGER NOT NULL,
    "rank_number_to" INTEGER NOT NULL,
    "created_at" TIMESTAMP WITH TIME ZONE NOT NULL,
    "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL,
    "created_by" TEXT,
    "updated_by" TEXT,
    "deleted_at" TIMESTAMP WITH TIME ZONE,
    "fk_aircraft_program_id" INTEGER REFERENCES "playground_proptool_harness"."aircraft_program" ("id") ON DELETE
    SET
        NULL ON UPDATE CASCADE,
        PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "playground_proptool_harness"."validity_da_solution_relation" (
    "id" SERIAL,
    "fk_validity_id" INTEGER,
    "fk_deliverable_assembly_solution_id" INTEGER,
    UNIQUE (
        "fk_validity_id",
        "fk_deliverable_assembly_solution_id"
    ),
    PRIMARY KEY ("id")
);

GRANT USAGE,
SELECT
    ON ALL SEQUENCES IN SCHEMA playground_proptool_harness TO app_ce_api_harness;

GRANT USAGE,
SELECT
    ON ALL SEQUENCES IN SCHEMA playground_proptool_harness TO team_lost_in_installation;

GRANT ALL ON TABLE "playground_proptool_harness"."validity_da_solution_relation" to app_ce_api_harness;

GRANT ALL ON TABLE "playground_proptool_harness"."validity_da_solution_relation" to team_lost_in_installation;

GRANT ALL ON TABLE "playground_proptool_harness"."validity" to app_ce_api_harness;

GRANT ALL ON TABLE "playground_proptool_harness"."validity" to team_lost_in_installation;

GRANT ALL ON TABLE "playground_proptool_harness"."harness_manufactuing_sub_assembly" to app_ce_api_harness;

GRANT ALL ON TABLE "playground_proptool_harness"."harness_manufactuing_sub_assembly" to team_lost_in_installation;

GRANT ALL ON TABLE "playground_proptool_harness"."route_branch_3d_relation" to app_ce_api_harness;

GRANT ALL ON TABLE "playground_proptool_harness"."route_branch_3d_relation" to team_lost_in_installation;

GRANT ALL ON TABLE "playground_proptool_harness"."harness_manufacturing_sub_assembly" to app_ce_api_harness;

GRANT ALL ON TABLE "playground_proptool_harness"."harness_manufacturing_sub_assembly" to team_lost_in_installation;

GRANT ALL ON TABLE "playground_proptool_harness"."harness_manufacturing" to app_ce_api_harness;

GRANT ALL ON TABLE "playground_proptool_harness"."harness_manufacturing" to team_lost_in_installation;

GRANT ALL ON TABLE "playground_proptool_harness"."harness_3d_ds_pz_relation" to app_ce_api_harness;

GRANT ALL ON TABLE "playground_proptool_harness"."harness_3d_ds_pz_relation" to team_lost_in_installation;

GRANT ALL ON TABLE "playground_proptool_harness"."functional_item_harness_3d_design_solution_relation" to app_ce_api_harness;

GRANT ALL ON TABLE "playground_proptool_harness"."functional_item_harness_3d_design_solution_relation" to team_lost_in_installation;

GRANT ALL ON TABLE "playground_proptool_harness"."harness_3d_design_solution" to app_ce_api_harness;

GRANT ALL ON TABLE "playground_proptool_harness"."harness_3d_design_solution" to team_lost_in_installation;

GRANT ALL ON TABLE "playground_proptool_harness"."major_component_assembly" to app_ce_api_harness;

GRANT ALL ON TABLE "playground_proptool_harness"."major_component_assembly" to team_lost_in_installation;

GRANT ALL ON TABLE "playground_proptool_harness"."fin_part_zone_route_relation" to app_ce_api_harness;

GRANT ALL ON TABLE "playground_proptool_harness"."fin_part_zone_route_relation" to team_lost_in_installation;

GRANT ALL ON TABLE "playground_proptool_harness"."functional_item_3d_solution_partzone_relation" to app_ce_api_harness;

GRANT ALL ON TABLE "playground_proptool_harness"."functional_item_3d_solution_partzone_relation" to team_lost_in_installation;

GRANT ALL ON TABLE "playground_proptool_harness"."deliverable_assembly_solution" to app_ce_api_harness;

GRANT ALL ON TABLE "playground_proptool_harness"."deliverable_assembly_solution" to team_lost_in_installation;

GRANT ALL ON TABLE "playground_proptool_harness"."deliverable_assembly" to app_ce_api_harness;

GRANT ALL ON TABLE "playground_proptool_harness"."deliverable_assembly" to team_lost_in_installation;

GRANT ALL ON TABLE "playground_proptool_harness"."connection_status" to app_ce_api_harness;

GRANT ALL ON TABLE "playground_proptool_harness"."connection_status" to team_lost_in_installation;

GRANT ALL ON TABLE "playground_proptool_harness"."branch_3d_point_definition" to app_ce_api_harness;

GRANT ALL ON TABLE "playground_proptool_harness"."branch_3d_point_definition" to team_lost_in_installation;

GRANT ALL ON TABLE "playground_proptool_harness"."branch_3d_segment" to app_ce_api_harness;

GRANT ALL ON TABLE "playground_proptool_harness"."branch_3d_segment" to team_lost_in_installation;

GRANT ALL ON TABLE "playground_proptool_harness"."branch_3d_extremity_relation" to app_ce_api_harness;

GRANT ALL ON TABLE "playground_proptool_harness"."branch_3d_extremity_relation" to team_lost_in_installation;

GRANT ALL ON TABLE "playground_proptool_harness"."branch_3d_extremity_fin_ds_relation" to app_ce_api_harness;

GRANT ALL ON TABLE "playground_proptool_harness"."branch_3d_extremity_fin_ds_relation" to team_lost_in_installation;

GRANT ALL ON TABLE "playground_proptool_harness"."branch_3d_extremity_solution" to app_ce_api_harness;

GRANT ALL ON TABLE "playground_proptool_harness"."branch_3d_extremity_solution" to team_lost_in_installation;

GRANT ALL ON TABLE "playground_proptool_harness"."branch_3d_extremity_type" to app_ce_api_harness;

GRANT ALL ON TABLE "playground_proptool_harness"."branch_3d_extremity_type" to team_lost_in_installation;

GRANT ALL ON TABLE "playground_proptool_harness"."branch_manuf_extremity" to app_ce_api_harness;

GRANT ALL ON TABLE "playground_proptool_harness"."branch_manuf_extremity" to team_lost_in_installation;

GRANT ALL ON TABLE "playground_proptool_harness"."branch_3d_environment_type_relation" to app_ce_api_harness;

GRANT ALL ON TABLE "playground_proptool_harness"."branch_3d_environment_type_relation" to team_lost_in_installation;

GRANT ALL ON TABLE "playground_proptool_harness"."environments_type" to app_ce_api_harness;

GRANT ALL ON TABLE "playground_proptool_harness"."environments_type" to team_lost_in_installation;

GRANT ALL ON TABLE "playground_proptool_harness"."branch_3d_covering_element_solution_relation" to app_ce_api_harness;

GRANT ALL ON TABLE "playground_proptool_harness"."branch_3d_covering_element_solution_relation" to team_lost_in_installation;

GRANT ALL ON TABLE "playground_proptool_harness"."covering_element_3d" to app_ce_api_harness;

GRANT ALL ON TABLE "playground_proptool_harness"."covering_element_3d" to team_lost_in_installation;

GRANT ALL ON TABLE "playground_proptool_harness"."branch_3d_extremity_covering_element_relation" to app_ce_api_harness;

GRANT ALL ON TABLE "playground_proptool_harness"."branch_3d_extremity_covering_element_relation" to team_lost_in_installation;

GRANT ALL ON TABLE "playground_proptool_harness"."covering_element_type" to app_ce_api_harness;

GRANT ALL ON TABLE "playground_proptool_harness"."covering_element_type" to team_lost_in_installation;

GRANT ALL ON TABLE "playground_proptool_harness"."branch_3d" to app_ce_api_harness;

GRANT ALL ON TABLE "playground_proptool_harness"."branch_3d" to team_lost_in_installation;

GRANT ALL ON TABLE "playground_proptool_harness"."part_zone" to app_ce_api_harness;

GRANT ALL ON TABLE "playground_proptool_harness"."part_zone" to team_lost_in_installation;

GRANT ALL ON TABLE "playground_proptool_harness"."user_area" to app_ce_api_harness;

GRANT ALL ON TABLE "playground_proptool_harness"."user_area" to team_lost_in_installation;

GRANT ALL ON TABLE "playground_proptool_harness"."backshell_3d_solution" to app_ce_api_harness;

GRANT ALL ON TABLE "playground_proptool_harness"."backshell_3d_solution" to team_lost_in_installation;

GRANT ALL ON TABLE "playground_proptool_harness"."functional_item_3d_solution" to app_ce_api_harness;

GRANT ALL ON TABLE "playground_proptool_harness"."functional_item_3d_solution" to team_lost_in_installation;

GRANT ALL ON TABLE "playground_proptool_harness"."functional_item" to app_ce_api_harness;

GRANT ALL ON TABLE "playground_proptool_harness"."functional_item" to team_lost_in_installation;

GRANT ALL ON TABLE "playground_proptool_harness"."circuit" to app_ce_api_harness;

GRANT ALL ON TABLE "playground_proptool_harness"."circuit" to team_lost_in_installation;

GRANT ALL ON TABLE "playground_proptool_harness"."component" to app_ce_api_harness;

GRANT ALL ON TABLE "playground_proptool_harness"."component" to team_lost_in_installation;

GRANT ALL ON TABLE "playground_proptool_harness"."mechanical_covering_element_component" to app_ce_api_harness;

GRANT ALL ON TABLE "playground_proptool_harness"."mechanical_covering_element_component" to team_lost_in_installation;

GRANT ALL ON TABLE "playground_proptool_harness"."mechanical_backshell_component" to app_ce_api_harness;

GRANT ALL ON TABLE "playground_proptool_harness"."mechanical_backshell_component" to team_lost_in_installation;

GRANT ALL ON TABLE "playground_proptool_harness"."aircraft_program_route_category_relation" to app_ce_api_harness;

GRANT ALL ON TABLE "playground_proptool_harness"."aircraft_program_route_category_relation" to team_lost_in_installation;

GRANT ALL ON TABLE "playground_proptool_harness"."route_category" to app_ce_api_harness;

GRANT ALL ON TABLE "playground_proptool_harness"."route_category" to team_lost_in_installation;

GRANT ALL ON TABLE "playground_proptool_harness"."aircraft_program" to app_ce_api_harness;

GRANT ALL ON TABLE "playground_proptool_harness"."aircraft_program" to team_lost_in_installation;

