# Product Roadmap: Morning Exercise Tracker

## 🚀 Upcoming Features (Gamification)

### 1. Visual Streak Counter 🔥
**Goal**: Leverage loss aversion to build daily habits.
- [ ] Add "Streak" logic to `Stats` calculation (consecutive days with score > 0).
- [ ] Display "🔥 X Day Streak" in the Header.
- [ ] Add "Streak Freeze" mechanic (optional, v2).

### 2. Variable Rewards (Loot Box) 🎁
**Goal**: Create excitement with unpredictable rewards.
- [ ] Create a "Reward System" service.
- [ ] Define reward table (Quotes, GIFs, Points).
- [ ] Trigger "Loot Box" animation upon workout completion.

### 3. User Ranks & Titles 🏆
**Goal**: Reinforce identity as an athlete.
- [ ] Define Rank thresholds (e.g., 10 workouts = "Morning Warrior").
- [ ] Display Rank on Welcome Screen.
- [ ] Add visual badges/icons for ranks.

### 4. Ghost Mode 👻
**Goal**: Social comparison with past self.
- [ ] Calculate average time/reps for each exercise.
- [ ] Display "Ghost" target bar during exercise.
- [ ] Show "New Record" celebration if beaten.

## 🛠 Technical Debt & Infrastructure
- [x] Initial Git Setup
- [ ] Connect to GitHub Remote
- [ ] Add Unit Tests (Vitest)
- [ ] Add CI/CD Pipeline (GitHub Actions)
