import { createOpenAI } from '@ai-sdk/openai';
import { generateText } from 'ai';

const groq = createOpenAI({
  baseURL: 'https://api.groq.com/openai/v1',
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { message, dataContext } = await req.json();

    const { text } = await generateText({
      model: groq('llama-3.3-70b-versatile'),
      system: `You are a helpful Data Analyst Assistant.
      
      IMPORTANT DATA CONTEXT:
      ${dataContext}
      
      RULES:
      1. The user asks questions about the data summary above.
      2. If the user asks for an average (like "student_id"), use the 'Numeric Averages' provided in the context. DO NOT say "IDs cannot be averaged". Just give the number.
      3. Be concise and direct.`,
      prompt: message,
    });

    return Response.json({ text });
  } catch (error) {
    console.error('Chat API error:', error);
    return Response.json({ text: 'Sorry, I encountered an error.' }, { status: 500 });
  }
}