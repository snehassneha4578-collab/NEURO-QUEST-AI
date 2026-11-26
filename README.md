# 🧠 NEURO-QUEST-AI — THE INTELLIGENCE ESCAPE

![Animated Header](https://capsule-render.vercel.app/api?type=waving&color=0:050816,50:071B35,100:00D9FF&height=220&section=header&text=NEURO-QUEST-AI&fontSize=46&fontColor=00F7FF&animation=fadeIn&fontAlignY=38&desc=THE%20INTELLIGENCE%20ESCAPE&descAlignY=60&descSize=18)

<p align="center">
  <img src="https://readme-typing-svg.demolab.com?font=Orbitron&weight=700&size=21&duration=2200&pause=500&color=00F7FF&center=true&vCenter=true&width=750&lines=THINK.+DECODE.+SOLVE.+ESCAPE.;ENTER+THE+INTELLIGENCE+ARENA.;CHALLENGE+THE+AI.;OUTSMART+N.E.U.R.O." alt="Animated tagline"/>
</p>

<p align="center">
  <a href="https://neuro-quest-ai.vercel.app/">
    <img src="https://img.shields.io/badge/PLAY_LIVE-OPEN_GAME-00D9FF?style=for-the-badge&logo=vercel&logoColor=white" alt="Play live"/>
  </a>
  <a href="https://github.com/snehassneha4578-collab/NEURO-QUEST-AI">
    <img src="https://img.shields.io/badge/GITHUB-SOURCE_CODE-181717?style=for-the-badge&logo=github&logoColor=white" alt="GitHub repository"/>
  </a>
</p>

<p align="center">
  ![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=black)
  ![TypeScript](https://img.shields.io/badge/TypeScript-7-3178C6?style=flat-square&logo=typescript&logoColor=white)
  ![Vite](https://img.shields.io/badge/Vite-8-646CFF?style=flat-square&logo=vite&logoColor=white)
  ![Gemini AI](https://img.shields.io/badge/Gemini_AI-3.1_Flash--Lite-4285F4?style=flat-square)
  ![Vercel](https://img.shields.io/badge/Deployment-Vercel-000000?style=flat-square&logo=vercel&logoColor=white)
</p>

---

## ⚡ 01 — ENTER THE INTELLIGENCE ARENA

![NEURO-QUEST-AI Hero](docs/images/neuro-quest-hero.png)

> **"The system is compromised. N.E.U.R.O. has taken control. Your intelligence is the only way out."**

**NEURO-QUEST-AI** is a futuristic, browser-based intelligence escape game combining memory challenges, cryptography, logical reasoning, strategic thinking, and generative artificial intelligence.

Players must complete intelligence missions, decode encrypted transmissions, solve logical puzzles, and overcome the AI-controlled system.

**Your mission:** Outsmart N.E.U.R.O. and escape the intelligence facility.

## 🚀 02 — LIVE APPLICATION

<p align="center">
  <a href="https://neuro-quest-ai.vercel.app/">
    <img src="https://img.shields.io/badge/🚀_LAUNCH_MISSION_CONTROL-PLAY_NOW-00D9FF?style=for-the-badge" alt="Launch live game"/>
  </a>
</p>

| Project Detail | Information |
|---|---|
| Project | NEURO-QUEST-AI |
| Experience | The Intelligence Escape |
| Live Dashboard | [Open Live Game](https://neuro-quest-ai.vercel.app/) |
| GitHub Repository | [View Source Code](https://github.com/snehassneha4578-collab/NEURO-QUEST-AI) |
| AI Model | Gemini 3.1 Flash-Lite |
| Frontend | React and TypeScript |
| Deployment | Vercel |

## 🎮 03 — MISSION CONTROL DASHBOARD

![Mission Control Dashboard](docs/images/mission-control.png)

The Mission Control dashboard is the player's central hub for accessing missions, exploring AI-generated puzzles, and tracking game progress.

### Five Intelligence Challenges

| Mission | Intelligence Domain | Objective |
|---|---|---|
| 🧠 Memory Matrix | Memory | Memorize and reproduce sequences |
| 🔐 Code Breaker | Cryptography | Decode encrypted messages |
| ⚙️ Logic Core | Reasoning | Solve logical patterns |
| 🤖 AI Showdown | Strategy | Overcome AI-controlled scenarios |
| ✨ AI Puzzle Lab | Generative AI | Generate and solve new puzzles |

---

## 🧩 04 — EXPLORE THE MISSIONS

### 🧠 MISSION 01 — MEMORY MATRIX

![Memory Matrix](docs/images/memory-matrix.png)

**Remember the sequence. Beat the challenge.**

- Memorize sequences displayed on the screen.
- Reproduce the correct patterns.
- Progress through three increasingly challenging rounds.
- Manage limited lives and the countdown timer.
- Earn XP through successful completion.

### 🔐 MISSION 02 — CODE BREAKER

![Code Breaker and Logic Core](docs/images/codebreaker-logic-core.png)

**Every encrypted transmission hides a secret.**

- Solve Caesar cipher challenges.
- Identify alphabet shifts.
- Decode encrypted messages.
- Recover hidden security phrases.
- Complete progressive transmission challenges.

### ⚙️ MISSION 03 — LOGIC CORE

**Think beyond the obvious. Discover the hidden pattern.**

- Analyze number sequences.
- Solve mathematical reasoning challenges.
- Identify hidden logical patterns.
- Use deduction to discover correct solutions.

### 🤖 MISSION 04 — AI SHOWDOWN

![AI Showdown](docs/images/ai-showdown.png)

**The final battle against N.E.U.R.O.**

- Face three escalating strategic scenarios.
- Analyze firewall and prediction-engine situations.
- Make strategic decisions.
- Neutralize the central AI core.

### ✨ MISSION 05 — AI PUZZLE LAB

![AI Puzzle Lab](docs/images/ai-puzzle-lab.png)

**Fresh puzzles. Dynamic challenges. Powered by Gemini.**

The AI Puzzle Lab integrates Google's Gemini model to generate puzzles dynamically.

**Puzzle Categories**

- Logic
- Cipher
- Riddle
- Mixed

**Difficulty Levels**

- Easy
- Medium
- Hard

**Capabilities**

- Dynamically generated questions.
- Four distinct answer choices.
- AI-generated hints.
- Correct-answer validation.
- Explanations for puzzle solutions.

---

## 🤖 05 — GEMINI AI ENGINE

![Gemini AI](https://img.shields.io/badge/POWERED_BY-GOOGLE_GEMINI-4285F4?style=for-the-badge)

The AI Puzzle Lab uses a server-side API to communicate with Google's Gemini API.

| Configuration | Value |
|---|---|
| AI Provider | Google |
| Model | `gemini-3.1-flash-lite` |
| Backend Endpoint | `/api/generate-puzzle` |
| Request Method | POST |
| Response | Structured puzzle data |

### AI Generation Workflow

```text
             PLAYER
                |
                v
         REACT FRONTEND
                |
                v
          AI PUZZLE LAB
                |
                v
    POST /api/generate-puzzle
                |
                v
       BACKEND VALIDATION
                |
                v
          GEMINI API
                |
                v
       PUZZLE GENERATION
                |
                v
      RESPONSE VALIDATION
                |
                v
       INTERACTIVE PUZZLE
                |
                v
             PLAYER
```

### Generated Puzzle Data

| Component | Description |
|---|---|
| Title | Puzzle name |
| Question | Generated problem statement |
| Options | Four answer choices |
| Correct Answer | Correct option index |
| Hint | Guidance for solving |
| Explanation | Reasoning behind the answer |

## 🛠️ 06 — TECHNOLOGY STACK

| Technology | Purpose |
|---|---|
| React 19 | Interactive frontend |
| TypeScript | Type-safe development |
| Vite 8 | Development and production builds |
| Framer Motion | UI animations and transitions |
| Lucide React | Interface icons |
| CSS | Visual styling |
| Node.js API runtime | Backend puzzle generation |
| Google Gemini API | Generative AI |
| Vercel | Cloud deployment |
| Browser Local Storage | XP and progress persistence |

## ✨ 07 — KEY FEATURES

- 🎮 Five intelligence challenges.
- 🧠 Memory and logical reasoning games.
- 🔐 Cryptographic puzzle solving.
- 🤖 Gemini-powered puzzle generation.
- 🎯 Multiple puzzle categories and difficulty levels.
- 💡 Hints and answer explanations.
- 🏆 XP and progress tracking.
- ⏱️ Timed challenges and lives.
- 💾 Browser-based progress persistence.
- 🔒 Server-side API credential protection.
- ⚡ Animated and interactive interface.

## 🏗️ 08 — PROJECT STRUCTURE

```text
NEURO-QUEST-AI/
│
├── api/
│   └── generate-puzzle.ts
│
├── docs/
│   └── images/
│       ├── neuro-quest-hero.png
│       ├── mission-control.png
│       ├── memory-matrix.png
│       ├── codebreaker-logic-core.png
│       ├── ai-showdown.png
│       └── ai-puzzle-lab.png
│
├── src/
│   ├── App.tsx
│   ├── App.css
│   └── ...
│
├── index.html
├── package.json
├── tsconfig.json
├── tsconfig.api.json
├── vite.config.ts
├── vercel.json
└── README.md
```

## 💻 09 — LOCAL INSTALLATION

### Prerequisites

- Node.js
- npm
- Git
- Google Gemini API key
- Vercel CLI for local API development

### Step 1 — Clone the Repository

```bash
git clone https://github.com/snehassneha4578-collab/NEURO-QUEST-AI.git

cd NEURO-QUEST-AI
```

### Step 2 — Install Dependencies

```bash
npm install
```

### Step 3 — Configure Gemini API

Create `.env.local` in the project root:

```env
GEMINI_API_KEY=your_gemini_api_key
```

Keep your API key private. Never expose it in frontend code or commit `.env.local` to GitHub.

### Step 4 — Install Vercel CLI

```bash
npm install -g vercel
```

### Step 5 — Start the Application

```bash
vercel dev
```

Open the local URL displayed in the terminal.

## 🔐 10 — SECURITY

- Gemini credentials are stored in server-side environment variables.
- Incoming API requests are validated.
- Generated puzzle data is checked before being returned.
- Four distinct answer options are required.
- Internal error details are not exposed directly to the frontend.
- Local environment files are excluded from Git tracking.

## 🧪 11 — TESTING AND RESULTS

| Verification | Result |
|---|---|
| Dependency validation | ✅ Passed |
| TypeScript and Vite production build | ✅ Passed |
| Oxlint | ✅ Zero warnings and errors |
| Git diff validation | ✅ Passed |
| Gemini API configuration | ✅ Verified |
| Production API | ✅ HTTP 200 |
| Generated puzzle response | ✅ Validated |
| AI Puzzle Lab browser testing | ✅ Completed |
| Core mission interaction | ✅ Tested |
| Production deployment | ✅ Successful |

**Verified production result:** The live Gemini puzzle-generation endpoint successfully returned a puzzle containing four answer choices, a hint, and an explanation.

## ☁️ 12 — PRODUCTION DEPLOYMENT

<p align="center">
  <a href="https://neuro-quest-ai.vercel.app/">
    <img src="https://img.shields.io/badge/NEURO_QUEST_AI-LIVE_ON_VERCEL-000000?style=for-the-badge&logo=vercel&logoColor=white" alt="Live on Vercel"/>
  </a>
</p>

- **Live Application:** https://neuro-quest-ai.vercel.app/
- **GitHub Repository:** https://github.com/snehassneha4578-collab/NEURO-QUEST-AI

The production application is hosted on Vercel with the Gemini API key configured as a sensitive server-side environment variable.

## 🔮 13 — FUTURE ENHANCEMENTS

- Adaptive difficulty based on player performance.
- Additional AI-generated puzzle categories.
- Player accounts and cloud progress synchronization.
- Global leaderboards and achievements.
- Multiplayer intelligence challenges.
- Advanced game analytics.
- More cryptography and reasoning missions.

---

## 🏁 14 — FINAL TRANSMISSION

![Animated Footer](https://capsule-render.vercel.app/api?type=waving&color=0:00D9FF,50:071B35,100:050816&height=160&section=footer&animation=fadeIn)

> **N.E.U.R.O. IS WAITING.**
>
> Your memory is your weapon.  
> Your logic is your shield.  
> Your intelligence is your escape.

<p align="center">
  <a href="https://neuro-quest-ai.vercel.app/">
    <img src="https://img.shields.io/badge/START_YOUR_MISSION-PLAY_NOW-00F7FF?style=for-the-badge" alt="Start your mission"/>
  </a>
</p>

<p align="center">
  **NEURO-QUEST-AI — THE INTELLIGENCE ESCAPE**
  
  *THINK. DECODE. SOLVE. ESCAPE.*
</p>
