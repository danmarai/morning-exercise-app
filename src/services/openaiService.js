import axios from 'axios';

class OpenAIService {
    async extractWorkoutStats(base64Image) {
        try {
            const response = await axios.post('/api/analyze', {
                image: base64Image
            });

            return response.data;
        } catch (error) {
            console.error("Analysis Error:", error);
            throw error;
        }
    }
}

export default new OpenAIService();
