from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import numpy as np
from io import BytesIO
from PIL import Image
import tensorflow as tf
import requests

app = FastAPI()

# CORS setup
origins = [
    "http://localhost",
    "http://localhost:3000",
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# TensorFlow Serving endpoint
endpoint = "http://localhost:8501/v1/models/potatoes_model:predict"

# Class labels
CLASS_NAMES = ['Potato___Early_blight', 'Potato___Late_blight', 'Potato___healthy']

@app.get("/ping")
async def ping():
    return {"message": "Hello, I am alive"}

# Convert uploaded image to NumPy array
def read_file_as_image(data) -> np.ndarray:
    image = Image.open(BytesIO(data)).convert("RGB")
    image = image.resize((224, 224))  # Ensure it matches model input shape
    image = np.array(image) / 255.0   # Normalize if model was trained this way
    return image.astype(np.float32)

@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    try:
        image = read_file_as_image(await file.read())
        img_batch = np.expand_dims(image, 0)  # Model expects batch

        # Send request to TensorFlow Serving
        json_data = {"instances": img_batch.tolist()}
        response = requests.post(endpoint, json=json_data)
        prediction = np.array(response.json()["predictions"][0])

        predicted_class = CLASS_NAMES[np.argmax(prediction)]
        confidence = np.max(prediction)

        return {
            "class": predicted_class,
            "confidence": float(confidence)
        }
    except Exception as e:
        return {"error": str(e)}

if __name__ == "__main__":
    uvicorn.run(app, host='localhost', port=8000)
