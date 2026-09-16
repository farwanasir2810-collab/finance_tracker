# Finora 🌸 — Cute Aesthetic Personal Finance & Habit Vault

> **Finora** is a recruiter-ready **Aesthetic Financial Operating System** that blends cute Pinterest soft-girl aesthetics (marshmallow cream, pastel pink, rose & lavender) with senior-level executive financial depth and interactive engineering features.

---

## 🌟 Key Features & Capabilities

- 🌸 **3-Layer Sequenced Header Navigation Hub**:
  - Live API Connection Ticker Ribbon (`🟢 Port 4000 Active`, total entries count, net vault balance).
  - 8 Connected Workspace Tabs: `Aesthetic Dashboard`, `Transactions Ledger`, `Daily Mood Vibe`, `Category Insights`, `Dream Wishlists`, `Recurring Bills`, `Wealth Simulator`, and `Recruiter Showcase`.

- 🌍 **Multi-Currency Live Engine**:
  - Real-time rate switching across **USD ($)**, **EUR (€)**, **GBP (£)**, and **PKR (Rs)**.

- 🌸 **Daily Spending Mood & Vibe Diary**:
  - Log daily spending vibes (`🌸 Mindful`, `🛍️ Shopping Therapy`, `☕ Cozy Cafe`, `💅 Self Care`, `💖 Saving Queen`) with positive reflection quotes and a **5-Day Vibe Streak Counter**.

- 🤖 **AI Vibe & Wealth Intelligence**:
  - Algorithmic financial advisor detecting spend velocity, burn rate warnings, and liquidity cushion recommendations.

- 📊 **Financial Health Score (0-100)**:
  - Circular stability index ring + average daily spend + projected month-end surplus forecast.

- 💖 **Dream Wishlists & Savings Vault**:
  - Target goal cards (Macbook Setup, Paris Vacation, Designer Wardrobe) with target progress rings and 1-tap deposit popovers.

- 📋 **Paginated Audit Ledger & CSV Exporter**:
  - Ant Design data table (10 items/page), multi-column sorting, category search, type & date range filters, inline edit modal, popconfirm deletion, and 1-click CSV file export (`Finora_USD_...csv`).

- 🌱 **Compound Wealth & Investment Simulator**:
  - Interactive compound growth calculator with sliders for deposits, return %, and 1–30 year projections.

- ⭐ **Recruiter Technical Showcase**:
  - Architectural overview modal highlighting React 18, Express REST API, CORS security, state management, and performance benchmarks.

---

## 🛠️ Tech Stack

### Frontend Application
- **Framework**: React 18 + Vite (Sub-400ms HMR builds)
- **UI System**: Ant Design 5 (`ConfigProvider` Token Providers) + Tailwind CSS Glassmorphism
- **Iconography**: FontAwesome Free Solid Icons (`@fortawesome/react-fontawesome`)
- **Utilities**: Day.js, Axios

### Backend REST API Layer
- **Runtime**: Node.js + Express REST API (Port 4000)
- **Data Engine**: Local Data Provider & Schema Validation
- **Middleware**: CORS, JSON Body Parser, Error Middleware Stack

---

## 🚀 Quick Start & Local Development

### Prerequisites
- Node.js (v18.x or higher)
- npm (v9.x or higher)

### 1. Clone Repository & Setup
```bash
git clone https://github.com/laraib988/finance-tracker.git
cd finance-tracker
```

### 2. Start Backend API Server
```bash
cd Api
npm install
node index.js
```
*API Server will start on `http://localhost:4000`* 🟢

### 3. Start Frontend Application
```bash
cd ../FrontEnd
npm install
npm start
```
*Frontend will launch on `http://localhost:3000`* 🌸

---

## 📦 Production Deployment & Build

To generate an optimized production bundle:

```bash
cd FrontEnd
npx vite build
```

This compiles all 1,514+ modules into optimized static production chunks inside `FrontEnd/dist/`.

### Deployment Options:
- **Vercel / Netlify**: Deploy `FrontEnd/dist/` as a static SPA (Single Page Application).
- **Render / Railway**: Deploy `Api` Node.js server and connect frontend via API environment variable.

---

## 📑 RESTful API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/transactions` | Fetch all logged transactions (supports `type`, `category`, `startDate`, `endDate` query params) |
| `POST` | `/api/transactions` | Create a new transaction entry |
| `PUT` | `/api/transactions/:id` | Update an existing transaction by ID |
| `DELETE` | `/api/transactions/:id` | Delete a transaction by ID |

---

## 📄 License & Credits

Created with 💖 by **Laraib** as a cute Pinterest aesthetic finance & habit operating system.
