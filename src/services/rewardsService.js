// Service to generate random rewards (Quotes, GIFs, Bonuses)

const REWARDS = {
    QUOTES: [
        "The only bad workout is the one that didn't happen.",
        "Your body can stand almost anything. It's your mind that you have to convince.",
        "Success starts with self-discipline.",
        "Don't stop when you're tired. Stop when you're done.",
        "Discipline is doing what needs to be done, even if you don't want to do it.",
        "The pain you feel today will be the strength you feel tomorrow.",
        "Motivation is what gets you started. Habit is what keeps you going.",
        "Sweat is just fat crying.",
        "You don't have to be extreme, just consistent.",
        "A one hour workout is 4% of your day. No excuses."
    ],
    GIFS: [
        // Using reliable Giphy IDs/URLs
        "https://media.giphy.com/media/111ebonMs90YLu/giphy.gif", // Thumbs up
        "https://media.giphy.com/media/dM2xuxnJCg4H6/giphy.gif", // Minion cheering
        "https://media.giphy.com/media/Is1O1TWV0LEJi/giphy.gif", // Yes!
        "https://media.giphy.com/media/nXxOjZrbnbRxS/giphy.gif", // Success kid
        "https://media.giphy.com/media/g9582DNuQppxC/giphy.gif", // Leonardo DiCaprio toast
        "https://media.giphy.com/media/3o7abKhOpu0NwenH3O/giphy.gif", // Excited
        "https://media.giphy.com/media/l0HlHJGHe3yAMhdQY/giphy.gif"  // High five
    ],
    BONUSES: [5, 10]
};

class RewardsService {
    getRandomReward() {
        const rand = Math.random();

        // 40% Quote
        if (rand < 0.4) {
            return {
                type: 'quote',
                content: this.getRandomItem(REWARDS.QUOTES)
            };
        }
        // 40% GIF
        else if (rand < 0.8) {
            return {
                type: 'gif',
                content: this.getRandomItem(REWARDS.GIFS)
            };
        }
        // 20% Bonus
        else {
            return {
                type: 'bonus',
                content: this.getRandomItem(REWARDS.BONUSES)
            };
        }
    }

    getRandomItem(array) {
        return array[Math.floor(Math.random() * array.length)];
    }
}

export default new RewardsService();
