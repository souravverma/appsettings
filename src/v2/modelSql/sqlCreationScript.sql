CREATE TABLE coreelecv2.backshell_3d_solution
(
	id integer NOT NULL,
	fk_functional_item_id integer NOT NULL,
	fk_component_id integer NOT NULL,	-- Ex: EN4165-026M20A
	backshell_orientation varchar(50) NULL,	-- Orientation of the backshell (clocking angle from reference between 0 and 360 degrees)
	backshell_orientation_reference varchar(50) NULL,	-- Reference for measurement (possible values: Masterkey, Table, None)
	position_x double precision NULL,
	position_y double precision NULL,
	position_z double precision NULL
)
;

CREATE TABLE coreelecv2.branch_3d
(
	id integer NOT NULL,
	name varchar(50) NOT NULL,
	branch_id varchar(50) NULL,
	segments_3d_id varchar(50) NULL,
	diameter_3d_mm double precision NOT NULL,
	bend_radius double precision NULL,
	length_mm double precision NOT NULL,
	length_forced_mm double precision NOT NULL,
	extra_length_mm double precision NOT NULL,
	fk_partzone_id integer NOT NULL,
	admissible_routes varchar(50) NULL,	-- Given in proptool / NA in 3DX 
	effective_routes varchar(50) NULL,	-- Given in 3DX / NA in proptool
	fk_environment_id integer NULL,	-- Should be a list with tjhe following choice: PRESSURISED UNPRESSURISED_PROTECTED UNPRESSURISED_EXPOSED HYDRAULIC  FUEL FIRE  HOT SWAMP VIBRATION
	not_extractible boolean NULL	-- true or false
)
;

CREATE TABLE coreelecv2.branch_3d_extremity_covering_element_relation
(
	fk_branch_3d_extremity_id integer NOT NULL,
	fk_covering_element_3d_id integer NOT NULL,
	length_mm double precision NULL	-- The length is the distance between the extremity of the branch and the starting point of the covering element
)
;

CREATE TABLE coreelecv2.branch_3d_extremity_fin_ds_relation
(
	fk_branch_3d_extremity_id integer NOT NULL,	-- Relation between branch extremity and Fin DS
	fk_fin_ds_id integer NOT NULL
)
;

CREATE TABLE coreelecv2.branch_3d_extremity_relation
(
	fk_branch_3d_id integer NOT NULL,
	fk_branch_3d_extremity_id integer NOT NULL,	-- In 3DX for the NIS needs:  segment Id + "Start" or "End" 
	vector_x double precision NOT NULL,	-- In 3DX for the NIS needs:  <Segment>.<End_vector | Start_Vector> (1st line)
	vector_y double precision NOT NULL,	-- In 3DX for the NIS needs:  <Segment>.<End_vector | Start_Vector> (2nd line)
	vector_z double precision NOT NULL,	-- In 3DX for the NIS needs:  <Segment>.<End_vector | Start_Vector> (3rd line)
	name varchar(50) NOT NULL	-- In 3DX for the NIS needs:  <Segment>.<End_node | Start_node>.<Node>   - <Node> doesn't contains any <Referenced_components> node => type = derivation   - <Node> contains a <Referenced_components> node => type = connector   - Crossref should be managed as derivation
)
;

CREATE TABLE coreelecv2.branch_3d_extremity_solution
(
	id integer NOT NULL,
	fk_branch_manuf_extremity_id integer NULL,
	name varchar(50) NOT NULL,	-- In proptool:  <COMPONENTS><EXT ID="EXTXXXX">  or   <NODES><DR ID="DERXXXX">  or   <NODES><DR ID="RENXXXX"> or <SPLICES>SPL ID="SPLXXXX">
	fk_type_id integer NOT NULL,	-- In 3DX for the NIS needs: (same in proptool)  <Segment>.<End_node | Start_node>.<Node>   - <Node> doesn't contains any <Referenced_components> node => type = derivation   - <Node> contains a <Referenced_components> node => type = connector   - Crossref should be managed as derivation
	electrical_coordinate_x double precision NOT NULL,	-- In 3DX (KBL file) for NIS needs:  [...]<Accessory/Connector_occurrence><Placement><matrix_point> (1st line)
	electrical_coordinate_y double precision NOT NULL,	-- In 3DX (KBL file) for NIS needs:  [...]<Accessory/Connector_occurrence><Placement><matrix_point> (2nd line)
	electrical_coordinate_z double precision NOT NULL	-- In 3DX (KBL file) for NIS needs:  [...]<Accessory/Connector_occurrence><Placement><matrix_point> (3rd line)
)
;

CREATE TABLE coreelecv2.branch_3d_extremity_type
(
	id integer NOT NULL,
	type varchar(50) NULL	-- In 3DX for the NIS needs: (same in proptool)  <Segment>.<End_node | Start_node>.<Node>   - <Node> doesn't contains any <Referenced_components> node => type = derivation   - <Node> contains a <Referenced_components> node => type = connector   - Crossref should be managed as derivation
)
;

CREATE TABLE coreelecv2.branch_3d_segment
(
	id integer NOT NULL,
	name varchar(50) NULL,
	fk_branch_3d_id integer NULL
)
;

CREATE TABLE coreelecv2.branch_manuf_extremity
(
	id integer NOT NULL,
	name varchar(50) NOT NULL,	-- For example in proptool : DER or EXT or REN
	usable_for varchar(50) NULL	-- Define the context of applicability (Point link between engineering and manufacturing
)
;

CREATE TABLE coreelecv2.branch_point_definition
(
	id integer NOT NULL,
	branch_coordinate_x varchar(50) NULL,
	branch_coordinate_y varchar(50) NULL,
	branch_coordinate_z varchar(50) NULL,
	branch_vector_x varchar(50) NULL,
	branch_vector_y varchar(50) NULL,
	branch_vector_z varchar(50) NULL,
	fk_branch_3d_id integer NULL
)
;

CREATE TABLE coreelecv2.branch3d_covering_element_solution_relation
(
	fk_branch_3d_id integer NOT NULL,
	fk_covering_element_3d_solution_id integer NOT NULL
)
;

CREATE TABLE coreelecv2.covering_element_3d
(
	id integer NOT NULL,
	fk_type_id integer NOT NULL,	-- Ex (Marker,sleeve, inner sleeve, internal sleeve ...)
	fk_component_id integer NOT NULL,
	name varchar(50) NULL	-- name is the id_3d of proptool
)
;

CREATE TABLE coreelecv2.covering_element_type
(
	id integer NOT NULL,
	name varchar(50) NULL	-- marker, sleeve, inner sleeve, external sleeve, ...
)
;

CREATE TABLE coreelecv2.deliverable_assembly_solution
(
	id integer NOT NULL,
	fk_deliverable_assembly_id integer NULL,	-- Ex: DA: D954C0120  Fifth digit of the DA is the solution:"C" in this example
	deliverable_assembly_solution varchar(3) NULL,	-- Ex: DA: D954C0120  Fifth digit of the DA is the solution:"C" in this example
	status varchar(50) NOT NULL	-- "temporary" or "validated"
)
;

CREATE TABLE coreelecv2.environments_type
(
	id integer NOT NULL,
	name varchar(50) NULL	-- PRESSURISED UNPRESSURISED_PROTECTED UNPRESSURISED_EXPOSED HYDRAULIC  FUEL FIRE  HOT SWAMP VIBRATION
)
;

CREATE TABLE coreelecv2.fin_3d_effective_routes_relation
(
	fk_route_category_id integer NOT NULL,	-- For example in proptool :   <EXT ID="EXTxxxx"> -> Connector and/or Backshell <DER ID="DERxxxx"> -> Derivation <REN ID="=B5B601"> -> Crossref
	fk_fin_3d_solution_id integer NOT NULL
)
;

CREATE TABLE coreelecv2.functional_item_3d_solution
(
	id integer NOT NULL,
	fk_functional_item_id integer NOT NULL,
	solution_number varchar(50) NULL,
	"3d_part_number" varchar(50) NOT NULL,	-- Ex: NSA2992C456
	"3d_instance_name" varchar(50) NULL,	-- EX : 2772VT016|#_8-B
	definition_zone varchar(50) NULL,	-- ZONE: zone definition for an electric component. Ex. : 121 (3digits)
	panel varchar(50) NULL,	-- PANEL:  panel definition for an electrical component. Ex. : 800 VU
	long_part_number varchar(50) NULL,	-- REFERENCE: Identification of most complete reference of equipment (under electrical installer responsibility). E.g.: EN3545E01FXA16A
	mounting_priority varchar(1) NULL,	-- priority (manufacturing needs)  Manuf info: Delivery assembly type for the component: Define the link type of the coreelecv2.component with the delivery assembly.     - P when coreelecv2.component is assembled in the delivery assembly.     - X or F when coreelecv2.component is not assembled in this delivery assembly but is connected to a route. The use of F letter allows defining a priority in case of wire multiple affectations.
	fk_mounting_fin_master_id integer NULL,	-- connection_drawing_root manufacturing needs: by default fin number but can be modified by the user
	master_source_id varchar(50) NOT NULL,
	position_x double precision NULL,
	position_y double precision NULL,
	position_z double precision NULL,
	fk_part_zone_id integer NULL	-- Direct link with the part zone especially for FIN's not connected to branch (Ex: VT  assembly for rails)
)
;

/* THEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEERE */
CREATE TABLE coreelecv2.harness_3d_design_solution
(
	id integer NOT NULL,
	adap_design_solution_number varchar(20) NULL,	-- Ex: D8991ES1000000 (14 digits in france for nis)
	adap_ds_version varchar(3) NULL,	-- Ex: "A.1" (in france for nis in 3dx)
	harness_consolidation_status boolean NULL,	-- harness consolidated with all its part zones: "true" or "false" According to check done in Core Elec
	adap_ds_owner varchar(50) NULL,
	modification_adap_ds_date timestamp without time zone NULL,
	extraction_owner varchar(50) NULL,
	extraction_date_from_3d timestamp without time zone NULL,
	storing_owner_in_core_elec varchar(50) NULL,
	storing_date_in_core_elec timestamp without time zone NULL,
	fk_functional_item_id integer NOT NULL,
	fk_deliverable_assembly_solution_id integer NULL,
	cacc_ds_number varchar(20) NULL,	-- Usable for proptool (To be validated with Wall-E team)
	cacc_ds_solution varchar(3) NOT NULL,	-- Usable for proptool (To be validated with Wall-E team)
	fk_major_component_assembly_id integer NULL
)
;

CREATE TABLE coreelecv2.harness_3d_ds_pz_relation
(
	fk_harness_3d_design_solution_id integer NULL,
	fk_part_zone_id integer NULL
)
;

CREATE TABLE coreelecv2.harness_manufacturing_sub_assembly
(
	id integer NOT NULL,
	name varchar(50) NOT NULL,
	fk_deliverable_assembly_solution_id integer NOT NULL
)
;

CREATE TABLE coreelecv2.mechanical_backshell_component
(
	id integer NOT NULL,
	material varchar(50) NULL,
	emi boolean NULL,
	backshell_type varchar(50) NULL	-- Backshell type (S = Straight/C = Curved/H = Half-Curved/R = Ring/SC = ?)  Change to attribute coreelecv2.mechanical_backshell_component => TBC
)
;

CREATE TABLE coreelecv2.mechanical_covering_element_component
(
	id integer NOT NULL,
	bend_radius_min_d double precision NULL,
	colour varchar(50) NULL,
	comment varchar(300) NULL,
	comment_tresti varchar(50) NULL,
	diameter_max_mm double precision NULL,
	diameter_max_mm_tresti double precision NULL,
	diameter_min_mm double precision NULL,
	diameter_min_mm_tresti double precision NULL,
	environement varchar(100) NULL,
	length_mm double precision NULL,
	length_mm_tresti double precision NULL,
	material varchar(100) NULL,
	"order" varchar(100) NULL,
	order_tresti varchar(100) NULL,
	size_code varchar(10) NULL,
	size_code_tresti varchar(50) NULL,
	sleeve_family varchar(50) NULL,
	sleeve_family_tresti varchar(50) NULL,
	temperature_max_c double precision NULL,
	temperature_min_c double precision NULL,
	thickness_coeff_a varchar(50) NULL,
	thickness_coeff_a_tresti varchar(50) NULL,
	thickness_coeff_b varchar(50) NULL,
	thickness_coeff_b_tresti varchar(50) NULL,
	weight_g double precision NULL,
	weight_g_m_tresti double precision NULL,
	fk_component_id integer NOT NULL
)
;

CREATE TABLE coreelecv2.part_zone
(
	id integer NOT NULL,
	name varchar(50) NOT NULL,
	fk_user_area_id integer NULL,
	partzone_version varchar(50) NULL	-- PDM info 2 (N/A pour SA)
)
;

CREATE TABLE coreelecv2.route_branch_3d_relation
(
	fk_route_id integer NOT NULL,
	fk_branch_3d_id integer NOT NULL
)
;

CREATE TABLE coreelecv2.validity_da_solution_relation
(
	fk_validity_id integer NOT NULL,
	fk_da_solution_id integer NOT NULL
)
;

CREATE TABLE coreelecv2.major_component_assembly
(
	id integer NOT NULL,
	name varchar(50) NULL
)
;

CREATE TABLE coreelecv2.aircraft_program
(
	id integer NOT NULL,	-- Technical key generated for uniqueness of all aircraft programs of Airbus to be referenced easily
	family_name varchar(50) NOT NULL,	-- name of the aircraft family for example A320 for A318/A319/A320/A321
	aircraft_letter_code varchar(1) NOT NULL,	-- the program letter defined (for example 'D' for single aisle)
	taksy_project_key integer NULL,	-- Numeric code used in TAKSY: 81 for SA, 80 for LR and 85 for A380
	taksy_short_code varchar(50) NULL	-- short code used in some parts of taksy to identify this aircraft program (i.e. SA / LR / A380)
)
;

CREATE TABLE coreelecv2.circuit
(
	id integer NOT NULL,	-- Technical key generated for uniqueness of allowed coreelecv2.circuit letters to be referenced easily
	fk_aircraft_program_id integer NOT NULL,	-- the link to the aircraft program for which this coreelecv2.circuit entry is valid (as defined by BAABI)
	letters text NOT NULL,	-- the coreelecv2.circuit letters as defined by the Basic Approved ATA Breakdown Index (BAABI)  The possible first System coreelecv2.Circuit Letter is described inside "ABD0004.3 - Electrical Drawing Set Definition" System Identification Chapter. Here is a copy of the System Letter Allocation table:  A - Reserved for Military project  B - Reserved for Military project  C - Flight control systems  D - De-icing  E - Engine monitoring  F - Flight instrumentation  G - Landing gear  H - Air conditioning  I - Not used (could be confused with the number 1 - one)  J - Hydraulics  K - Engine/APU control and starting  L - Lighting  M - Interior arrangement/Passenger service system  O - Not used (could be confused with the number 0 - zero)  P - DC generation  Q - Fuel  R - Radio (NAV and COM)  S - Radar, navigation  T - Recording  V - Fictitious coreelecv2.circuit  W - Fire protection and warning system  X - AC generation  Y - Free  Z - Special tests circuits  Figure 10 - ABD0004 & Identification Letter 
	description text NULL
)
;

CREATE TABLE coreelecv2.component
(
	id integer NOT NULL,
	part_number varchar(50) NOT NULL,	-- The full part number of this component. A Part Number is an identifier given by a Manufacturer or a Supplier to a Part or an Assembly or a Kit or a Material item.  i.e. EN2997Y02557M6
	norm varchar(50) NULL	-- the norm of this coreelecv2.component for example EN2997
)
;

CREATE TABLE coreelecv2.deliverable_assembly
(
	id integer NOT NULL,	-- technical key
	number varchar(50) NULL,	-- the number / name of the deliverable assembly  	- in germany the HTZ (D929-50001-000-00) 	- in france the DA (D956A2120)
	constituent_assembly_number varchar(50) NULL	-- the number of the constituent assembly 	- in germany the HTZ (D929-50001-000-00) 	- in france (D92912345600)
)
;

CREATE TABLE coreelecv2.functional_item
(
	id integer NOT NULL,	-- Technical key generated for uniqueness of a functional item to be referenced easily
	fk_aircraft_program_id integer NOT NULL,
	fk_circuit_id integer NOT NULL,	-- Foreign  key constraint, relation to table circuit
	sequence_number varchar(4) NOT NULL,
	suffix varchar(3) NULL,	-- This area is composed of 3 digits, left justified. It contains mainly numbers but letters are also used for Electrical purpose.  Suffix allows to differentiate 2 FIN with same Sequence Number. For example: Identical items used more than once in the same system
	appended_letter varchar(3) NULL,	-- This area is composed of 3 digits, right justified. It contains mainly letters but numbers are also used for Electrical purpose.
	supplementary_part varchar(1) NULL,	-- This area is composed of one digit. It can be a number or a letter. It is only used for Electrical FIN or Fictitious FIN.
	description text NULL
)
;

CREATE TABLE coreelecv2.route_category
(
	id integer NOT NULL,
	fk_aircraft_program_id integer NOT NULL,	-- the aircraft program that this route entry is valid for
	name varchar(50) NULL,	-- the full name of the route category 	- 1M 	- 1ME 	- 19T 	- 10R
	essential boolean NULL,	-- whether this route category is for essential or non-essential use
	system integer NULL,	-- the system this route belongs to (1 or 2)
	system_description text NULL,
	category_code varchar(50) NULL,	-- the category that this route belongs to for example M for Miscellaneous, S for sensitive, T, U or V for coax
	category_description text NULL,
	remarks text NULL
)
;

CREATE TABLE coreelecv2.validity
(
	id integer NOT NULL,	-- technical key
	fk_aircraft_program_id integer NOT NULL,	-- technical link to the aircraft_program
	code varchar(5) NOT NULL,	-- code, which could be customer version (AFR01) or a standard version (ST1) or an industrial choice(1M*)
	rank_number_from integer NOT NULL,	-- rank_number_from: the lower bound of the coreelecv2.validity (inclusive) 1, 10, 25
	rank_number_to integer NOT NULL	-- rank_number_to: the upper bound of the coreelecv2.validity (inclusive) 5, 50, MAX_INT (which is encoded on legacy site sometimes as 9999, 99999, FFFF and has to be transformed to MAX_INT)
)
;