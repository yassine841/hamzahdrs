# Soccer Manager - Progressive Web App

A complete responsive web application game similar to "Soccer Manager" built as a PWA using React, Tailwind CSS, and Firebase.

## 🚀 Features

### Core Game Features
- **Team Creation**: Each player gets a team of 21 players when they register
- **Player Management**: Players have stats (stamina, attack, defense, speed) randomly assigned between 36% and 39%
- **Training System**: Train players to improve their stats (costs time and energy)
- **Tournament System**: Weekly tournaments with 22 teams (AI-controlled + real players)
- **Match Engine**: Lightweight simulation with live text commentary
- **Stadium Management**: Upgrade your stadium to increase capacity
- **Economy System**: Virtual coins earned through matches and tournaments

### Technical Features
- **Progressive Web App**: Installable on mobile and desktop
- **Responsive Design**: Works seamlessly on all device sizes
- **Real-time Updates**: Firebase integration for live data
- **Authentication**: Secure user registration and login
- **Offline Support**: Basic offline functionality with service workers

### Social Features
- **Leaderboard**: Rankings based on trophies and wins
- **Referral System**: Invite friends to get bonuses
- **Energy System**: Automatic energy refill over time

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS with custom components
- **Backend**: Firebase (Firestore, Auth, Hosting)
- **State Management**: React Context + useReducer
- **Routing**: React Router v6
- **Icons**: Heroicons + Lucide React
- **Notifications**: React Hot Toast
- **Animations**: Framer Motion

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Firebase project (optional for development)

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd soccer-manager
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Firebase Configuration (Optional)**
   - Create a Firebase project at https://console.firebase.google.com
   - Enable Authentication (Email/Password)
   - Create a Firestore database
   - Copy your Firebase config to `src/services/firebase.ts`
   
   ```typescript
   const firebaseConfig = {
     apiKey: "your-api-key",
     authDomain: "your-project.firebaseapp.com",
     projectId: "your-project-id",
     storageBucket: "your-project.appspot.com",
     messagingSenderId: "123456789",
     appId: "your-app-id"
   };
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Build for production**
   ```bash
   npm run build
   ```

## 🎮 Game Mechanics

### Player Generation
- Each team starts with 21 players across all positions
- Player stats are randomly generated between 36-39%
- Stats are adjusted based on player position (e.g., goalkeepers get +5 defense)
- Players have nationality, age, and market value

### Training System
- Costs: 10 energy + 50 coins per training session
- Training duration: 30 minutes (can be boosted with ads)
- Players must have at least 20 energy to train
- Stats improve gradually with training

### Tournament Structure
- Weekly tournaments with 22 teams
- Single elimination format
- Prizes: Winner (5000 coins), Runner-up (2500 coins), Semifinalist (1000 coins)
- AI teams are generated automatically to fill slots

### Energy System
- Maximum energy: 100
- Refill rate: 1 energy per 10 minutes
- Used for training players
- Automatically refills over time

## 📱 PWA Features

### Installation
The app can be installed on:
- **Mobile devices**: Add to Home Screen
- **Desktop**: Install via browser prompt
- **Offline support**: Basic functionality works offline

### Manifest Configuration
- App name: "Soccer Manager"
- Theme color: #00B04F (Soccer green)
- Display mode: Standalone
- Orientation: Portrait (mobile)

## 🔧 Development

### Project Structure
```
src/
├── components/          # Reusable UI components
│   ├── auth/           # Authentication forms
│   ├── common/         # Common UI components
│   ├── game/           # Game-specific components
│   └── layout/         # Layout components
├── contexts/           # React contexts
├── data/              # Game data and constants
├── hooks/             # Custom React hooks
├── pages/             # Page components
├── services/          # API and Firebase services
├── types/             # TypeScript type definitions
└── utils/             # Utility functions
```

### Key Files
- `src/contexts/GameContext.tsx` - Global game state management
- `src/services/gameService.ts` - Firebase service functions
- `src/utils/gameUtils.ts` - Game logic and utilities
- `src/data/gameData.ts` - Game constants and data

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🚀 Deployment

### Firebase Hosting
1. Install Firebase CLI: `npm install -g firebase-tools`
2. Login: `firebase login`
3. Initialize: `firebase init hosting`
4. Build: `npm run build`
5. Deploy: `firebase deploy`

### Other Platforms
The app can be deployed to:
- **Vercel**: Connect GitHub repo for automatic deployments
- **Netlify**: Drag and drop build folder or connect repo
- **GitHub Pages**: Use GitHub Actions for deployment

## 🎯 Game Configuration

### Customizable Settings
Edit `src/data/gameData.ts` to modify:
- Player stat ranges
- Energy refill rates
- Training costs
- Tournament prizes
- Stadium upgrade costs

### Adding New Features
1. **New Player Positions**: Add to `PlayerPosition` type and update formations
2. **Custom Formations**: Add to `FORMATIONS` array in gameData
3. **New Training Types**: Extend `TrainingSession` type and add logic
4. **Tournament Variations**: Modify tournament generation in services

## 🐛 Known Issues

- Service worker caching needs optimization for dynamic content
- Match simulation could be more detailed
- Real-time multiplayer features not implemented
- Ad integration for training boosts not implemented

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -am 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Icons by Heroicons and Lucide
- Inspired by classic football manager games
- Built with modern web technologies

## 📞 Support

For support or questions:
- Create an issue on GitHub
- Check the documentation
- Review the code comments for implementation details

---

**Note**: This is a demo application. For production use, ensure proper Firebase security rules, implement rate limiting, and add comprehensive error handling.