'use client';
import { useState } from 'react';
import ImageCapture from '../components/ImageCapture';
import OpenAIAnalysis from '../components/OpenAIAnalysis';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
  const [capturedImage, setCapturedImage] = useState<string | null>(null);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Roast Me</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <ImageCapture onCapture={setCapturedImage} />
        </CardContent>
      </Card>

      {capturedImage && 
        <OpenAIAnalysis imageBase64={capturedImage} />
      }
    </main>
  );
}