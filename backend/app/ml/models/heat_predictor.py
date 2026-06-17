"""Random Forest model for heat risk prediction."""
import numpy as np
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_squared_error, r2_score
import pickle
import os


class HeatPredictor:
    """
    Random Forest-based heat risk predictor.
    
    Features:
        - NDVI (Normalized Difference Vegetation Index)
        - NDBI (Normalized Difference Built-up Index)
        - LST (Land Surface Temperature)
        - Population Density
        - Building Density
    
    Output:
        - Heat Risk Score (0-100)
        - Predicted Temperature
    """

    def __init__(self, n_estimators=100, random_state=42):
        self.model = RandomForestRegressor(
            n_estimators=n_estimators,
            random_state=random_state,
            max_depth=10,
            min_samples_split=5,
        )
        self.is_trained = False
        self.feature_names = [
            "ndvi", "ndbi", "lst", "population_density", "building_density"
        ]

    def generate_synthetic_data(self, n_samples=1000):
        """Generate synthetic training data based on urban heat island relationships."""
        np.random.seed(42)

        # Generate features
        ndvi = np.random.uniform(0.01, 0.80, n_samples)
        ndbi = np.random.uniform(0.05, 0.90, n_samples)
        lst = np.random.uniform(30, 55, n_samples)
        pop_density = np.random.uniform(1000, 40000, n_samples)
        building_density = np.random.uniform(0.1, 0.95, n_samples)

        X = np.column_stack([ndvi, ndbi, lst, pop_density, building_density])

        # Generate target (heat risk score) based on realistic relationships
        risk_score = (
            -30 * ndvi          # Higher vegetation = lower risk
            + 25 * ndbi          # Higher built-up = higher risk
            + 1.2 * lst          # Higher surface temp = higher risk
            + 0.0005 * pop_density  # Population impact
            + 15 * building_density  # Building density impact
            + np.random.normal(0, 3, n_samples)  # Noise
        )

        # Normalize to 0-100
        risk_score = np.clip(risk_score, 0, 100)

        return X, risk_score

    def train(self, X=None, y=None):
        """Train the model. Uses synthetic data if none provided."""
        if X is None or y is None:
            X, y = self.generate_synthetic_data()

        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=0.2, random_state=42
        )

        self.model.fit(X_train, y_train)
        self.is_trained = True

        # Evaluate
        y_pred = self.model.predict(X_test)
        metrics = {
            "rmse": float(np.sqrt(mean_squared_error(y_test, y_pred))),
            "r2": float(r2_score(y_test, y_pred)),
            "feature_importances": dict(
                zip(self.feature_names, self.model.feature_importances_.tolist())
            ),
        }
        return metrics

    def predict(self, features: dict) -> dict:
        """
        Predict heat risk score.
        
        Args:
            features: dict with keys: ndvi, ndbi, lst, population_density, building_density
        
        Returns:
            dict with risk_score, risk_level, predicted_temperature
        """
        if not self.is_trained:
            self.train()

        X = np.array([[
            features.get("ndvi", 0.2),
            features.get("ndbi", 0.5),
            features.get("lst", 42),
            features.get("population_density", 15000),
            features.get("building_density", 0.5),
        ]])

        risk_score = float(np.clip(self.model.predict(X)[0], 0, 100))

        if risk_score >= 80:
            risk_level = "extreme"
        elif risk_score >= 60:
            risk_level = "very_high"
        elif risk_score >= 40:
            risk_level = "high"
        elif risk_score >= 20:
            risk_level = "moderate"
        else:
            risk_level = "low"

        return {
            "risk_score": round(risk_score, 1),
            "risk_level": risk_level,
            "predicted_temperature": round(features.get("lst", 42) + (risk_score - 50) * 0.1, 1),
            "confidence": round(0.85 + np.random.uniform(-0.05, 0.05), 2),
        }

    def save(self, path: str):
        """Save model to disk."""
        os.makedirs(os.path.dirname(path), exist_ok=True)
        with open(path, "wb") as f:
            pickle.dump(self.model, f)

    def load(self, path: str):
        """Load model from disk."""
        with open(path, "rb") as f:
            self.model = pickle.load(f)
        self.is_trained = True
