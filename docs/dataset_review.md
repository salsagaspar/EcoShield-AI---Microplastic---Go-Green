# Dataset Review: EcoShield AI Platform

This document contains a detailed review of the 6 dataset files located in the **EcoShield AI** project workspace. These datasets are structured into 3 logical categories representing the 3 pillars of the platform.

---

## 🌎 Pillar 1: Microplastic Pollution Monitoring (Dataset 1)

This pillar merges individual microplastic sample measurements with sampling station characteristics (geography, climate, and ecosystem).

### 1. `dataset1_microplastic_sample.csv` (8,500 rows)
Contains individual sample measurements of water or sediment containing microplastics.

| Column Name | Data Type | Description | Missing Value Status |
| :--- | :--- | :--- | :--- |
| `sample_id` | `int64` | Unique ID for each sample. | Clean (0) |
| `location_id` | `int64` | ID of the sampling station (Foreign Key to Location). | Clean (0) |
| `collector_id` | `int64` | ID of the sample collector. | Clean (0) |
| `collection_date` | `object` (Date) | Date the sample was collected (YYYY-MM-DD). | Clean (0) |
| `plastic_type` | `object` (Cat) | Main plastic type (PP, PET, ABS, EPS, Nylon, LDPE, PVC, PS, HDPE, etc.). | Clean (0) |
| `shape` | `object` (Cat) | Physical shape of the particles (Fragment, Film, Fiber, Line, Bead, Foam, Pellet, Granule). | Clean (0) |
| `color` | `object` (Cat) | Particle color (Orange, Grey, Red, Black, Blue, Yellow, Transparent, etc.). | Clean (0) |
| `size_class` | `object` (Cat) | Particle size classification (Small, Micro, Meso, Nano). | Clean (0) |
| `size_um` | `float64` | Particle size in micrometers ($\mu m$). | Clean (0) |
| `concentration_particles_per_l` | `float64` | Particle concentration per liter (Primary target variable for regression). | Clean (0) |
| `sample_volume_l` | `float64` | Volume of water sample filtered (Liters). | Clean (0) |
| `sample_weight_mg` | `float64` | Total weight of plastic particles collected (Milligrams). | Clean (0) |
| `depth_m` | `float64` | Water depth during sampling (Meters). | Clean (0) |
| `collection_method` | `object` (Cat) | Sampling method (Surface Trawl, Grab Sample, Beach Combing, etc.). | Clean (0) |
| `lab_analysis_method` | `object` (Cat) | Lab analysis method (FTIR, Visual ID, SEM-EDX, Raman, Py-GC/MS, NIR). | Clean (0) |
| `season` | `object` (Cat) | Sampling season (DJF, MAM, JJA, SON). | Clean (0) |
| `ph_level` | `float64` | Acidity level (pH) of the water during sampling. | Clean (0) |
| `turbidity_ntu` | `float64` | Water turbidity (Nephelometric Turbidity Units). | Clean (0) |
| `salinity_ppt` | `float64` | Water salinity (Parts Per Thousand). | Clean (0) |
| `field_staff_id` | `object` | ID of the field staff who performed the sampling. | Clean (0) |

### 2. `dataset1_sampling_location.csv` (8,500 rows)
Describes the ecological and environmental characteristics of the sampling stations.

| Column Name | Data Type | Description | Missing Value Status |
| :--- | :--- | :--- | :--- |
| `location_id` | `int64` | Unique ID of the monitoring station (Primary Key). | Clean (0) |
| `location_name` | `object` | Name of the monitoring station (format: Site_XXXX_XYZ). | Clean (0) |
| `country` | `object` | Country where the station is located (real country names). | Clean (0) |
| `region` | `object` | Administrative region in the country (format: Region_X). | Clean (0) |
| `latitude` | `float64` | Geographical latitude coordinate of the station. | Clean (0) |
| `longitude` | `float64` | Geographical longitude coordinate of the station. | Clean (0) |
| `location_type` | `object` (Cat) | Type of water body (Lake, River, Ocean Surface, Coastal Beach, Reservoir, Wetland, etc.). | Clean (0) |
| `biome` | `object` (Cat) | Biome type of the station area (Subtropical, Tropical Rainforest, Arid Desert, Boreal, etc.). | Clean (0) |
| `water_body_type` | `object` (Cat) | Water type (Saltwater, Freshwater, Brackish). | Clean (0) |
| `urbanization_level` | `object` (Cat) | Urbanization level (Rural, Protected Area, Urban, Peri-urban, Industrial Zone). | Clean (0) |
| `elevation_m` | `float64` | Elevation above sea level (Meters). | Clean (0) |
| `distance_to_coast_km` | `float64` | Closest distance from the station to the coastline (Kilometers). | Clean (0) |
| `area_km2` | `float64` | Total surface area of the station/water body (Km²). | Clean (0) |
| `monitoring_status` | `object` (Cat) | Monitoring status (Active, Seasonal, Inactive, Decommissioned). | Clean (0) |
| `established_year` | `int64` | Year the monitoring station was established. | Clean (0) |
| `annual_rainfall_mm` | `float64` | Annual rainfall at the station location (Millimeters). | Clean (0) |
| `avg_temperature_c` | `float64` | Average annual temperature at the station location (Celsius). | Clean (0) |
| `pollution_index` | `float64` | General pollution index of the area (scale 0-10). | Clean (0) |
| `biodiversity_score` | `float64` | Local biodiversity score (scale 0-10). | Clean (0) |
| `is_protected_zone` | `bool` | Whether the station area is a protected conservation zone (True/False). | Clean (0) |

### 🔗 Merging Logic (Dataset 1 Pair)
* **Join Key:** `location_id` (Integer)
* **Join Type:** `Inner Join` or `Left Join` from the sample table to the location table.
* **Merged Output:** A unified table with 8,500 microplastic samples enriched with 19 ecological columns of the location where the sample was collected.
* **AI Objective:** Combine geographical features (such as rainfall, urbanization, and biome) with environmental variables to predict the microplastic concentration level.

---

## 🗑️ Pillar 2: Plastic Waste Cleanup Operations (Dataset 2)

This pillar links field cleanup events with the capacity and characteristics of the waste collectors that run them.

### 1. `dataset2_plastic_waste_event.csv` (8,500 rows)
Records operational details of each plastic waste cleanup event.

| Column Name | Data Type | Description | Missing Value Status |
| :--- | :--- | :--- | :--- |
| `event_id` | `int64` | Unique ID for each cleanup event. | Clean (0) |
| `collector_id` | `int64` | ID of the organizing waste collector (Foreign Key to Collector). | Clean (0) |
| `site_id` | `int64` | ID of the cleanup location (separate namespace from Dataset 1). | Clean (0) |
| `event_date` | `object` (Date) | Date the cleanup event occurred. | Clean (0) |
| `waste_source` | `object` (Cat) | Source of plastic waste (Agriculture, Electronics, Fishing Industry, Packaging, Construction, etc.). | Clean (0) |
| `plastic_grade` | `object` (Cat) | Grade of plastic collected (Recycled Grade A/B, Mixed, Virgin, Contaminated, etc.). | Clean (0) |
| `weight_collected_ton` | `float64` | Total weight of plastic waste collected (Tons) - Primary Regression Target. | Clean (0) |
| `volume_collected_m3` | `float64` | Total volume of plastic waste collected (M³). | Clean (0) |
| `microplastic_fraction_pct` | `float64` | Percentage of microplastic fraction from the total collected waste. | Clean (0) |
| `disposal_mode` | `object` (Cat) | Ultimate disposal method (Landfill, Ocean Discharge, Recycled, Upcycled, Exported, etc.). | Clean (0) |
| `transport_mode` | `object` (Cat) | Transport mode (Truck, Rail, Boat, Pipeline, Manual Carry, Conveyor). | Clean (0) |
| `weather_condition` | `object` (Cat) | Weather during the cleanup event (Stormy, Cloudy, Rainy, Windy, Foggy, Clear). | Clean (0) |
| `duration_hours` | `float64` | Duration of the cleanup event (Hours). | Clean (0) |
| `num_volunteers` | `int64` | Number of volunteers who participated. | Clean (0) |
| `cost_usd` | `float64` | Operational cost of the cleanup event (USD). | Clean (0) |
| `co2_saved_kg` | `float64` | Estimated weight of CO2 emissions saved (Kilograms). | Clean (0) |
| `event_status` | `object` (Cat) | Event status (Pending Review, Completed, Cancelled, Ongoing, Partial). | Clean (0) |
| `quality_control_passed` | `bool` | Whether the cleanup process passed quality control checks (True/False). | Clean (0) |
| `third_party_verified` | `bool` | Whether the event data has been verified by a third party (True/False). | Clean (0) |
| `notes_flag` | `object` (Cat) | Note flag (Clean, Minor Issues, Data Gap, Major Issues, Anomaly). | Clean (0) |

### 2. `dataset2_waste_collector.csv` (8,500 rows)
Profiles the operations, financial capacities, and characteristics of waste collectors.

| Column Name | Data Type | Description | Missing Value Status |
| :--- | :--- | :--- | :--- |
| `collector_id` | `int64` | Unique ID of the waste collector (Primary Key). | Clean (0) |
| `collector_name` | `object` | Name of the collector (format: Collector_XXXXX). | Clean (0) |
| `collector_type` | `object` (Cat) | Type of organization (Community Group, NGO, Private Company, Startup, Government Agency, etc.). | Clean (0) |
| `region` | `object` | Continental region of operation (Latin America, Europe, Asia Pacific, etc.). | Clean (0) |
| `country` | `object` | Home country of the collector (format: Country_XX). | Clean (0) |
| `founded_year` | `int64` | Year the organization was founded. | Clean (0) |
| `num_staff` | `int64` | Number of full-time staff members. | Clean (0) |
| `annual_collection_capacity_ton` | `float64` | Maximum annual waste collection capacity (Tons). | Clean (0) |
| `fleet_type` | `object` (Cat) | Type of fleet used (Mixed, Drone-Assisted, Manual, Vessel, Amphibious, Land Vehicle). | Clean (0) |
| `focus_area` | `object` (Cat) | Focus area of operations (Ocean Cleanup, River Remediation, E-Waste, Beach Cleanup, etc.). | Clean (0) |
| `certification` | `object` (Cat) | Certification held (ISO14001, FSC, ISO9001, B-Corp, LEED, None). | **Contains Nulls (3,007 rows)** |
| `funding_source` | `object` (Cat) | Primary funding source (Government Grant, NGO Fund, UN Program, Corporate Sponsorship, etc.). | Clean (0) |
| `avg_cost_per_ton_usd` | `float64` | Average operational cost per ton of waste collected (USD). | Clean (0) |
| `recycling_rate_pct` | `float64` | Percentage of waste successfully recycled (scale 0-100). | Clean (0) |
| `gps_tracking_enabled` | `bool` | Whether GPS tracking is enabled on the fleet (True/False). | Clean (0) |
| `partnership_count` | `int64` | Number of active external partnerships. | Clean (0) |
| `carbon_offset_ton_yr` | `float64` | Annual carbon offset generated (Tons/Year). | Clean (0) |
| `social_impact_score` | `float64` | Social impact score of the organization (scale 0-10). | Clean (0) |
| `is_active` | `bool` | Whether the collector is currently active (True/False). | Clean (0) |
| `last_audit_year` | `float64` | Year of the last internal/external audit. | **Contains Nulls (1,205 rows)** |

### 🔗 Merging Logic (Dataset 2 Pair)
* **Join Key:** `collector_id` (Integer)
* **Join Type:** `Inner Join`
* **Merged Output:** A joined table combining operational details of cleanup events with waste collector metrics.
* **AI Objective:** Model waste collection weight performance (`weight_collected_ton`) and forecast operational costs using collector profiles as main predictors.

---

## 📈 Pillar 3: Green Initiative Strategy & Impacts (Dataset 3)

This pillar connects environmental initiative projects with the budgets and focus areas of their organizing green institutions.

### 1. `dataset3_green_initiative_project.csv` (8,500 rows)
Tracks individual campaigns, bioplastic pilots, policy lobbying projects, etc.

| Column Name | Data Type | Description | Missing Value Status |
| :--- | :--- | :--- | :--- |
| `project_id` | `int64` | Unique ID of the green initiative project. | Clean (0) |
| `organization_id` | `int64` | ID of the responsible organization (Foreign Key to Organization). | Clean (0) |
| `lead_collector_id` | `int64` | ID of the lead collector on the ground. | Clean (0) |
| `project_name` | `object` | Project name (format: Initiative_XXXXX). | Clean (0) |
| `initiative_type` | `object` (Cat) | Type of initiative (Tech Innovation, Policy Lobbying, Cleanup Campaign, Recycling, etc.). | Clean (0) |
| `target_plastic_type` | `object` (Cat) | Target plastic category (Single-Use Plastics, Packaging, Microbeads, Fishing Gear, etc.). | Clean (0) |
| `geographic_scope` | `object` (Cat) | Geographic scope of the project (Ocean Basin, National, Global, Regional, Local). | Clean (0) |
| `start_date` | `object` (Date) | Project start date. | Clean (0) |
| `end_date` | `object` (Date) | Project end date. | Clean (0) |
| `project_status` | `object` (Cat) | Current project status (Completed, Active, Planning, Scaling, On Hold, Cancelled). | Clean (0) |
| `total_budget_usd` | `float64` | Total project budget (USD). | Clean (0) |
| `fund_source` | `object` (Cat) | Project funding source (Private Sector, Government, Crowdfunding, UN Grant, etc.). | Clean (0) |
| `partner_sector` | `object` (Cat) | Sector of the primary partner (Private, Civil Society, Academic, Multi-sector, Government, None). | **Contains Nulls (594 rows)** |
| `plastic_removed_ton` | `float64` | Total weight of plastic waste removed (Tons). | Clean (0) |
| `co2_equivalent_saved_ton` | `float64` | Estimated tons of CO2 equivalent emissions saved. | Clean (0) |
| `beneficiaries_reached` | `int64` | Number of direct/indirect beneficiaries reached. | Clean (0) |
| `impact_level` | `object` (Cat) | Classified impact level of the project (Low, Medium, High, Very High, Transformational). | Clean (0) |
| `media_coverage_count` | `int64` | Number of media coverages received by the project. | Clean (0) |
| `policy_outcome` | `object` (Cat) | Final policy outcome achieved (Minor Amendment, Major Bill Passed, Regulation Enacted, None, etc.). | **Contains Nulls (2,127 rows)** |
| `data_quality_flag` | `object` (Cat) | Data quality status (Estimated, Verified, Self-Reported, Incomplete, Audited). | Clean (0) |

### 2. `dataset3_organization.csv` (8,500 rows)
Profiles the green institutions organizing these environmental initiatives.

| Column Name | Data Type | Description | Missing Value Status |
| :--- | :--- | :--- | :--- |
| `organization_id` | `int64` | Unique ID of the organization (Primary Key). | Clean (0) |
| `organization_name` | `object` | Name of the organization (format: GreenOrg_XXXXX). | Clean (0) |
| `org_type` | `object` (Cat) | Type of organization (National Gov, University, UN Body, Local NGO, INGO, Social Enterprise, etc.). | Clean (0) |
| `mandate` | `object` (Cat) | Primary mandate of the organization (Sustainable Dev, Marine Conservation, Policy Reform, Climate Mitigation, etc.). | Clean (0) |
| `primary_sdg_focus` | `object` (Cat) | Main SDG focus of the organization (SDG15, SDG6, SDG13, SDG12, SDG14, SDG11, SDG17, SDG3). | Clean (0) |
| `continent` | `object` (Cat) | Continent of the headquarters (Americas, Asia, Europe, Africa, Oceania). | Clean (0) |
| `country_code` | `object` | Country code of the headquarters (format: CCXX). | Clean (0) |
| `founded_year` | `int64` | Year the organization was founded. | Clean (0) |
| `org_size_class` | `object` (Cat) | Scale class of the organization size (Micro, Small, Medium, Large, Enterprise). | Clean (0) |
| `annual_budget_usd` | `float64` | Annual operating budget of the organization (USD). | Clean (0) |
| `num_projects_active` | `int64` | Number of active environmental projects globally. | Clean (0) |
| `num_countries_operating` | `int64` | Number of countries with active operations. | Clean (0) |
| `has_un_consultative_status` | `bool` | Whether the organization holds consultative status with the UN (True/False). | Clean (0) |
| `transparency_rating` | `float64` | Financial transparency rating (scale 0-5). | Clean (0) |
| `media_presence_score` | `float64` | Media presence score across channels (scale 0-100). | Clean (0) |
| `co2_reduction_target_ton_yr` | `float64` | Target annual reduction of CO2 equivalent emissions (Tons/Year). | Clean (0) |
| `plastic_reduction_target_ton_yr` | `float64` | Target annual collection of plastic waste (Tons/Year). | Clean (0) |
| `policy_influence_score` | `float64` | Score indicating policy and political influence (scale 0-10). | Clean (0) |
| `is_accredited` | `bool` | Whether the organization is accredited by international bodies (True/False). | Clean (0) |
| `last_report_year` | `float64` | Year of the last public report. | **Contains Nulls (1,379 rows)** |

### 🔗 Merging Logic (Dataset 3 Pair)
* **Join Key:** `organization_id` (Integer)
* **Join Type:** `Inner Join`
* **Merged Output:** Combined table with project data joined with target and budget details of the organizing institutions.
* **AI Objective:** Build classification models for project success level (`impact_level`) and regulatory changes (`policy_outcome`).

---

## 🔎 Namespace Analysis

The three dataset groups have distinct namespaces and identifier structures:

1. **Countries & Geographical Fields:**
   * **Dataset 1:** Uses real country names (`Indonesia`, `India`, `Brazil`, etc.) but synthetic administrative regions (`Region_1`, `Region_16`).
   * **Dataset 2:** Uses synthetic country names (`Country_16`, `Country_43`) but real continental regions (`Latin America`, `Europe`).
   * **Dataset 3:** Uses synthetic country codes (`CC50`, `CC29`) and real continents (`Americas`, `Asia`, `Europe`).
2. **Collector Identifiers:**
   * The `collector_id` in Dataset 1 (Microplastics) does not match the `collector_id` in Dataset 2 (Waste Events). They represent different domains (scientific field staff vs waste operations contractors).
3. **Integration Strategy:**
   * Joining is done locally within each pair (1, 2, and 3) using their respective integer IDs.
   * Within the final application, global filters (such as `year` or continent/region classifications) will bind these three pillars together conceptually on the interactive dashboard.
