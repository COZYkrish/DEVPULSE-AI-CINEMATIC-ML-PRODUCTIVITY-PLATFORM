"""
DEVPULSE AI — ML Training Pipeline

Trains 4 models on the developer productivity dataset:
1. Logistic Regression
2. Decision Tree
3. Random Forest
4. XGBoost

Selects the best model and exports it to ONNX format for browser inference.

Usage:
    pip install -r requirements.txt
    python train_model.py
"""

import json
import os
import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression
from sklearn.tree import DecisionTreeClassifier
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, roc_auc_score
from xgboost import XGBClassifier
from skl2onnx import convert_sklearn
from skl2onnx.common.data_types import FloatTensorType
from onnxmltools.convert import convert_xgboost
from onnxmltools.convert.common.data_types import FloatTensorType as XGBFloatTensorType

# Paths
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_DIR = os.path.dirname(BASE_DIR)
DATA_PATH = os.path.join(PROJECT_DIR, "public", "ai_dev_productivity.csv")
MODEL_DIR = os.path.join(PROJECT_DIR, "public", "models")
DATA_DIR = os.path.join(PROJECT_DIR, "public", "data")

os.makedirs(MODEL_DIR, exist_ok=True)
os.makedirs(DATA_DIR, exist_ok=True)


def main():
    print("=" * 60)
    print("DEVPULSE AI — ML Training Pipeline")
    print("=" * 60)

    # 1. Load Data
    print("\n[1/7] Loading dataset...")
    df = pd.read_csv(DATA_PATH)
    print(f"  Records: {len(df)}")
    print(f"  Features: {list(df.columns[:-1])}")
    print(f"  Target: {df.columns[-1]}")
    print(f"  Success rate: {df['task_success'].mean():.2%}")

    feature_cols = [
        "hours_coding", "coffee_intake_mg", "distractions", "sleep_hours",
        "commits", "bugs_reported", "ai_usage_hours", "cognitive_load"
    ]
    X = df[feature_cols].values
    y = df["task_success"].values

    # 2. Split
    print("\n[2/7] Splitting data (80/20)...")
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)
    print(f"  Train: {len(X_train)}, Test: {len(X_test)}")

    # 3. Scale
    print("\n[3/7] Scaling features (StandardScaler)...")
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)

    # Save scaler params
    scaler_params = {
        "mean": scaler.mean_.tolist(),
        "scale": scaler.scale_.tolist(),
    }
    with open(os.path.join(MODEL_DIR, "scaler_params.json"), "w") as f:
        json.dump(scaler_params, f, indent=2)
    print("  Saved scaler_params.json")

    # 4. Train Models
    print("\n[4/7] Training models...")
    models = {
        "Logistic Regression": LogisticRegression(random_state=42, max_iter=1000),
        "Decision Tree": DecisionTreeClassifier(random_state=42, max_depth=8),
        "Random Forest": RandomForestClassifier(random_state=42, n_estimators=100, max_depth=10),
        "XGBoost": XGBClassifier(random_state=42, n_estimators=100, max_depth=6, use_label_encoder=False, eval_metric="logloss"),
    }

    results = {}
    for name, model in models.items():
        model.fit(X_train_scaled, y_train)
        y_pred = model.predict(X_test_scaled)
        y_prob = model.predict_proba(X_test_scaled)[:, 1]

        metrics = {
            "accuracy": round(accuracy_score(y_test, y_pred), 4),
            "precision": round(precision_score(y_test, y_pred), 4),
            "recall": round(recall_score(y_test, y_pred), 4),
            "f1": round(f1_score(y_test, y_pred), 4),
            "rocAuc": round(roc_auc_score(y_test, y_prob), 4),
        }
        results[name] = metrics
        print(f"  {name}: Acc={metrics['accuracy']}, F1={metrics['f1']}, AUC={metrics['rocAuc']}")

    # 5. Select Best
    print("\n[5/7] Selecting best model...")
    best_name = max(results, key=lambda k: results[k]["f1"])
    print(f"  Champion: {best_name} (F1={results[best_name]['f1']})")

    # Mark best model
    metrics_list = []
    for name, metrics in results.items():
        metrics_list.append({
            "name": name,
            **metrics,
            "isBest": name == best_name,
        })
    with open(os.path.join(MODEL_DIR, "model_metrics.json"), "w") as f:
        json.dump(metrics_list, f, indent=2)
    print("  Saved model_metrics.json")

    # 6. Feature Importance
    print("\n[6/7] Computing feature importance...")
    best_model = models[best_name]
    if hasattr(best_model, "feature_importances_"):
        importances = best_model.feature_importances_.tolist()
    else:
        importances = np.abs(best_model.coef_[0]).tolist()
    
    importance_data = [
        {"feature": col, "importance": round(imp, 4)}
        for col, imp in zip(feature_cols, importances)
    ]
    importance_data.sort(key=lambda x: x["importance"], reverse=True)
    with open(os.path.join(MODEL_DIR, "feature_importance.json"), "w") as f:
        json.dump(importance_data, f, indent=2)
    print("  Saved feature_importance.json")

    # Dataset stats
    stats = {}
    for col in feature_cols:
        stats[col] = {
            "mean": float(round(df[col].mean(), 4)),
            "std": float(round(df[col].std(), 4)),
            "min": float(round(df[col].min(), 4)),
            "max": float(round(df[col].max(), 4)),
        }
    with open(os.path.join(DATA_DIR, "dataset_stats.json"), "w") as f:
        json.dump(stats, f, indent=2)
    print("  Saved dataset_stats.json")

    # Correlation matrix
    corr = df[feature_cols + ["task_success"]].corr().round(4).to_dict()
    with open(os.path.join(DATA_DIR, "correlation_matrix.json"), "w") as f:
        json.dump(corr, f, indent=2)
    print("  Saved correlation_matrix.json")

    # 7. Export to ONNX
    print("\n[7/7] Exporting to ONNX...")
    onnx_path = os.path.join(MODEL_DIR, "model.onnx")
    
    initial_type = [("float_input", FloatTensorType([None, len(feature_cols)]))]
    
    if best_name == "XGBoost":
        xgb_initial_type = [("float_input", XGBFloatTensorType([None, len(feature_cols)]))]
        onnx_model = convert_xgboost(best_model, initial_types=xgb_initial_type)
    else:
        onnx_model = convert_sklearn(best_model, initial_types=initial_type)
    
    with open(onnx_path, "wb") as f:
        f.write(onnx_model.SerializeToString())
    
    file_size = os.path.getsize(onnx_path)
    print(f"  Saved model.onnx ({file_size / 1024:.1f} KB)")

    print("\n" + "=" * 60)
    print("Training complete! All artifacts saved.")
    print(f"  Model: {MODEL_DIR}/model.onnx")
    print(f"  Scaler: {MODEL_DIR}/scaler_params.json")
    print(f"  Metrics: {MODEL_DIR}/model_metrics.json")
    print("=" * 60)


if __name__ == "__main__":
    main()
