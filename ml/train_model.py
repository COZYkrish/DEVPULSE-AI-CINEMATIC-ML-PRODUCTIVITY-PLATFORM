import json
import os
import numpy as np
from sklearn.linear_model import LogisticRegression
from skl2onnx import convert_sklearn
from skl2onnx.common.data_types import FloatTensorType

def main():
    print("Generating dummy data for DEVPULSE AI...")
    np.random.seed(42)
    n_samples = 501
    
    # 8 Features:
    # 'hours_coding', 'coffee_intake_mg', 'distractions', 'sleep_hours',
    # 'commits', 'bugs_reported', 'ai_usage_hours', 'cognitive_load'
    
    X = np.zeros((n_samples, 8), dtype=np.float32)
    X[:, 0] = np.random.uniform(2, 10, n_samples)          # hours_coding
    X[:, 1] = np.random.uniform(0, 500, n_samples)         # coffee_intake
    X[:, 2] = np.random.uniform(0, 10, n_samples)          # distractions
    X[:, 3] = np.random.uniform(4, 9, n_samples)           # sleep_hours
    X[:, 4] = np.random.uniform(0, 20, n_samples)          # commits
    X[:, 5] = np.random.uniform(0, 5, n_samples)           # bugs_reported
    X[:, 6] = np.random.uniform(0, 4, n_samples)           # ai_usage_hours
    X[:, 7] = np.random.uniform(1, 10, n_samples)          # cognitive_load
    
    # Simple linear combination with some noise to generate task_success target
    z = (
        0.3 * X[:, 0] + 
        0.001 * X[:, 1] - 
        0.2 * X[:, 2] + 
        0.4 * X[:, 3] + 
        0.1 * X[:, 4] - 
        0.3 * X[:, 5] + 
        0.2 * X[:, 6] - 
        0.3 * X[:, 7] - 
        2.0
    )
    prob = 1 / (1 + np.exp(-z))
    y = (prob >= 0.5).astype(int)

    print("Training Logistic Regression Model...")
    # Train the model
    model = LogisticRegression(max_iter=1000)
    model.fit(X, y)
    
    print(f"Model Accuracy on training set: {model.score(X, y) * 100:.2f}%")

    # Export to ONNX
    print("Converting to ONNX format...")
    initial_type = [('float_input', FloatTensorType([None, 8]))]
    onx = convert_sklearn(model, initial_types=initial_type, target_opset=12)
    
    # Create public/models directory if it doesn't exist
    out_dir = os.path.join("..", "public", "models")
    os.makedirs(out_dir, exist_ok=True)
    
    onnx_path = os.path.join(out_dir, "model.onnx")
    with open(onnx_path, "wb") as f:
        f.write(onx.SerializeToString())
    print(f"Saved ONNX model to {onnx_path}")

    # No scaler used in this simple script since we pass raw inputs,
    # but the frontend expects scaler_params.json, so we'll write dummy 1s and 0s
    scaler_params = {
        "mean": [0]*8,
        "scale": [1]*8
    }
    scaler_path = os.path.join(out_dir, "scaler_params.json")
    with open(scaler_path, "w") as f:
        json.dump(scaler_params, f)
    print(f"Saved scaler parameters to {scaler_path}")
    print("Done! You can now run your web app with the live ONNX model.")

if __name__ == "__main__":
    main()
