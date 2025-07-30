[![Build and Deploy](https://github.com/dredtrake/krayz/actions/workflows/deploy.yml/badge.svg)](https://github.com/dredtrake/krayz/actions/workflows/deploy.yml)

# KraYz

A retro-style arcade game inspired by classic games like Qix, built with React and Canvas API.

![KraYz Game Intro Screen](./public/intro-screen.png)

## About

This project recreates the nostalgic experience of playing classic boundary-filling games from the Amstrad CPC era. As a young kid, I remember playing this type of game on my 6128 Amstrad computer - the kind of simple yet addictive gameplay that defined early gaming.

## How to Play

**Objective**: Cover as much area as possible by shrinking the walls while avoiding the bouncing ball!

**Controls**:
- Use **arrow keys** to shrink the walls
- The ball will bounce off the walls
- If the ball hits a wall while you're moving it, game over!
- You have 100 seconds to cover as much area as possible

**Scoring System**:
- **Coverage Points**: 100 points per 1% of area covered
- **Efficiency Bonus**: Extra points for covering more area quickly
- **Final Score**: Your performance is ranked from BEGINNER to LEGENDARY!

## Features

- 🎮 Smooth 60 FPS gameplay
- 🎨 Retro CRT-style visual effects
- 💥 Explosive particle effects
- 📊 Real-time score tracking with animated counter
- ⏱️ Countdown timer with visual warnings
- 🏆 Ranking system based on performance
- ⏸️ Pause/Resume functionality

## Play Online

[Check the live demo here!](https://dredtrake.github.io/krayz/)

## Development

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app) and uses [Bun](https://bun.sh/) as the JavaScript runtime and package manager.

### Prerequisites

- [Bun](https://bun.sh/) - Install with: `curl -fsSL https://bun.sh/install | bash`

### Available Scripts

```bash
# Install dependencies
bun install

# Start development server
bun run start

# Build for production
bun run build

# Run tests
bun run test

# Deploy to GitHub Pages
bun run deploy
```

### Tech Stack

- [Bun](https://bun.sh/) - Fast JavaScript runtime & package manager
- React (with Hooks)
- HTML5 Canvas API
- Tailwind CSS
- ESLint & Prettier for code consistency
- Husky for pre-commit hooks
- Jest for testing

## Contributing

Feel free to open issues or submit pull requests if you'd like to contribute to the game!
