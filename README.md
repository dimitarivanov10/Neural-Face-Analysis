# 📸 AI-Powered Facial Recognition Attendance System

A modern, real-time attendance tracking system that uses **FaceNet** for facial embedding and **React** for a dynamic, high-performance dashboard.

---

## 🚀 Overview

This project automates the process of taking attendance. By standing in front of a camera, the system recognizes registered students with high confidence and instantly populates a dynamic attendance list. 

### Key Features:
*   **Real-time Recognition**: AI scanning loop running every 600ms.
*   **Dynamic Dashboard**: Modern dark-mode UI that updates live without page refreshes.
*   **Identity Management**: Registration system to enroll new faces and a "Wipe" feature to reset the AI memory.
*   **Robust Backend**: FastAPI-based server handling image processing and Cosine Similarity matching.

---

## 🛠️ Technologies Used

### Frontend
*   **React 19 (TypeScript)**: For building the UI.
*   **Tailwind CSS**: For styling and layout.
*   **Lucide React**: For iconography.
*   **React-Webcam**: For accessing user media.

### Backend
*   **FastAPI**: High-performance Python web framework.
*   **Keras-FaceNet**: Pre-trained Google FaceNet model for generating 512-dimension face embeddings.
*   **OpenCV**: For image manipulation and color conversion.
*   **NumPy**: For mathematical operations and Cosine Similarity calculations.

---

## 🏗️ Project Architecture

The project follows a **"Lifting State Up"** pattern in React to ensure data flows smoothly between the camera and the table.

### Structure:
*   **`AttendanceManager.tsx`**: The "Brain" of the frontend. It holds the state of the attendance list and provides handlers for recognition and system resets.
*   **`CameraSectionView.tsx`**: The sensor. It captures frames, sends them to the API, and triggers the `onRecognized` callback.
*   **`TableSectionView.tsx`**: The display. A pure component that renders the list of students provided by the Manager.
*   **`main.py`**: The API server that compares live scans against the `encodings.pkl` database.
*   **`enroll.py`**: A utility script to process raw images and build the facial embeddings database.

---

## 📁 Directory Structure

```text
Neural-Face-Analysis/
├── data/
│   ├── known_faces/      # Folders for each student containing .jpg images
│   └── encodings.pkl     # The binary "brain" containing facial embeddings
├── backend/
│   ├── main.py           # FastAPI Application
│   └── enroll.py         # Script to generate embeddings
└── frontend/
    ├── src/
    │   ├── components/   # React components (Manager, Camera, Table)
    │   └── App.tsx       # Main layout shell
    └── package.json
