from fastapi import FastAPI, UploadFile, File
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

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
