import { OpenAI } from 'openai';

export const config = {
    runtime: 'edge',
};

export default async function handler(req) {
    if (req.method !== 'POST') {
        return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 });
    }

    try {
        const { image } = await req.json();

        if (!image) {
            return new Response(JSON.stringify({ error: 'Image is required' }), { status: 400 });
        }

        const apiKey = process.env.OPENAI_API_KEY;
        if (!apiKey) {
            return new Response(JSON.stringify({ error: 'Server configuration error: Missing API Key' }), { status: 500 });
        }

        const openai = new OpenAI({ apiKey });

        const prompt = `
      Analyze this image of a workout summary screen. 
      Extract the following information and return it as a JSON object:
      - type: The type of workout (e.g., "Rowing", "Tonal", "Cycling", "Running", "Other").
      - duration: Duration in minutes (number).
      - calories: Total calories burned (number).
      - distance: Distance covered (string with unit, e.g., "2000m", or null if not applicable).
      
      Return ONLY the JSON object, no markdown formatting.
    `;

        const response = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
                {
                    role: "user",
                    content: [
                        { type: "text", text: prompt },
                        {
                            type: "image_url",
                            image_url: {
                                url: image
                            }
                        }
                    ]
                }
            ],
            max_tokens: 300
        });

        const content = response.choices[0].message.content;
        const jsonString = content.replace(/```json/g, '').replace(/```/g, '').trim();
        const data = JSON.parse(jsonString);

        return new Response(JSON.stringify(data), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (error) {
        console.error('Error processing request:', error);
        return new Response(JSON.stringify({ error: 'Internal Server Error', details: error.message }), { status: 500 });
    }
}
