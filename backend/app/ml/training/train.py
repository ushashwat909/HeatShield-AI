"""Training script for Random Forest and XGBoost models."""
from app.ml.models.heat_predictor import HeatPredictor
from app.ml.models.xgboost_predictor import XGBoostPredictor


def train_all_models():
    """Train all ML models and print metrics."""
    print("=" * 60)
    print("HeatShield AI - Model Training Pipeline")
    print("=" * 60)

    # Train Random Forest
    print("\n[1/2] Training Random Forest Heat Predictor...")
    rf = HeatPredictor(n_estimators=100)
    rf_metrics = rf.train()
    print(f"  RMSE: {rf_metrics['rmse']:.3f}")
    print(f"  R²:   {rf_metrics['r2']:.3f}")
    print(f"  Feature Importances:")
    for feat, imp in rf_metrics["feature_importances"].items():
        print(f"    {feat}: {imp:.4f}")

    # Train XGBoost
    print("\n[2/2] Training XGBoost Temperature Predictor...")
    xgb = XGBoostPredictor()
    xgb_metrics = xgb.train()
    print(f"  Status: {xgb_metrics.get('status', 'unknown')}")

    print("\n" + "=" * 60)
    print("Training complete!")
    print("=" * 60)


if __name__ == "__main__":
    train_all_models()
