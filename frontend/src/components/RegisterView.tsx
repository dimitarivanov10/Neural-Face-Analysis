import { useState, useRef } from "react";
import Webcam from "react-webcam";

export function RegisterView() {
  const [capturedImages, setCapturedImages] = useState<string[]>([]);
  const webcamRef = useRef<Webcam>(null);

  const captureFrame = () => {
    if (capturedImages.length >= 10) return;
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      setCapturedImages((prev) => [...prev, imageSrc]);
    }
  };
  const submitRegistration = async (name: string) => {
    const formData = new FormData();
    formData.append("name", name);

    for (let i = 0; i < capturedImages.length; i++) {
      const response = await fetch(capturedImages[i]);
      const blob = await response.blob();
      formData.append("images", blob, `face_${i}.jpg`);
    }

    await fetch("http://localhost:8000/register", {
      method: "POST",
      body: formData,
    });
  };
}
