# GameSnips

### Author: Sagar

A TikTok-style React Native app where users can browse short game-related video clips.

---

## 🚀 Project Overview

**GameSnips** is a React Native mobile app built with Expo that mimics the core functionalities of TikTok, tailored for game video snippets. The goal is to demonstrate smooth vertical video playback, a clean UI, and efficient data handling using a local JSON file.

---

## 🛠️ Setup Instructions

### Requirements

- **Node.js** (v18+ recommended)
- **Expo CLI**
- **npm** or **yarn**

### Getting Started

1. Clone the repo:
   ```bash
   git clone https://github.com/Sagar0169/GameSnips.git
   cd GameSnips

2. Install dependencies:
   ```bash
   npm install

3. Run the app:
  ```bash
   npx expo start

### 💾 Data Persistence
Chosen Option:
AsyncStorage (via @react-native-async-storage/async-storage)

Reason:
Simple key-value storage solution

Lightweight and sufficient for managing snippet data locally

Works well for short-term persistence without backend complexity

✅ Features
Core Features
 Vertical feed of video snippets

 Smooth swipe navigation

 Play/pause on tap

 Snippet metadata display (title, duration, etc.)

 Floating delete button to clear all snippets

 Toast message upon deletion

 Handles empty state with friendly UI

Bonus Features
 Like/favorite functionality

 Save playback position

 Backend integration for dynamic feed

🧠 Architectural Decisions
Expo + React Native: Chosen for rapid development and device compatibility

FlatList: For performance-optimized feed rendering

Modular components: Reusable and clean code organization

AsyncStorage: For local persistence without external backend dependencies

⚠️ Known Issues & Future Improvements
No pagination or lazy loading

Playback resets when navigating away

No backend or real-time update support
