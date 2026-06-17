-- ═══════════════════════════════════════════════════════════
-- HeatShield AI — Database Schema (PostgreSQL + PostGIS)
-- ═══════════════════════════════════════════════════════════

CREATE EXTENSION IF NOT EXISTS postgis;

-- ─── Users ──────────────────────────────────────────────

CREATE TABLE users (
    id              SERIAL PRIMARY KEY,
    username        VARCHAR(100) UNIQUE NOT NULL,
    email           VARCHAR(255) UNIQUE NOT NULL,
    password_hash   VARCHAR(255) NOT NULL,
    full_name       VARCHAR(255),
    role            VARCHAR(50) DEFAULT 'public_user'
                    CHECK (role IN ('admin', 'researcher', 'government_official', 'public_user')),
    is_active       BOOLEAN DEFAULT TRUE,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ─── Cities ─────────────────────────────────────────────

CREATE TABLE cities (
    id              SERIAL PRIMARY KEY,
    name            VARCHAR(200) NOT NULL,
    state           VARCHAR(200),
    country         VARCHAR(100) DEFAULT 'India',
    latitude        DOUBLE PRECISION NOT NULL,
    longitude       DOUBLE PRECISION NOT NULL,
    population      INTEGER,
    area_sqkm       DOUBLE PRECISION,
    geometry        GEOMETRY(Polygon, 4326),
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_cities_name ON cities(name);
CREATE INDEX idx_cities_geometry ON cities USING GIST(geometry);

-- ─── Regions ────────────────────────────────────────────

CREATE TABLE regions (
    id              SERIAL PRIMARY KEY,
    city_id         INTEGER NOT NULL REFERENCES cities(id) ON DELETE CASCADE,
    name            VARCHAR(200) NOT NULL,
    ward_number     VARCHAR(50),
    area_sqkm       DOUBLE PRECISION,
    latitude        DOUBLE PRECISION,
    longitude       DOUBLE PRECISION,
    geometry        GEOMETRY(Polygon, 4326),
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_regions_city ON regions(city_id);
CREATE INDEX idx_regions_geometry ON regions USING GIST(geometry);

-- ─── Heat Measurements ─────────────────────────────────

CREATE TABLE heat_measurements (
    id                  SERIAL PRIMARY KEY,
    region_id           INTEGER NOT NULL REFERENCES regions(id) ON DELETE CASCADE,
    timestamp           TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    land_surface_temp   DOUBLE PRECISION,
    air_temperature     DOUBLE PRECISION,
    ndvi                DOUBLE PRECISION,
    ndbi                DOUBLE PRECISION,
    humidity            DOUBLE PRECISION,
    wind_speed          DOUBLE PRECISION,
    heat_index          DOUBLE PRECISION,
    risk_level          VARCHAR(50),
    data_source         VARCHAR(100)
);

CREATE INDEX idx_heat_region ON heat_measurements(region_id);
CREATE INDEX idx_heat_timestamp ON heat_measurements(timestamp);

-- ─── Predictions ────────────────────────────────────────

CREATE TABLE predictions (
    id                  SERIAL PRIMARY KEY,
    region_id           INTEGER NOT NULL REFERENCES regions(id) ON DELETE CASCADE,
    prediction_date     TIMESTAMP NOT NULL,
    predicted_temp      DOUBLE PRECISION NOT NULL,
    predicted_risk_level VARCHAR(50),
    confidence          DOUBLE PRECISION,
    horizon_days        INTEGER NOT NULL,
    model_used          VARCHAR(100),
    created_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_pred_region ON predictions(region_id);
CREATE INDEX idx_pred_date ON predictions(prediction_date);

-- ─── Recommendations ────────────────────────────────────

CREATE TABLE recommendations (
    id                      SERIAL PRIMARY KEY,
    region_id               INTEGER NOT NULL REFERENCES regions(id) ON DELETE CASCADE,
    category                VARCHAR(100) NOT NULL,
    title                   VARCHAR(300) NOT NULL,
    description             TEXT NOT NULL,
    expected_temp_reduction DOUBLE PRECISION,
    energy_savings_kwh      DOUBLE PRECISION,
    estimated_cost_inr      DOUBLE PRECISION,
    priority_score          DOUBLE PRECISION,
    implementation_timeline VARCHAR(100),
    created_at              TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_rec_region ON recommendations(region_id);

-- ─── Simulations ────────────────────────────────────────

CREATE TABLE simulations (
    id                      SERIAL PRIMARY KEY,
    region_id               INTEGER REFERENCES regions(id),
    trees_added             INTEGER DEFAULT 0,
    cool_roof_coverage_pct  DOUBLE PRECISION DEFAULT 0,
    green_roof_coverage_pct DOUBLE PRECISION DEFAULT 0,
    reflective_pavement_pct DOUBLE PRECISION DEFAULT 0,
    baseline_temp           DOUBLE PRECISION,
    simulated_temp          DOUBLE PRECISION,
    temp_reduction          DOUBLE PRECISION,
    energy_savings_kwh      DOUBLE PRECISION,
    carbon_reduction_tons   DOUBLE PRECISION,
    created_at              TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ─── Seed Data ──────────────────────────────────────────

INSERT INTO cities (name, state, latitude, longitude, population, area_sqkm)
VALUES ('Delhi', 'NCT', 28.6139, 77.2090, 32941000, 1483);

INSERT INTO regions (city_id, name, ward_number, latitude, longitude, area_sqkm) VALUES
    (1, 'Connaught Place', 'W-01', 28.6315, 77.2167, 3.2),
    (1, 'Chandni Chowk', 'W-02', 28.6506, 77.2334, 2.8),
    (1, 'Karol Bagh', 'W-03', 28.6519, 77.1907, 4.1),
    (1, 'Saket', 'W-04', 28.5244, 77.2066, 8.5),
    (1, 'Dwarka', 'W-05', 28.5823, 77.0500, 56.0),
    (1, 'Nehru Place', 'W-06', 28.5491, 77.2533, 3.0),
    (1, 'Lajpat Nagar', 'W-07', 28.5677, 77.2433, 2.5),
    (1, 'Rohini', 'W-08', 28.7321, 77.1199, 23.0),
    (1, 'Janakpuri', 'W-09', 28.6219, 77.0878, 12.0),
    (1, 'Mayur Vihar', 'W-10', 28.5937, 77.2973, 6.0),
    (1, 'Pitampura', 'W-11', 28.7019, 77.1316, 8.0),
    (1, 'Anand Vihar', 'W-12', 28.6469, 77.3164, 5.0),
    (1, 'Shahdara', 'W-13', 28.6741, 77.2894, 15.0),
    (1, 'Okhla Industrial', 'W-14', 28.5307, 77.2713, 10.0),
    (1, 'Narela', 'W-15', 28.8526, 77.0929, 45.0),
    (1, 'India Gate', 'W-16', 28.6129, 77.2295, 4.0),
    (1, 'Lodhi Garden Area', 'W-17', 28.5931, 77.2197, 3.5),
    (1, 'ITO', 'W-18', 28.6281, 77.2428, 2.0),
    (1, 'Noida Border', 'W-19', 28.5706, 77.3273, 7.0),
    (1, 'Mundka Industrial', 'W-20', 28.6839, 77.0293, 18.0);
