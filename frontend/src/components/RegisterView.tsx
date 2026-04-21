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
}
