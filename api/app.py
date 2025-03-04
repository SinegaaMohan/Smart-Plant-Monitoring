from fastapi import FastAPI, File, UploadFile
import uvicorn
import numpy as np
from io import BytesIO
from PIL import Image
import tensorflow as tf
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

origins = [
    "http://localhost",
    "http://localhost:3000"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
#endpoint = "http://localhost:8605/v1/models/Bell_Pepper_Model:predict"

MODEL = tf.keras.models.load_model("/home/punky/ml/tf_gpu/models/keras/1.keras")

CLASS_NAMES = ['Pepper__bell___Bacterial_spot', 'Pepper__bell___healthy']


def read_files_as_image(data) -> np.ndarray:
    image = np.array(Image.open(BytesIO(data)))
    return image

@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    image = read_files_as_image(await file.read())
    image_batch = np.expand_dims(image, 0)
    prediction = MODEL.predict(image_batch)
    predicted_class = CLASS_NAMES[np.argmax(prediction[0])]
    accuracy = np.max(prediction[0])
    
    return {
        'class' : predicted_class,
        'accuracy': float(accuracy)
    }

if __name__=="__main__":
    uvicorn.run(app,host='localhost', port=8000)