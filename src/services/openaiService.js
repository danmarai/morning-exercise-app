import axios from 'axios';

class OpenAIService {
    async extractWorkoutStats(base64Image, apiKey) {
        if (!apiKey) throw new Error("API Key is required");

        const prompt = `
      Analyze this image of a workout summary screen. 
      Extract the following information and return it as a JSON object:
      - type: The type of workout (e.g., "Rowing", "Tonal", "Cycling", "Running", "Other").
      - duration: Duration in minutes (number).
      - calories: Total calories burned (number).
      - distance: Distance covered (string with unit, e.g., "2000m", or null if not applicable).
      
      Return ONLY the JSON object, no markdown formatting.
    `;

        try {
            const response = await axios.post(
                'https://api.openai.com/v1/chat/completions',
                {
                    model: "gpt-4o",
                    messages: [
                        {
                            role: "user",
                            content: [
                                { type: "text", text: prompt },
                                {
                                    type: "image_url",
                                    image_url: {
                                        url: base64Image
                                    }
                                }
                            ]
                        }
                    ],
                    max_tokens: 300
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${apiKey}`
                    }
                }
            );

            const content = response.data.choices[0].message.content;
            // Clean up potential markdown code blocks
            const jsonString = content.replace(/```json/g, '').replace(/```/g, '').trim();
            return JSON.parse(jsonString);

        } catch (error) {
            console.error("OpenAI API Error:", error);
            throw error;
        }
    }
}

export default new OpenAIService();
