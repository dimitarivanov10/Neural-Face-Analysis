import { useState } from "react";
import Webcam from "react-webcam";

export function RegisterView() {
  const [capturedImages, setCapturedImages] = useState<string[]>([]);
  const webcamRef = useRef<Webcam>(null);
}
