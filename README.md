<div align="center">

# 🌊 EcoShield AI
### Environmental Intelligence Platform

[![Python](https://img.shields.io/badge/Python-3.10+-3776AB?style=flat-square&logo=python&logoColor=white)](https://www.python.org/)
[![scikit-learn](https://img.shields.io/badge/scikit--learn-1.7.2-F7931E?style=flat-square&logo=scikitlearn&logoColor=white)](https://scikit-learn.org/)
[![XGBoost](https://img.shields.io/badge/XGBoost-3.2.0-189AB4?style=flat-square)](https://xgboost.readthedocs.io/)
[![Jupyter](https://img.shields.io/badge/Jupyter-Notebook-F37626?style=flat-square&logo=jupyter&logoColor=white)](https://jupyter.org/)
[![HTML](https://img.shields.io/badge/Dashboard-HTML%2FCSS%2FJS-E34F26?style=flat-square&logo=html5&logoColor=white)](dashboard/)

> A full-cycle data science & AI project for multi-dimensional environmental intelligence — integrating microplastic risk monitoring, waste cleanup analytics, and green policy impact assessment into a real-time interactive dashboard.

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Problem Statement](#-problem-statement)
- [Project Structure](#-project-structure)
- [Datasets](#-datasets)
- [Data Cleaning Process](#-data-cleaning-process)
- [Analysis Process](#-analysis-process)
- [Key Insights](#-key-insights)
- [Mathematical Foundations](#-mathematical-foundations)
- [Pipeline Phases](#-pipeline-phases)
- [Dashboard](#-dashboard)
- [Installation](#-installation)
- [Usage](#-usage)
- [Models](#-models)
- [SDGs Addressed](#-sdgs-addressed)

---

## 🌍 Overview

**EcoShield AI** is an end-to-end environmental data science platform built around three concurrent analytical pillars:

| Pillar | Domain | Model | Output |
|--------|--------|-------|--------|
| 🔬 **Pillar 1** | Microplastic Risk | Ridge Regression | Concentration (particles/L) |
| ♻️ **Pillar 2** | Waste Cleanup Yield | Ridge Regression | Weight collected (Metric Tons) |
| 🌿 **Pillar 3** | Green Policy Success | Logistic Regression | Success probability (%) |

The project follows a structured 5-phase data science workflow — from raw dataset ingestion to a fully interactive browser-based AI simulator — with **no backend server required** at runtime.

---

## ❗ Problem Statement

### The Environmental Crisis Behind the Data

Global plastic pollution has reached a critical threshold. Microplastics have been detected in every ocean, freshwater system, and even in human bloodstreams. Despite growing awareness, the environmental community faces three interconnected challenges that EcoShield AI is designed to address:

---

### 🔬 Problem 1 — Lack of Predictive Microplastic Risk Models

**Challenge:** Environmental scientists can measure microplastic concentrations at specific sampling sites, but cannot reliably **predict** contamination levels in unmeasured locations or under different environmental conditions.

**Impact:** Without predictive capability, remediation efforts are reactive rather than proactive. High-risk zones go undetected until they are already severely contaminated.

**EcoShield Solution:** A Ridge Regression model trained on physicochemical parameters (pH, turbidity, salinity, depth, temperature, biome type) to predict microplastic concentration (particles/L) at any given location and condition. This enables **early-warning environmental risk assessment**.

---

### ♻️ Problem 2 — Inefficient Waste Cleanup Resource Allocation

**Challenge:** Plastic waste cleanup campaigns are expensive and resource-intensive. Organizations struggle to estimate how much waste they can realistically collect before committing volunteers, equipment, and budget to a cleanup event.

**Impact:** Underestimation leads to wasted resources and incomplete cleanup. Overestimation leads to budget overruns and volunteer fatigue — reducing participation in future campaigns.

**EcoShield Solution:** A Ridge Regression model that predicts **waste collection yield (metric tons)** based on campaign parameters: number of volunteers, duration, volume capacity, operational cost, waste source type, and weather conditions. This enables data-driven campaign planning.

---

### 🌿 Problem 3 — Unpredictable Green Policy Outcomes

**Challenge:** Governments, NGOs, and international bodies invest millions of dollars in green initiatives (plastic bans, recycling infrastructure, awareness campaigns, bioplastic pilots), but the probability of achieving meaningful **policy influence** is difficult to quantify before commitment.

**Impact:** Without a predictive model, budget allocation to green initiatives is largely based on intuition rather than evidence — leading to underfunded high-impact programs and overfunded low-impact ones.

**EcoShield Solution:** A Logistic Regression classifier that predicts the **probability of policy success** (Minor Amendment, Major Bill Passed, or Regulation Enacted) based on initiative type, budget, geographic scope, media coverage, CO₂ reduction targets, and organizational characteristics.

---

## 📁 Project Structure

```
Microplastic & Go Green/
│
├── 📂 data/                           # Processed & cleaned datasets
│   ├── cleaned_microplastics.csv
│   ├── cleaned_waste_events.csv
│   ├── cleaned_green_initiatives.csv
│   └── processed/                     # Train/test feature splits
│       ├── X_train_micro.csv / X_test_micro.csv
│       ├── y_train_micro.csv / y_test_micro.csv
│       ├── X_train_waste.csv / X_test_waste.csv
│       ├── y_train_waste.csv / y_test_waste.csv
│       ├── X_train_green.csv / X_test_green.csv
│       └── y_train_green.csv / y_test_green.csv
│
├── 📂 notebooks/                      # Jupyter notebooks (phases 1–4)
│   ├── 1_data_cleaning_and_joining.ipynb
│   ├── 2_data_exploration.ipynb
│   ├── 3_feature_engineering.ipynb
│   └── 4_predictive_modeling.ipynb
│
├── 📂 models/                         # Serialized model artifacts
│   ├── model_micro.pkl                # Pillar 1: Ridge Regression
│   ├── model_waste.pkl                # Pillar 2: Ridge Regression
│   ├── model_green.pkl                # Pillar 3: Logistic Regression
│   ├── scaler_micro/waste/green.pkl   # StandardScaler per pillar
│   └── encoder_micro/waste/green.pkl  # OneHotEncoder per pillar
│
├── 📂 dashboard/                      # Phase 5: Interactive web dashboard
│   ├── index.html
│   ├── style.css
│   ├── app.js
│   └── data/                          # Auto-generated JSON summaries
│       ├── microplastics_summary.json
│       ├── waste_summary.json
│       ├── green_summary.json
│       └── models_metadata.json
│
├── 📂 docs/                           # Dataset documentation & analysis notes
│
├── dataset1_microplastic_sample.csv   # Raw — microplastic samples
├── dataset1_sampling_location.csv     # Raw — sampling locations
├── dataset2_plastic_waste_event.csv   # Raw — waste cleanup events
├── dataset2_waste_collector.csv       # Raw — collector organizations
├── dataset3_green_initiative_project.csv  # Raw — green projects
├── dataset3_organization.csv          # Raw — NGOs & organizations
│
├── requirements.txt
├── .gitignore
└── README.md
```

---

## 🗂️ Datasets

The project uses **6 raw CSV datasets** across 3 environmental domains:

### Pillar 1 — Microplastics (2 files joined)
- **`dataset1_microplastic_sample.csv`** — Physical & chemical sample measurements: concentration (particles/L), pH, turbidity (NTU), salinity (PPT), depth (m), temperature (°C), plastic type, shape, size class, biome, season, collection method, lab analysis method
- **`dataset1_sampling_location.csv`** — Geographic metadata: coordinates, location type (Coastal/River/Lake/Open Ocean/Estuary), water body type, urbanization level, annual rainfall (mm), biodiversity score, area (km²), distance to coast (km), elevation (m)

### Pillar 2 — Plastic Waste Events (2 files joined)
- **`dataset2_plastic_waste_event.csv`** — Cleanup event records: waste source, weight collected (ton), volume (m³), duration (hours), cost (USD), number of volunteers, microplastic fraction (%), weather condition, plastic grade, disposal mode, transport mode
- **`dataset2_waste_collector.csv`** — Collector org details: region, fleet type, annual collection capacity (ton), recycling rate (%), carbon offset (ton/yr), social impact score, partnership count, focus area, funding source, certification

### Pillar 3 — Green Initiatives (2 files joined)
- **`dataset3_green_initiative_project.csv`** — Initiative data: type (10 categories), total budget (USD), CO₂ savings (ton), plastic removed (ton), beneficiaries reached, media coverage count, policy outcome, SDG focus, geographic scope, partner sector, duration (days)
- **`dataset3_organization.csv`** — Organization profiles: type, size class, continent, mandate, transparency rating, media presence score, number of active projects, countries operating in, CO₂ and plastic reduction targets

---

## 🧹 Data Cleaning Process

Data cleaning was executed in **`1_data_cleaning_and_joining.ipynb`** and followed a systematic multi-step approach for each pillar.

### Step 1 — Dataset Joining

Each pillar merges two related tables via a shared primary key:

```python
# Pillar 1: Join microplastic samples with location metadata
df_micro = pd.merge(
    df_sample,           # microplastic_sample.csv
    df_location,         # sampling_location.csv
    on='location_id',
    how='inner'
)

# Pillar 2: Join waste events with collector organization data
df_waste = pd.merge(
    df_event,            # plastic_waste_event.csv
    df_collector,        # waste_collector.csv
    on='collector_id',
    how='inner'
)

# Pillar 3: Join green project data with organization profiles
df_green = pd.merge(
    df_project,          # green_initiative_project.csv
    df_org,              # organization.csv
    on='org_id',
    how='inner'
)
```

**Join type rationale:** `inner` join was used to retain only records with complete linkage across both tables, preventing NaN pollution from unmatched rows.

---

### Step 2 — Duplicate Removal

```python
df.drop_duplicates(inplace=True)
```

Exact row duplicates are dropped first, before any transformation, to avoid amplifying bias from repeated records.

---

### Step 3 — Missing Value Handling

Missing values were handled differently by column type and domain significance:

| Strategy | Applied To | Rationale |
|----------|-----------|-----------|
| **Median imputation** | Numerical columns (concentration, pH, depth, cost) | Robust to outliers; preserves distribution shape |
| **Mode imputation** | Low-cardinality categorical columns (season, plastic_grade) | Fills with the most representative category |
| **Drop rows** | Rows missing the target variable | Cannot train or evaluate without ground truth |

```python
# Numerical: fill with column median
for col in num_cols:
    df[col].fillna(df[col].median(), inplace=True)

# Categorical: fill with column mode
for col in cat_cols:
    df[col].fillna(df[col].mode()[0], inplace=True)
```

---

### Step 4 — Outlier Detection & Capping

Outliers in numerical columns were identified using the **Interquartile Range (IQR)** method and capped at the boundary values rather than dropped, to preserve sample size:

```python
Q1  = df[col].quantile(0.25)
Q3  = df[col].quantile(0.75)
IQR = Q3 - Q1

lower_bound = Q1 - 1.5 * IQR
upper_bound = Q3 + 1.5 * IQR

df[col] = df[col].clip(lower=lower_bound, upper=upper_bound)
```

**IQR Formula:**

```
IQR = Q3 - Q1
Lower Fence = Q1 - 1.5 × IQR
Upper Fence = Q3 + 1.5 × IQR
```

Values outside the fence are **clipped** (Winsorized) rather than deleted to retain row count.

---

### Step 5 — Column Name Standardization

All column names were normalized to lowercase snake_case, removing special characters and spaces to ensure compatibility with pandas, scikit-learn, and XGBoost:

```python
df.columns = (
    df.columns
    .str.strip()
    .str.lower()
    .str.replace(r'[\s\-\/\(\)]+', '_', regex=True)
    .str.replace(r'[^\w]', '', regex=True)
)
```

---

### Step 6 — Data Type Enforcement

```python
# Parse date fields into datetime, then decompose
df['date'] = pd.to_datetime(df['date'], errors='coerce')
df['year']        = df['date'].dt.year
df['month']       = df['date'].dt.month
df['day_of_week'] = df['date'].dt.dayofweek
```

All target columns were verified to be numeric. Categorical columns were confirmed as `object` dtype before encoding.

---

### Cleaning Summary

| Pillar | Raw Rows (joined) | After Cleaning | Features Retained |
|--------|-------------------|----------------|-------------------|
| Microplastics | ~10,000 | ~10,000 | 28 |
| Waste Events | ~10,000 | ~10,000 | 27 |
| Green Initiatives | ~9,000 | ~9,000 | 27 |

---

## 🔍 Analysis Process

The analysis followed a **bottom-up approach**: start with raw data understanding, then progressively move toward abstraction and prediction.

### Step 1 — Univariate Distribution Analysis

Each numerical feature was examined independently using histograms and box plots to understand:
- Central tendency (mean vs. median)
- Spread (standard deviation, IQR)
- Skewness — critical for identifying log transformation candidates
- Presence of extreme values

```python
df['concentration_particles_per_l'].describe()
df['concentration_particles_per_l'].skplot()  # Shapiro-Wilk test for normality
```

> **Finding:** All three target variables (`concentration_particles_per_l`, `weight_collected_ton`, and policy outcome scores) showed **strong right skew**, justifying log transformation.

---

### Step 2 — Bivariate & Categorical Analysis

Relationships between features and target variables were examined via:

- **Group-by aggregations:** Mean concentration per biome, season, location type, and plastic type
- **Cross-tabulations:** Policy outcome rates by initiative type, geographic scope, and organizational mandate
- **Scatter plots:** Depth vs. concentration, cost vs. weight, budget vs. CO₂ savings

```python
# Example: Average microplastic concentration by biome
df_micro.groupby('biome')['concentration_particles_per_l'].mean().sort_values(ascending=False)
```

---

### Step 3 — Correlation Analysis

A **Pearson correlation matrix** was computed across all numerical features for Pillar 1 to identify multicollinearity and feature relevance:

```python
corr_cols = ['ph_level', 'turbidity_ntu', 'salinity_ppt',
             'avg_temperature_c', 'annual_rainfall_mm',
             'depth_m', 'concentration_particles_per_l']

corr_matrix = df_micro[corr_cols].corr(method='pearson')
```

The **Pearson correlation coefficient** between variables X and Y is:

```
        Σ[(xᵢ - x̄)(yᵢ - ȳ)]
r = ─────────────────────────────
    √[Σ(xᵢ - x̄)²] × √[Σ(yᵢ - ȳ)²]

Range: -1 (perfect negative) to +1 (perfect positive)
```

---

### Step 4 — Feature Engineering & Transformation

Before modeling, all features were transformed:

1. **Log transformation** on skewed targets
2. **Standard scaling** on numerical inputs
3. **One-hot encoding** on categorical inputs
4. **Train/test split** (80:20 stratified for classification, random for regression)

---

### Step 5 — Predictive Modeling & Evaluation

Three separate pipelines were trained and evaluated:

```
Preprocessed Features (X) → [StandardScaler + OneHotEncoder] → Model → Predictions (ŷ)
```

Regression models (Pillars 1 & 2) were evaluated with RMSE and R². The classification model (Pillar 3) was evaluated with accuracy, F1-score, and a confusion matrix.

---

## 💡 Key Insights

### 🔬 Pillar 1 — Microplastic Risk

| Insight | Finding |
|---------|---------|
| **Highest-risk biome** | Coastal zones consistently show the highest average microplastic concentration, followed by estuaries |
| **Seasonality effect** | Summer months show significantly elevated concentrations, likely due to increased human activity and runoff |
| **Depth paradox** | Contrary to intuition, shallow water samples (0–10 m) show higher concentrations than deep ocean samples — indicating surface accumulation |
| **Location type** | Urban coastal and river mouth locations show 2–3× higher concentrations than remote open-ocean sites |
| **Top plastic type** | Polyethylene (PE) fragments dominate across all biome types, consistent with global packaging waste patterns |
| **Pollution index** | Strong positive correlation (r ≈ +0.6) between the pollution index and concentration — confirming it as the most predictive single feature |
| **pH & turbidity** | Mild positive correlation with concentration; high turbidity environments (NTU > 50) tend to co-occur with elevated microplastic loads |

---

### ♻️ Pillar 2 — Waste Cleanup

| Insight | Finding |
|---------|---------|
| **Volunteer scaling** | Yield increases non-linearly with volunteer count: groups of 100–200 are the most efficient per-capita; very large groups (500+) show diminishing returns |
| **Top waste sources** | Beach debris and urban runoff account for the highest cumulative tonnage collected |
| **Weather impact** | Clear and overcast conditions yield approximately 15–20% more waste than rainy conditions, indicating weather is a meaningful planning factor |
| **Cost efficiency** | Campaigns in the USD 500–2,000 range show the best cost-per-ton ratios — beyond USD 5,000, marginal returns flatten significantly |
| **Duration sweet spot** | Events lasting 4–8 hours yield the most waste; campaigns exceeding 12 hours show a plateau, likely due to fatigue |
| **Microplastic fraction** | Beach cleanup events carry a 12–18% average microplastic fraction by weight — significantly higher than river events (~7%) |

---

### 🌿 Pillar 3 — Green Initiatives

| Insight | Finding |
|---------|---------|
| **Overall success rate** | Approximately 46% of initiatives resulted in meaningful policy change (Minor Amendment, Major Bill Passed, or Regulation Enacted) |
| **Most impactful type** | "Awareness Campaign" initiatives show the highest average CO₂ savings per dollar spent despite not being the highest-budget category |
| **Budget vs. success** | There is a weak positive correlation between budget and success rate — but diminishing returns above USD 200,000 |
| **Geographic scope** | Local and ocean-basin scoped initiatives slightly outperform global ones in success rate — potentially due to more targeted stakeholder engagement |
| **SDG coverage** | SDG 12 (Responsible Consumption) and SDG 14 (Life Below Water) are the most frequently targeted goals across all initiative types |
| **Recycling Infrastructure** | Has the highest average budget (USD 234K) but relatively modest policy success rates — suggesting high cost without proportional outcome |
| **Media coverage** | Initiatives with >20 media coverage events are 1.4× more likely to achieve policy success, highlighting the importance of public visibility |

---

## 📐 Mathematical Foundations

### 1. Log Transformation (Target Normalization)

Both regression targets (`concentration_particles_per_l` and `weight_collected_ton`) are heavily right-skewed. The **log1p transform** compresses the scale, stabilizes variance, and makes distributions more Gaussian:

```
y_transformed = log(y + 1)    [applied before training]

ŷ_original    = exp(ŷ_transformed) − 1    [inverse applied after prediction]
```

Using `log1p` (log of 1 + x) instead of `log(x)` safely handles zero values without undefined outputs.

---

### 2. Standard Scaling (Feature Normalization)

All numerical input features are standardized to zero mean and unit variance using **StandardScaler**:

```
         xᵢ − μ
z_i  =  ────────
           σ

where:
  xᵢ  = original feature value
  μ   = column mean (computed on training set only)
  σ   = column standard deviation (computed on training set only)
  z_i = standardized value
```

This ensures all features contribute equally to the model regardless of their original scale (e.g., pH ∈ [4, 10] vs. rainfall ∈ [0, 3000] mm).

---

### 3. One-Hot Encoding (Categorical Representation)

Categorical features (plastic type, biome, waste source, initiative type, etc.) are converted into binary indicator vectors:

```
plastic_type = "PE"  →  [1, 0, 0, 0, 0, 0]
plastic_type = "PP"  →  [0, 1, 0, 0, 0, 0]
plastic_type = "PET" →  [0, 0, 1, 0, 0, 0]
```

For a categorical column with `k` unique values, `k` binary columns are created. **drop='first'** is not applied to preserve full interpretability in coefficient analysis.

---

### 4. Ridge Regression (Pillars 1 & 2)

Ridge Regression minimizes the **Residual Sum of Squares** with an L2 regularization penalty to prevent overfitting on high-dimensional one-hot encoded feature spaces:

```
         n                           p
Loss = Σ (yᵢ − ŷᵢ)²  +  λ × Σ βⱼ²
        i=1                         j=1

Analytical solution:   β = (XᵀX + λI)⁻¹ Xᵀy

where:
  yᵢ  = actual target value (log-transformed)
  ŷᵢ  = predicted value
  βⱼ  = model coefficient for feature j
  λ   = regularization strength (alpha=1.0)
  I   = identity matrix
  p   = total number of features
```

The L2 penalty shrinks large coefficients toward zero, reducing model variance without performing feature selection (unlike L1/Lasso).

**Prediction (inference):**
```
ŷ = β₀ + β₁x₁ + β₂x₂ + ... + βₚxₚ

Final output = exp(ŷ) − 1    [inverse of log1p]
```

---

### 5. Logistic Regression (Pillar 3)

Binary classification of policy outcome (success = 1 vs. no change = 0) uses **Logistic Regression**, which models the probability of success via the sigmoid function:

```
              1
P(y=1|x) = ──────────
            1 + e^(−z)

where:
  z = β₀ + β₁x₁ + β₂x₂ + ... + βₚxₚ    (linear combination)
  e = Euler's number (≈ 2.71828)
```

The model is trained by minimizing **Binary Cross-Entropy Loss** (Log Loss):

```
         1   n
Loss = − ─ Σ [yᵢ log(P̂ᵢ) + (1 − yᵢ) log(1 − P̂ᵢ)]
         n  i=1

where:
  yᵢ  = actual binary label (0 or 1)
  P̂ᵢ  = predicted probability of success
```

The decision threshold is **P ≥ 0.5 → predicted success (1)**.

---

### 6. Model Evaluation Metrics

**For Ridge Regression (Pillars 1 & 2):**

```
        1   n
RMSE = √─ Σ (yᵢ − ŷᵢ)²      [Root Mean Squared Error — in original units after exp]
        n  i=1

       Σ(yᵢ − ŷᵢ)²
R²  = 1 − ─────────────        [Coefficient of Determination; 1.0 = perfect fit]
       Σ(yᵢ − ȳ)²
```

**For Logistic Regression (Pillar 3):**

```
             TP + TN
Accuracy = ───────────────
            TP + TN + FP + FN

              2 × Precision × Recall
F1-Score = ─────────────────────────
              Precision + Recall

where:
  TP = True Positives   (correctly predicted success)
  TN = True Negatives   (correctly predicted no change)
  FP = False Positives  (predicted success, actually no change)
  FN = False Negatives  (predicted no change, actually success)
```

---

### 7. Client-Side Inference (Dashboard AI Simulator)

The dashboard replicates scikit-learn inference entirely in JavaScript without a backend:

```javascript
// Step 1: Standardize numeric input
z_i = (x_i - mean_i) / scale_i

// Step 2: One-hot encode categorical input
// [1, 0, 0] for selected category, [0, ...] for others

// Step 3: Compute linear score
score = intercept + Σ(coefficient_j × feature_j)

// Step 4a: Regression output (inverse log1p)
prediction = Math.exp(score) - 1

// Step 4b: Classification output (sigmoid)
probability = 1 / (1 + Math.exp(-score))
```

Model coefficients, intercepts, scaler means/scales, and encoder categories are all exported from Python to `models_metadata.json` after training.

---

## 🔄 Pipeline Phases

### Phase 1 — Data Cleaning & Joining
**Notebook:** [`1_data_cleaning_and_joining.ipynb`](notebooks/1_data_cleaning_and_joining.ipynb)
- Inner join on primary keys across paired datasets
- Median/mode imputation for missing values
- IQR-based outlier capping (Winsorization)
- Column name normalization to snake_case
- Date parsing and temporal decomposition
- Exported 3 unified cleaned CSVs to `data/`

### Phase 2 — Exploratory Data Analysis (EDA)
**Notebook:** [`2_data_exploration.ipynb`](notebooks/2_data_exploration.ipynb)
- Univariate distribution histograms and box plots for all features
- Pearson correlation heatmap for physicochemical parameters
- Category breakdown charts: biome, season, plastic type, waste source, SDG
- Scatter plot analysis: depth vs. concentration, cost vs. yield, budget vs. CO₂
- Key insight extraction and annotation per pillar

### Phase 3 — Feature Engineering
**Notebook:** [`3_feature_engineering.ipynb`](notebooks/3_feature_engineering.ipynb)
- `log1p` target transformation for skewed regression outputs
- `StandardScaler` for numerical features (fit on train, applied to both)
- `OneHotEncoder` for categorical features
- Column name sanitization for XGBoost compatibility
- 80/20 stratified train/test split, exported to `data/processed/`

### Phase 4 — Predictive Modeling
**Notebook:** [`4_predictive_modeling.ipynb`](notebooks/4_predictive_modeling.ipynb)
- **Pillar 1:** Ridge Regression (`alpha=1.0`) — microplastic concentration
- **Pillar 2:** Ridge Regression (`alpha=1.0`) — waste cleanup yield
- **Pillar 3:** Logistic Regression (`max_iter=500`) — policy success classifier
- XGBoost trained as benchmark comparison for all three pillars
- Evaluation: RMSE, R², Accuracy, F1-Score, Confusion Matrix
- Serialized 9 artifacts (`model_*.pkl`, `scaler_*.pkl`, `encoder_*.pkl`) to `models/`

### Phase 5 — Interactive Dashboard
**Location:** [`dashboard/`](dashboard/)
- Fully client-side HTML5 / CSS3 / vanilla JavaScript application
- 12+ interactive Chart.js visualizations across 5 tabs
- Real-time Ridge/Logistic inference engine running in the browser
- Feature importance bars, prediction log timeline, live activity feed
- No Python runtime required after data generation — served via `python -m http.server`

---

## 📊 Dashboard

The dashboard at `dashboard/index.html` features **5 tabs** with **12+ charts**:

| Tab | Charts |
|-----|--------|
| **Overview** | SDG Alignment Radar, SDG Coverage Bar, Live Activity Feed, 6 KPI cards |
| **Microplastic Risk** | Biome Bar, Plastic Type Polar, Location Radar, Seasonality Bar, Depth Scatter, Correlation Heatmap |
| **Waste Cleanup** | Source Horizontal Bar, Grade Doughnut, Weather Radar, Volunteer Efficiency Line, Cost Scatter |
| **Green Initiatives** | Geo Success Dual-axis Bar, Policy Outcomes Doughnut, SDG Coverage Bar, Budget vs Efficiency Bar |
| **AI Simulator** | Real-time gauge, Feature importance bars, Prediction log timeline |

### Running the Dashboard

```bash
# From the project root directory
python -m http.server --directory dashboard 8000
```

Then open **[http://localhost:8000](http://localhost:8000)** in your browser.

> 💡 The dashboard reads pre-generated JSON files from `dashboard/data/`. If models are retrained, re-run `generate_dashboard_data.py` to refresh coefficients and summaries.

---

## ⚙️ Installation

### 1. Clone or download the project

```bash
git clone <repository-url>
cd "Microplastic & Go Green"
```

### 2. Create a virtual environment

```bash
python -m venv .venv

# Windows
.venv\Scripts\activate

# macOS / Linux
source .venv/bin/activate
```

### 3. Install dependencies

```bash
pip install -r requirements.txt
```

### 4. Launch Jupyter

```bash
jupyter notebook
```

---

## 🚀 Usage

Run notebooks in sequential order:

```
1_data_cleaning_and_joining.ipynb   →  Produces: data/cleaned_*.csv
2_data_exploration.ipynb            →  Produces: EDA visualizations
3_feature_engineering.ipynb         →  Produces: data/processed/X_train_*.csv, y_train_*.csv
4_predictive_modeling.ipynb         →  Produces: models/*.pkl
```

After Phase 4, regenerate dashboard data:

```bash
python generate_dashboard_data.py
```

Then start the dashboard server:

```bash
python -m http.server --directory dashboard 8000
```

---

## 🤖 Models

| Model | Algorithm | Target Variable | Transform | Evaluation |
|-------|-----------|-----------------|-----------|------------|
| `model_micro.pkl` | Ridge Regression (`α=1.0`) | `concentration_particles_per_l` | `log1p` | RMSE, R² |
| `model_waste.pkl` | Ridge Regression (`α=1.0`) | `weight_collected_ton` | `log1p` | RMSE, R² |
| `model_green.pkl` | Logistic Regression | `policy_outcome` (binary) | None | Accuracy, F1 |

The dashboard performs **client-side inference** by reading exported coefficients from `models_metadata.json` and manually computing the linear combination in JavaScript — no Python backend is needed at runtime.

---

## 🎯 SDGs Addressed

| SDG | Goal | Pillar |
|-----|------|--------|
| **SDG 6** | Clean Water and Sanitation | Pillar 1 |
| **SDG 11** | Sustainable Cities and Communities | Pillars 2, 3 |
| **SDG 12** | Responsible Consumption & Production | Pillars 1, 2, 3 |
| **SDG 13** | Climate Action | Pillars 2, 3 |
| **SDG 14** | Life Below Water | Pillars 1, 2 |
| **SDG 15** | Life on Land | Pillars 2, 3 |

---

## Dashboards Screenshot
### Environmental Intelligence Overview
![alt text](<Screenshot 2026-06-12 145432.png>)

### Microplastic Risk Analysis
![alt text](<Screenshot 2026-06-12 145459-1.png>)

### Waste Cleanup Intelligence
![alt text](<Screenshot 2026-06-12 145530.png>)

### Green Initiatives
![alt text](<Screenshot 2026-06-12 145551.png>)

### EcoShield AI Prediction Playground
![alt text](<Screenshot 2026-06-12 145631.png>)

---

<div align="center">

Built with 💚 for environmental intelligence · EcoShield AI Platform

</div>
