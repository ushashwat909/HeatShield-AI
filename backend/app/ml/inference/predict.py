"""Unified inference pipeline for all ML models."""
from app.ml.models.heat_predictor import HeatPredictor
from app.ml.models.xgboost_predictor import XGBoostPredictor
from app.ml.models.deep_model import DeepHeatModel


class InferencePipeline:
    """Unified prediction interface for all ML models."""

    def __init__(self):
        self.rf_model = HeatPredictor()
        self.xgb_model = XGBoostPredictor()
        self.deep_model = DeepHeatModel()

    def predict_risk(self, features: dict) -> dict:
        """Predict heat risk using Random Forest."""
        return self.rf_model.predict(features)

    def predict_temperature(self, features: dict) -> dict:
        """Predict future temperature using XGBoost."""
        return self.xgb_model.predict(features)

    def predict_deep(self, features: dict) -> dict:
        """Get deep learning prediction (placeholder)."""
        return self.deep_model.predict(features)

    def ensemble_predict(self, features: dict) -> dict:
        """Combine predictions from all models."""
        rf_pred = self.predict_risk(features)
        xgb_pred = self.predict_temperature(features)

        return {
            "risk_score": rf_pred["risk_score"],
            "risk_level": rf_pred["risk_level"],
            "predicted_temperature": xgb_pred["predicted_temperature"],
            "confidence_interval": {
                "lower": xgb_pred.get("confidence_lower"),
                "upper": xgb_pred.get("confidence_upper"),
            },
            "models_used": ["random_forest", "xgboost"],
        }


# Singleton instance
pipeline = InferencePipeline()
