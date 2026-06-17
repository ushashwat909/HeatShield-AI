"""XGBoost model for temperature prediction."""
import numpy as np

try:
    import xgboost as xgb
    HAS_XGBOOST = True
except ImportError:
    HAS_XGBOOST = False


class XGBoostPredictor:
    """
    XGBoost-based temperature prediction model.
    
    Features:
        - NDVI, NDBI, LST, Population Density, Building Density
        - Month, Hour, Wind Speed, Humidity
    
    Output:
        - Predicted future temperature
        - Confidence interval
    """

    def __init__(self):
        self.model = None
        self.is_trained = False
        self.feature_names = [
            "ndvi", "ndbi", "current_lst", "population_density",
            "building_density", "month", "wind_speed", "humidity"
        ]

    def generate_synthetic_data(self, n_samples=2000):
        """Generate synthetic temperature prediction training data."""
        np.random.seed(43)

        ndvi = np.random.uniform(0.01, 0.80, n_samples)
        ndbi = np.random.uniform(0.05, 0.90, n_samples)
        current_lst = np.random.uniform(25, 52, n_samples)
        pop_density = np.random.uniform(1000, 40000, n_samples)
        building_density = np.random.uniform(0.1, 0.95, n_samples)
        month = np.random.randint(1, 13, n_samples)
        wind_speed = np.random.uniform(1, 20, n_samples)
        humidity = np.random.uniform(15, 80, n_samples)

        X = np.column_stack([
            ndvi, ndbi, current_lst, pop_density,
            building_density, month, wind_speed, humidity,
        ])

        # Future temperature model
        seasonal = np.sin((month - 3) * np.pi / 6) * 8  # Peak in June
        future_temp = (
            current_lst * 0.85
            + seasonal
            - 5 * ndvi
            + 3 * ndbi
            - 0.15 * wind_speed
            + 0.05 * humidity
            + np.random.normal(0, 2, n_samples)
        )

        return X, future_temp

    def train(self, X=None, y=None):
        """Train the XGBoost model."""
        if not HAS_XGBOOST:
            print("XGBoost not installed. Using fallback predictions.")
            self.is_trained = True
            return {"status": "fallback_mode", "reason": "xgboost not installed"}

        if X is None or y is None:
            X, y = self.generate_synthetic_data()

        dtrain = xgb.DMatrix(X, label=y, feature_names=self.feature_names)

        params = {
            "objective": "reg:squarederror",
            "max_depth": 8,
            "eta": 0.1,
            "subsample": 0.8,
            "colsample_bytree": 0.8,
            "eval_metric": "rmse",
        }

        self.model = xgb.train(params, dtrain, num_boost_round=100)
        self.is_trained = True

        return {"status": "trained", "num_trees": 100}

    def predict(self, features: dict) -> dict:
        """Predict future temperature."""
        if not self.is_trained:
            self.train()

        if not HAS_XGBOOST or self.model is None:
            # Fallback prediction
            base = features.get("current_lst", 42)
            return {
                "predicted_temperature": round(base + np.random.uniform(-2, 3), 1),
                "confidence_lower": round(base - 2, 1),
                "confidence_upper": round(base + 4, 1),
                "model": "fallback",
            }

        X = np.array([[
            features.get("ndvi", 0.2),
            features.get("ndbi", 0.5),
            features.get("current_lst", 42),
            features.get("population_density", 15000),
            features.get("building_density", 0.5),
            features.get("month", 6),
            features.get("wind_speed", 5),
            features.get("humidity", 40),
        ]])

        dtest = xgb.DMatrix(X, feature_names=self.feature_names)
        pred = float(self.model.predict(dtest)[0])

        return {
            "predicted_temperature": round(pred, 1),
            "confidence_lower": round(pred - 1.5, 1),
            "confidence_upper": round(pred + 1.5, 1),
            "model": "xgboost",
        }
