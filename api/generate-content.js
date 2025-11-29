import { OpenAI } from 'openai';

export const config = {
    runtime: 'edge',
};

export default async function handler(req) {
    if (req.method !== 'POST') {
        return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 });
    }

    try {
        const apiKey = process.env.OPENAI_API_KEY;
        if (!apiKey) {
            return new Response(JSON.stringify({ error: 'Server configuration error: Missing API Key' }), { status: 500 });
        }

        const openai = new OpenAI({ apiKey });

        const prompt = `
      Generate a JSON object containing two arrays:
      1. "quotes": 20 unique, inspiring, or stoic quotes related to discipline, fitness, health, or perseverance. Include "text" and "author".
      2. "jokes": 20 funny, short jokes or one-liners related to working out, gym life, being sore, or morning exercise. Include "text".

      Ensure the content is varied and not repetitive.
      Return ONLY the JSON object, no markdown formatting.
    `;

        const response = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
                {
                    role: "system",
                    content: "You are a helpful fitness assistant that provides content for a workout app."
                },
                {
                    role: "user",
                    content: prompt
                }
            ],
            response_format: { type: "json_object" }
        });

        const content = response.choices[0].message.content;
        const data = JSON.parse(content);

        return new Response(JSON.stringify(data), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (error) {
        console.error('Error generating content:', error);
        return new Response(JSON.stringify({ error: 'Internal Server Error', details: error.message }), { status: 500 });
    }
}
