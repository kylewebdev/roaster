import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: Request) {
  const { image } = await req.json();

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: "Savagely roast me based on this photo. Be as mean as possible. I want to be roasted. PG-13 rated please." },
            { type: "image_url", image_url: { url: `data:image/png;base64,${image}` } },
          ],
        },
      ],
    });

    return NextResponse.json({ analysis: response.choices[0].message.content });
  } catch (error) {
    console.error('Error analyzing image:', error);
    return NextResponse.json({ error: 'Failed to analyze image' }, { status: 500 });
  }
}