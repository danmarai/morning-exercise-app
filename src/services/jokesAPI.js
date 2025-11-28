// Service for fetching jokes and interesting facts from free APIs

const JOKE_API = 'https://official-joke-api.appspot.com/random_joke';
const FACT_API = 'https://uselessfacts.jsph.pl/random.json?language=en';

class JokesAPIService {
  constructor() {
    this.cache = {
      jokes: [],
      facts: []
    };
  }

  async fetchJoke() {
    const startTime = Date.now();
    console.log('[JokesAPI] 🎭 Fetching joke from API...');
    try {
      const response = await fetch(JOKE_API);
      const data = await response.json();
      const joke = `${data.setup}... ${data.punchline}`;
      const endTime = Date.now();
      console.log(`[JokesAPI] ✅ Joke fetched in ${endTime - startTime}ms`);
      return joke;
    } catch (error) {
      console.error('[JokesAPI] ❌ Error fetching joke:', error);
      return this.getFallbackJoke();
    }
  }

  async fetchFact() {
    const startTime = Date.now();
    console.log('[JokesAPI] 📖 Fetching fact from API...');
    try {
      const response = await fetch(FACT_API);
      const data = await response.json();
      const endTime = Date.now();
      console.log(`[JokesAPI] ✅ Fact fetched in ${endTime - startTime}ms`);
      return data.text;
    } catch (error) {
      console.error('[JokesAPI] ❌ Error fetching fact:', error);
      return this.getFallbackFact();
    }
  }

  async getContent(type = 'quote') {
    console.log(`[JokesAPI] Requested: ${type}`);
    if (type === 'joke') {
      return await this.fetchJoke();
    } else if (type === 'fact') {
      return await this.fetchFact();
    } else {
      // Default to quote
      return this.getMotivationalQuote();
    }
  }

  async getRandomContent() {
    const type = Math.random() > 0.5 ? 'joke' : 'fact';
    return await this.getContent(type);
  }

  getFallbackJoke() {
    const jokes = [
      "Why don't scientists trust atoms? Because they make up everything!",
      "What do you call a bear with no teeth? A gummy bear!",
      "Why did the scarecrow win an award? He was outstanding in his field!",
      "What do you call a fake noodle? An impasta!",
      "Why don't eggs tell jokes? They'd crack each other up!"
    ];
    return jokes[Math.floor(Math.random() * jokes.length)];
  }

  getFallbackFact() {
    const facts = [
      "Honey never spoils. Archaeologists have found 3000-year-old honey in Egyptian tombs that was still edible.",
      "A group of flamingos is called a flamboyance.",
      "Bananas are berries, but strawberries aren't.",
      "The shortest war in history lasted 38 minutes between Britain and Zanzibar.",
      "Octopuses have three hearts and blue blood."
    ];
    return facts[Math.floor(Math.random() * facts.length)];
  }

  getMotivationalQuote() {
    const quotes = [
      // Mental Health & Resilience
      "Your mental health is a priority. Your happiness is essential. Your self-care is a necessity. Taking time to build your strength, both physical and mental, is an investment in yourself.",
      "Resilience isn't about avoiding the storm. It's about learning to dance in the rain. Every rep, every second you hold on, you're building that resilience.",
      "You don't have to be perfect to be worthy of love and respect. Progress over perfection. Show up for yourself, even on the hard days.",
      "Mental strength is built in the quiet moments when no one is watching. When you choose to continue even when it's uncomfortable. You're doing that right now.",
      "Self-compassion isn't self-indulgence. Being kind to yourself during this challenge is just as important as pushing through it.",
      
      // Growth & Change
      "Growth happens outside your comfort zone. Right now, you're expanding what you thought was possible. Your future self will thank you.",
      "Every time you show up, you're rewriting the story you tell yourself about who you are and what you're capable of.",
      "Change is uncomfortable, but so is staying the same. You chose growth today. That takes courage.",
      "The strongest people aren't born that way. They become strong by consistently showing up, even when they don't feel like it. Just like you're doing now.",
      
      // Present Moment & Mindfulness
      "Be here now. Feel your breath. Feel your strength. This moment is all you need to focus on. One breath, one second at a time.",
      "Your body is capable of amazing things. Listen to it. Honor it. Challenge it. But most importantly, appreciate it for showing up today.",
      "You are not your thoughts. You are not your doubts. You are the awareness behind them. Right now, you are choosing strength.",
      
      // Overcoming Challenges
      "The obstacle in front of you isn't blocking your path. It IS the path. Every challenge is an opportunity to discover what you're made of.",
      "You've survived 100% of your worst days. You're stronger than you think, more resilient than you know, and capable of more than you imagine.",
      "Courage isn't the absence of fear. It's feeling the fear and doing it anyway. You're brave for being here.",
      
      // Self-Worth & Acceptance
      "Your worth isn't measured by how long you can hold this position or how many reps you can do. Your worth is inherent. This is just you honoring your body.",
      "You are enough, exactly as you are. This workout isn't about becoming someone else. It's about becoming more fully yourself.",
      "Comparison is the thief of joy. Your only competition is the person you were yesterday. And today, you're showing up.",
      
      // Persistence & Consistency
      "Success isn't about giant leaps. It's about small, consistent steps forward. Today is one of those steps. You're building something sustainable.",
      "The journey of a thousand miles begins with a single step. Every workout, every day you show up, you're on that journey. Keep going.",
      "Consistency beats intensity. The fact that you're here matters more than how perfectly you perform. You're building a habit of showing up for yourself."
    ];
    return quotes[Math.floor(Math.random() * quotes.length)];
  }
}

export default new JokesAPIService();

