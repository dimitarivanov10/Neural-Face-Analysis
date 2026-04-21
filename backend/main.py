import os
import shutil
import pickle
import cv2
import numpy as np
import uvicorn
from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from keras_facenet import FaceNet

app = FastAPI()

# 1. Setup CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

# 2. Initialize AI Model and Paths
embedder = FaceNet()
DATA_DIR = os.path.join("..", "data", "known_faces")
ENCODINGS_PATH = os.path.join("..", "data", "encodings.pkl")

if not os.path.exists(DATA_DIR):
    os.makedirs(DATA_DIR)

# Helper function to load the latest encodings
def get_known_faces():
    if os.path.exists(ENCODINGS_PATH):
        with open(ENCODINGS_PATH, "rb") as f:
            return pickle.load(f)
    return {}

@app.get("/")
def read_root():
    return {"status": "AI Backend Running"}

@app.post("/detect")
async def detect_face(file: UploadFile = File(...)):
    # Load known faces from the pkl file
    known_faces = get_known_faces()
    if not known_faces:
        return {"identity": "No database found", "box": None}

    # Read image from request
    contents = await file.read()
    nparr = np.frombuffer(contents, np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    
    # Convert BGR (OpenCV default) to RGB (FaceNet requirement)
    img_rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)

    # Extract embeddings and bounding boxes
    detections = embedder.extract(img_rgb, threshold=0.95)

    if len(detections) == 0:
        return {"identity": "No face detected", "box": None}

    # Get the vector for the first face detected
    current_embedding = detections[0]['embedding']
    current_box = detections[0]['box'] # [x, y, w, h]

    best_match = "Unknown"
    highest_sim = 0

    # Compare against our database using Cosine Similarity
    for name, saved_embedding in known_faces.items():
        # Math: (A . B) / (||A|| * ||B||)
        norm_a = np.linalg.norm(current_embedding)
        norm_b = np.linalg.norm(saved_embedding)
        similarity = np.dot(current_embedding, saved_embedding) / (norm_a * norm_b)

        if similarity > highest_sim:
            highest_sim = similarity
            best_match = name

    # Confidence threshold (usually 0.7 - 0.8 is good for FaceNet)
    if highest_sim < 0.75:
        best_match = "Stranger"

    return {
        "identity": best_match,
        "confidence": round(float(highest_sim), 2),
        "box": [int(v) for v in current_box] # x, y, width, height
    }

@app.post("/register")
async def register_student(name: str = Form(...), images: list[UploadFile] = File(...)):
    try:
        student_folder = os.path.join(DATA_DIR, name.replace(" ", "_"))
        os.makedirs(student_folder, exist_ok=True)

        for i, image in enumerate(images):
            file_path = os.path.join(student_folder, f"face_{i}.jpg")
            with open(file_path, "wb") as buffer:
                shutil.copyfileobj(image.file, buffer)

        return {"status": "success", "message": f"Registered {name} successfully!"}
    except Exception as e:
        return {"status": "error", "message": str(e)}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)