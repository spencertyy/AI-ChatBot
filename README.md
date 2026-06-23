# 🤖 AI Chat

A production-style AI chat web app built with **Next.js 16**, **React 19**, **Google Gemini 2.5 Flash**, and **OpenAI GPT-4o mini**.  
Designed to simulate the architecture and UX patterns used in real AI products like ChatGPT and Claude.

---

## ✨ Features

### Core Chat

- **Real-time streaming** — Chunk-by-chunk output via SSE (Server-Sent Events), with 40ms throttle on state updates
- **Multi-model support** — Switch between Gemini 2.5 Flash and GPT-4o mini; model selector shows provider icons and a checkmark on the active model
- **Multi-turn context** — Maintains conversation history with a sliding window (last 10 turns)
- **Stop generation** — Cancel mid-stream with `AbortController`
- **Regenerate** — Re-run the last AI response with one click

### Message UX

- **Edit messages** — Modify any past message and regenerate from that point (conversation branching)
- **Copy** — Copy message content or code blocks to clipboard
- **Reactions** — Like / dislike toggle with count display
- **Auto-scroll** — Always keeps the latest message in view
- **Token usage** — Displays input/output token counts per assistant message

### Markdown & Code

- Full **GitHub-Flavored Markdown** rendering (tables, lists, bold, inline code)
- **Syntax highlighting** with language detection
- **Colored language badges** — JS, TS, PY, HTML, CSS, etc.
- One-click **copy code** button with copied state feedback

### Conversation Management

- **Multi-conversation sidebar** — ChatGPT-style sidebar with search and conversation switching
- **Conversation rename** — Inline title editing via pencil icon
- **Mobile responsive** — Sidebar becomes an overlay drawer on small screens; `☰` button in header; tap outside to close

### Persistence

- Chat history persisted to **PostgreSQL** via REST API after stream ends
- Conversations and messages linked to authenticated user
- Full history restored on page refresh via server-side fetch
- **Unauthenticated users** — chat history saved to `localStorage` automatically; no login required to start chatting

### Design & UI

- **Floating header** — No solid header bar; the model selector and status / clear controls float over the chat surface
- **Glassmorphism composer** — Frosted-glass input with a gradient border ring that lifts (`translateY`) and glows on focus
- **Branded sidebar** — Gradient avatar + product name, a dedicated "New Chat" button above search, collapses to a rail
- **Purple ambient theme** — Soft brand-tinted glow cast from the top over deep near-black surfaces
- **Polished chat bubbles** — User bubbles with a tail corner, transparent assistant messages, gradient AI avatar
- **Design tokens** — Colors, radii, shadows and spacing centralized as CSS variables in `tokens.css`

---

## 🛠 Tech Stack

| Layer               | Tech                                        |
| ------------------- | ------------------------------------------- |
| Framework           | Next.js 16 (App Router)                     |
| Language            | TypeScript                                  |
| AI Models           | Google Gemini 2.5 Flash, OpenAI GPT-4o mini |
| Streaming           | Server-Sent Events (SSE)                    |
| Auth                | NextAuth.js v4 (Google OAuth)               |
| Database            | PostgreSQL + Prisma ORM                     |
| Markdown            | react-markdown + remark-gfm                 |
| Syntax Highlighting | react-syntax-highlighter (oneDark)          |
| Icons               | Font Awesome, Lucide React, icons8 CDN      |
| Styling             | Pure CSS with CSS Variables + Tailwind 4    |
| Testing             | Jest + React Testing Library                |
| Containerization    | Docker (multi-stage) + Docker Compose       |

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database
- [Google AI Studio](https://aistudio.google.com) API key (for Gemini)
- OpenAI API key (for GPT-4o mini)
- Google OAuth credentials (for authentication)

### Installation

```bash
git clone https://github.com/spencertyy/AI-ChatBot.git
cd AI-ChatBot/typescript
npm install
```

### Environment Variables

Create a `.env.local` file in the `typescript/` directory:

```
GEMINI_API_KEY=your_gemini_key
OPENAI_API_KEY=your_openai_key
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000
DATABASE_URL=postgresql://your_connection_string
```

### Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 🐳 Run with Docker

The entire stack — app **and** PostgreSQL — runs with a single command. No local Node or Postgres install required, only Docker.

```bash
# 1. Create your env file from the template, then fill in your keys
cp .env.docker.example .env.docker

# 2. Build images, start the DB, run migrations, launch the app
docker compose up -d --build
```

Open [http://localhost:3000](http://localhost:3000).

What `docker compose up` orchestrates:

| Service   | Image                 | Role                                                       |
| --------- | --------------------- | --------------------------------------------------------- |
| `db`      | `postgres:16-alpine`  | PostgreSQL; data persisted in the `pgdata` volume         |
| `migrate` | builder stage         | Runs `prisma migrate deploy` once, then exits             |
| `web`     | runner stage (~317MB) | Next.js app (standalone output), served on port 3000      |

Startup is gated by health checks — **db healthy → migrations applied → app starts** (`service_completed_successfully`) — so the app never boots against an unmigrated database.

Common commands:

```bash
docker compose logs -f web   # tail app logs
docker compose down          # stop (keeps DB data)
docker compose down -v       # stop + wipe the database volume
```

### Pull the prebuilt image

The runtime image is published to Docker Hub:

```bash
docker pull spencertu/ai-chat:1.0
```

> Built with a multi-stage Dockerfile (deps → `prisma generate` + `next build` → minimal **non-root** runtime via Next.js `output: "standalone"`), cutting the image from ~1 GB to ~317 MB. Secrets are injected at runtime via `env_file` — never baked into the image.

---

## 📁 Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── auth/[...nextauth]/route.ts   # NextAuth handler
│   │   ├── chat-stream/route.ts          # SSE streaming endpoint (Gemini + OpenAI)
│   │   └── conversations/
│   │       ├── route.ts                  # GET list, POST create
│   │       └── [id]/
│   │           ├── route.ts              # DELETE, PATCH title
│   │           └── messages/route.ts     # POST save messages
│   ├── components/
│   │   ├── AuthButton.tsx                # Google login/logout UI
│   │   ├── CodeBlock.tsx                 # Syntax highlighted code blocks
│   │   ├── InputArea.tsx                 # Chat input (attach / image / send)
│   │   ├── ModelSelector.tsx             # Model selector dropdown (used in header)
│   │   ├── MarkDownRenderer.tsx          # Markdown rendering
│   │   ├── MessageList.tsx               # Message list + action buttons
│   │   └── Sidebar.tsx                   # Conversation list sidebar
│   ├── hooks/
│   │   └── useChat.ts                    # All chat logic (custom hook)
│   ├── lib/
│   │   ├── localStorageChat.ts           # localStorage read/write for unauthenticated users
│   │   └── pricing.ts                    # Per-model token cost calculation
│   ├── types/
│   │   └── chat.ts                       # Message, Conversation types
│   ├── globals.css                        # All styles (CSS variables)
│   ├── tokens.css                         # Design tokens (colors, radius, shadows)
│   └── page.tsx                           # Root page
```

> Test files (`*.test.ts(x)`) are co-located next to the code they cover. Jest config lives in `jest.config.mjs` + `jest.setup.ts` at the project root.

---

## 🏗 Architecture

### Streaming Flow

```
User input → POST /api/chat-stream
           → Gemini or OpenAI streaming SDK
           → SSE chunks → TextDecoder → buffer parsing
           → 40ms throttled state updates → UI render
           → [DONE] + usage metadata → finalize message
           → POST /api/conversations/[id]/messages
```

### Conversation Branching

Editing a past message removes all subsequent responses and rebuilds  
the conversation context from the edited point — the same pattern used in ChatGPT.

---

## 🧪 Testing

Unit tests with **Jest** + **React Testing Library**, wired up through `next/jest`.

| Suite                        | Layer         | Covers                                              |
| ---------------------------- | ------------- | --------------------------------------------------- |
| `pricing.test.ts`            | Pure function | Cost calculation, unknown-model fallback            |
| `localStorageChat.test.ts`   | Data layer    | Save / load / delete + test isolation               |
| `ModelSelector.test.tsx`     | Component     | Render, menu open, model-select callback            |
| `InputArea.test.tsx`         | Component     | Typing, Enter-to-send, send button (module mock)    |
| `useChat.test.ts`            | Hook          | Reaction state logic via `renderHook` + `act`       |

```bash
npm test            # run once
npm run test:watch  # watch mode
```

Philosophy: test logic that can break (pure functions, data layer, interactive components, hooks) — not pure presentation, config, or types.

---

## 📌 Planned

### Auth & Data

- [✔️] User authentication — login / signup with session management
- [✔️] Database integration — persist conversations server-side (e.g. PostgreSQL + Prisma)

### AI Features

- [ ] RAG (Retrieval-Augmented Generation) — attach documents and query over them
- [✔️] Token usage tracking — display input/output token counts per message

### UX & Platform

- [ ] Add demo GIF to README (record streaming + code highlight flow)
- [✔️] Sidebar with multiple conversations
- [✔️] Conversation rename — inline editing via pencil icon
- [ ] Image upload (Gemini multimodal)
- [ ] File upload support
- [✔️] Multi-model support (OpenAI / Gemini switchable)
- [✔️] Mobile optimization — responsive sidebar drawer, touch-friendly buttons, adaptive spacing
- [✔️] UI redesign — floating header, glass composer, branded sidebar, purple ambient theme
- [✔️] Unit tests — Jest + React Testing Library
- [✔️] Dockerized — multi-stage build + `docker compose` (app + Postgres), image published to Docker Hub
- [ ] Theme toggle (light / dark)

---

## 📄 License

MIT
