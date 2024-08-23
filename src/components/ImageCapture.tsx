import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ImageCaptureProps {
  onCapture: (imageBase64: string) => void;
}

const ImageCapture: React.FC<ImageCaptureProps> = ({ onCapture }) => {
  const [isWebcamActive, setIsWebcamActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let stream: MediaStream | null = null;

    const startWebcam = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
          setIsWebcamActive(true);
        }
      } catch (error) {
        console.error('Error accessing webcam:', error);
      }
    };

    const stopWebcam = () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
        if (videoRef.current) {
          videoRef.current.srcObject = null;
        }
        setIsWebcamActive(false);
      }
    };

    if (isWebcamActive) {
      startWebcam();
    } else {
      stopWebcam();
    }

    return () => {
      stopWebcam();
    };
  }, [isWebcamActive]);

  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      canvas.getContext('2d')?.drawImage(video, 0, 0);
      const base64Data = canvas.toDataURL('image/jpeg').split(',')[1];
      onCapture(base64Data);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Data = (reader.result as string).split(',')[1];
        onCapture(base64Data);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-4">
      <Button
        onClick={() => setIsWebcamActive(!isWebcamActive)}
      >
        {isWebcamActive ? 'Stop Webcam' : 'Start Webcam'}
      </Button>
      <Input
        type="file"
        accept="image/*"
        onChange={handleFileUpload}
        className="hidden"
        id="fileInput"
      />
      <Button asChild className="ml-2">
        <label htmlFor="fileInput">
          Upload Image
        </label>
      </Button>
      {isWebcamActive && (
        <>
          <video ref={videoRef} className="w-full" />
          <Button onClick={captureImage}>Capture Image</Button>
        </>
      )}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

export default ImageCapture;