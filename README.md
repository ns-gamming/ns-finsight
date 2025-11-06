# 🌐 NS Tracker — Smart Personal Finance Dashboard

[![Repo Size](https://img.shields.io/github/repo-size/ns-gamming/ns-tracker)](https://github.com/ns-gamming/ns-tracker)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](./LICENSE)
[![Vercel](https://img.shields.io/badge/Deploy-Vercel-black)](https://vercel.com/)
[![Built with React](https://img.shields.io/badge/Tech-React-blue)](#)
[![TypeScript](https://img.shields.io/badge/TS-TypeScript-3178c6)](#)

> **Short:** A fast, clean personal finance tracker — net worth, income, expenses, and savings analytics in a slick dashboard.

---

## 🚀 Live Preview
**Website:** https://ns-finance-tracker.vercel.app/

---

## ✨ What is NS Tracker?

NS Tracker is a lightweight, modern finance dashboard to track and visualize personal finances. It focuses on clarity and speed — showing net worth, monthly income/expense breakdowns, savings rate, and summary metrics with clean UI components.

Perfect for personal use, demos, or as a starter template to build a full finance app.

---

## 🔍 Key Features

- Net worth / assets & liabilities overview  
- Monthly income & expense breakdowns  
- Savings rate & historical averages  
- Fast, responsive UI (desktop / mobile)  
- TypeScript-first codebase for safer development  
- Tailwind CSS + shadcn-ui for modern components  
- Deploy-ready for Vercel (CI/CD friendly)
- Simple local dev setup & clear contribution flow

---

## 🧭 Project Structure (high level)

ns-tracker/ ├─ public/                 # static assets ├─ src/ │  ├─ components/          # reusable UI components │  ├─ pages/               # page-level views │  ├─ hooks/               # custom React hooks │  ├─ store/               # state management (if any) │  ├─ styles/              # Tailwind config + globals │  └─ utils/               # helpers, formatters ├─ .github/workflows/      # CI (tests / lint / build) ├─ package.json └─ README.md

---

## 🛠️ Local Development

```bash
# 1. Clone
git clone https://github.com/ns-gamming/ns-tracker
cd ns-tracker

# 2. Install (use npm or pnpm/yarn)
npm install

# 3. Dev server
npm run dev

# 4. Build
npm run build

# 5. Preview production build locally
npm run preview

Defaults: dev server on http://localhost:5173 (Vite default).


---

⚙️ Environment Variables

Create a .env file in project root (example):

VITE_API_URL=https://api.example.com
VITE_GOOGLE_ANALYTICS_ID=G-XXXXXXX
VITE_PUBLIC_KEY=your_public_key_here

> Keep secrets out of the repo. Use Vercel Environment Variables for deployment.




---

🧪 Tests & Linting

Add & run tests (if present):

# Run tests
npm run test

# Lint
npm run lint

Add Git hooks for linting with Husky if you want pre-commit checks.


---

📦 CI / CD (GitHub Actions example)

.github/workflows/ci.yml (example snippet — add to repo if you want):

name: CI

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Install Node
        uses: actions/setup-node@v4
        with:
          node-version: "20"
      - run: npm ci
      - run: npm run build
      - run: npm run test

Deploy automatically by connecting repo to Vercel (recommended) or GitHub Pages (static export).


---

📈 Deployment (Vercel)

1. Sign into Vercel and import the repo.


2. Set your environment variables in the Vercel dashboard.


3. Deploy — Vercel will run a production build and publish your app.




---

🧩 Example Usage (UI flows)

Add income/expense entries → view monthly and cumulative stats

Toggle date ranges to see historical savings rate

Export CSV (future enhancement) for offline analysis



---

🎯 Roadmap

Planned/optional features:

Authentication & multi-user support

CSV import/export for transactions

Charts with zoom & filtering (e.g., recharts)

Notifications & budgeting goals

Mobile app wrapper (Expo / React Native)


If you want to pick a feature from the roadmap and want help implementing it, I can draft the plan and PR for you.


---

🤝 Contributing

Thanks for helping improve NS Tracker! Please follow these simple steps:

1. Fork the repo and create a feature branch: git checkout -b feat/your-feature


2. Commit with clear messages (prefer conventional commits)


3. Open a PR against the main branch with a description and screenshots if UI changed


4. Add tests for new logic and run npm run test


5. Be respectful — follow the code of conduct




---

🧾 Code of Conduct

Be kind and respectful. Report issues or unacceptable behavior via GitHub issues.


---

🛠️ Troubleshooting

If build fails, check Node version (node -v) — use Node 18+ (or project-specified).

If the app loads blank, check console for missing env vars or API errors.

For CSS problems, rebuild Tailwind cache and confirm tailwind.config.js.



---

📸 Screenshots

nsgamming.xyz


---

🧑‍💻 About Me

Naboraj (Nishant) Sarkar — Developer & creator from Siliguri, West Bengal.

GitHub: https://github.com/ns-gamming

YouTube: https://youtube.com/@Nishant_sarkar

Email: nishant.ns.business@gmail.com



---

📜 License

This project is licensed under the MIT License — see LICENSE for details.


---

❤️ Credits & Use

If you use or modify this project, please give credit to Naboraj (Nishant) Sarkar — a link-back or mention is appreciated.
If you publish derivatives, a short shoutout in the README or project description goes a long way 🙌


---

⭐ Like this project?

Give it a star on GitHub and follow for updates!
