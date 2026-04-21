import os
from fastapi import FastAPI, UploadFile, File, Form
import shutil
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

DATA_DIR = "registered_faces";
if not os.path.exists(DATA_DIR):
    os.makedirs(DATA_DIR);

@app.get("/")
def read_root():
    return {"status": "AI Backend Running"}
    
@app.post("/detect")
async def detect_face(file: UploadFile = File(...)):

    return {
        "message": "Image received!",
        "filename": file.filename,
        "identity": "Analyzing..."
    }
@app.post("/register")
async def register_student(name: str = Form(...), images: list[UploadFile] = File(...)):
    try:
        # 1. Create a folder for the student
        student_folder = os.path.join(DATA_DIR, name.replace(" ", "_"))
        os.makedirs(student_folder, exist_ok=True)

        # 2. Save the images
        for i, image in enumerate(images):
            file_path = os.path.join(student_folder, f"face_{i}.jpg")
            with open(file_path, "wb") as buffer:
                shutil.copyfileobj(image.file, buffer)

        return {"status": "success", "message": f"Registered {name} successfully!"}
    except Exception as e:
        return {"status": "error", "message": str(e)}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
