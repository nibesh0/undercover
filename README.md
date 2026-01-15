# 🎮 Undercover - Multiplayer Social Deduction Game

A real-time multiplayer web-based social deduction game where players must identify hidden roles through strategic word clues and voting.

![Game Type](https://img.shields.io/badge/Type-Social%20Deduction-purple)
![Players](https://img.shields.io/badge/Players-4--10-blue)
![Tech](https://img.shields.io/badge/Tech-Python%20%2B%20Next.js-green)

## 🎯 Game Overview

**Undercover** is a thrilling word-based party game where players receive secret roles and must deduce each other's identities through clever descriptions and deduction.

### Roles

- **🟢 Civilian**: Has the common word (e.g., "coffee"). Win by eliminating all enemies.
- **🟡 Undercover**: Has a similar word (e.g., "tea"). Win by surviving and outnumbering Civilians.
- **🔴 Mr. White**: Has NO word. Win by guessing the Civilian word if eliminated.

### How to Play

1. **Join a Room**: Host creates a room or players join with a room code
2. **Receive Roles**: Each player secretly gets their role and word
3. **Give Clues**: Take turns describing your word (one phrase/word)
4. **Vote**: Discuss and vote to eliminate suspicious players
5. **Win**: Achieve your role's win condition!

## 🚀 Quick Start

### Prerequisites

- Python 3.8+
- Node.js 18+
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd undercover
   ```

2. **Set up the Backend (Python)**
   ```bash
   cd backend
   
   # Create virtual environment
   python -m venv venv
   
   # Activate virtual environment
   # Windows:
   venv\Scripts\activate
   # macOS/Linux:
   source venv/bin/activate
   
   # Install dependencies
   pip install -r requirements.txt
   
   # Create .env file
   copy .env.example .env  # Windows
   # OR
   cp .env.example .env    # macOS/Linux
   ```

3. **Set up the Frontend (Next.js)**
   ```bash
   cd ../frontend
   
   # Install dependencies
   npm install
   
   # Create .env.local file
   copy .env.local.example .env.local  # Windows
   # OR
   cp .env.local.example .env.local    # macOS/Linux
   ```

### Running Locally

1. **Start the Backend Server**
   ```bash
   cd backend
   python app.py
   ```
   Backend runs on `http://localhost:5000`

2. **Start the Frontend (in a new terminal)**
   ```bash
   cd frontend
   npm run dev
   ```
   Frontend runs on `http://localhost:3000`

3. **Play the Game**
   - Open `http://localhost:3000` in your browser
   - Create a room or join with a room code
   - Share the code with friends to play together!

## 🏗️ Architecture

```
undercover/
├── backend/              # Python Flask + Socket.IO server
│   ├── app.py           # Main Flask application
│   ├── game_manager.py  # Room and game state management
│   ├── game_logic.py    # Core game rules and logic
│   ├── socket_handlers.py # WebSocket event handlers
│   ├── word_bank.py     # Word pairs database
│   └── utils.py         # Helper functions
│
└── frontend/            # Next.js TypeScript client
    ├── src/
    │   ├── app/         # Next.js app router pages
    │   ├── components/  # React components
    │   ├── lib/         # Socket.IO client
    │   └── types/       # TypeScript definitions
    └── public/          # Static assets
```

## 🎨 Features

- ✨ **Modern UI**: Glassmorphism design with smooth animations
- 🔄 **Real-time Updates**: WebSocket-based instant synchronization
- 📱 **Responsive**: Works on desktop, tablet, and mobile
- 🎭 **Role-based Gameplay**: Civilians, Undercovers, and Mr. White
- 🗳️ **Voting System**: Democratic elimination with tie-breaking
- 🎯 **Mr. White Mechanic**: Final guess opportunity for dramatic comebacks
- 🔒 **Secure**: Server-side role verification and data protection

## 🛠️ Tech Stack

### Backend
- **Flask**: Web framework
- **Flask-SocketIO**: WebSocket support
- **Flask-CORS**: Cross-origin requests
- **Eventlet**: Async I/O

### Frontend
- **Next.js 14**: React framework
- **TypeScript**: Type safety
- **Socket.IO Client**: Real-time communication
- **Tailwind CSS**: Utility-first styling (customized with glassmorphism)

## 🔒 Security

- All role assignments and word distributions happen server-side
- Players receive only their own role and word
- Input validation on all client submissions
- Sanitized user inputs to prevent XSS
- Room-based Socket.IO namespaces for data isolation

## 🎮 Game Rules

### Win Conditions
- **Civilians Win**: Eliminate all Undercovers AND Mr. White
- **Undercovers Win**: Undercovers + Mr. White ≥ Civilians
- **Mr. White Win**: Correctly guess the Civilian word when eliminated

### Role Distribution
- **4-5 players**: 1 Undercover, 1 Mr. White, rest Civilians
- **6+ players**: 2 Undercovers, 1 Mr. White, rest Civilians

### Gameplay Flow
1. **Lobby Phase**: Players join and host configures settings
2. **Role Assignment**: Server assigns roles and words
3. **Clue Round**: Each player describes their word
4. **Voting Phase**: Players vote to eliminate someone
5. **Mr. White Guess** (if applicable): Final guess attempt
6. **Results**: Winner revealed with all roles displayed

## 📝 Configuration

### Backend (.env)
```env
FLASK_ENV=development
PORT=5000
CORS_ORIGINS=http://localhost:3000
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
```

## 🚢 Deployment

### Backend (Python)
Deploy to platforms like:
- Render
- Heroku
- Railway
- AWS EC2

### Frontend (Next.js)
Deploy to platforms like:
- Vercel (recommended)
- Netlify
- AWS Amplify

**Important**: Update `CORS_ORIGINS` in backend and `NEXT_PUBLIC_SOCKET_URL` in frontend with production URLs.

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Report bugs
- Suggest features
- Submit pull requests

## 📄 License

MIT License - feel free to use this project for learning or building your own games!

## 🎉 Acknowledgments

Inspired by the popular party game "Undercover" (also known as "Who is the Spy").

---

**Have fun playing! 🎮**
