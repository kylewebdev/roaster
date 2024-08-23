import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

const OpenAIAnalysis = ({ imageBase64 }: { imageBase64: string }) => {
  const [analysis, setAnalysis] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const analyzeImage = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/analyze-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: imageBase64 }),
      });
      const data = await response.json();
      setAnalysis(data.analysis);
    } catch (error) {
      console.error('Error analyzing image:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const shareResult = async () => {
    if (navigator.share) {
      try {
        const blob = await (await fetch(`data:image/png;base64,${imageBase64}`)).blob();
        const file = new File([blob], 'roast_me.png', { type: 'image/png' });
        await navigator.share({
          title: 'Roast Me Result',
          text: analysis,
          files: [file],
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      // Fallback: Copy to clipboard
      try {
        await navigator.clipboard.writeText(analysis);
        alert('Analysis copied to clipboard!');
      } catch (error) {
        console.error('Error copying to clipboard:', error);
        alert('Unable to share. Please copy the analysis manually.');
      }
    }
  };

  return (
    <Card className="w-full max-w-md mt-4">
      <CardContent className="pt-6 space-y-4">
        <img
          src={`data:image/png;base64,${imageBase64}`}
          alt="Selected Image"
          className="w-full h-auto"
        />
        <Button onClick={analyzeImage} disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Analyzing...
            </>
          ) : (
            'Analyze Image'
          )}
        </Button>
        {analysis && (
          <div className="mt-4">
            <p>{analysis}</p>
          </div>
        )}
      </CardContent>
      {analysis && (
        <CardFooter>
          <Button onClick={shareResult}>
            Share Result
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default OpenAIAnalysis;
