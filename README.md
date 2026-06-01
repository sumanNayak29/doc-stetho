# 🩺 DocStetho

> A premium, high-fidelity healthcare platform for patient data management and real-time ICU bedside telemetry monitoring.

[![Live Demo](https://img.shields.io/badge/Live-Demo-brightgreen?style=flat-square)](https://doc-stetho.vercel.app)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-6-646CFF?style=flat-square&logo=vite)](https://vitejs.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-06B6D4?style=flat-square&logo=tailwindcss)](https://tailwindcss.com)

🔗 **[Live Demo → https://doc-stetho.vercel.app](https://doc-stetho.vercel.app)**

---

## 📌 About

DocStetho is a unified medical professional workstation built as a single-page React application. It consolidates patient record management, consultation scheduling, performance analytics, and live ICU telemetry into one cohesive interface.

The standout technical centerpiece is a custom **HTML5 Canvas rendering engine** that simulates real-time bedside oscilloscope waveforms — ECG (Lead III), Arterial Blood Pressure, and Capnography — using vector math and animation frame loops, with no third-party charting libraries involved.

---

## 🚀 Key Features

- **🔒 Flexible Authentication** — Form-based login with smart email-to-name extraction, plus full **Google OAuth** integration via `@react-oauth/google`.
- **📈 Live ICU Telemetry Monitor** — Real-time oscilloscope waveforms (ECG, ABP, PLETH) rendered directly on an **HTML5 Canvas** with sweeping animations and fluctuating digital readouts (HR, BP, SpO2, etCO2, Temp).
- **📂 Patient Directory** — Searchable, filterable, and sortable patient table with status indicators (`Stable`, `Critical`, `Recovering`), priority flags, and live Heart Rate severity sorting.
- **👤 Patient Profile Drawer** — Avatar upload with base64 encoding, cached to `localStorage` for persistence.
- **🗓 Appointment & Schedule Manager** — Mark consultations as Attended or Rejected, with statuses persisted globally across sessions via Zustand.
- **📊 Performance Analytics** — Recovery rates, consultation durations, satisfaction ratings, admission trends, and condition distribution — all visualized with custom Canvas charts.
- **⚙️ Settings Panel** — Doctor preferences including critical vital alerts, email notifications, and offline mode toggles.

---

## 🛠 Tech Stack

| Category | Technology |
|---|---|
| **Core** | React 19, TypeScript, Vite |
| **Styling** | Tailwind CSS v4 (HSL color system, custom grid layouts) |
| **State Management** | Zustand v5 (bounded slice architecture with `persist` middleware) |
| **Visualizations** | HTML5 Canvas API (custom vector math oscilloscope engine) |
| **Authentication** | `@react-oauth/google` (Google OAuth 2.0) |

> **Why Zustand over Redux?** The bounded slice pattern (`AuthSlice + AppointmentsSlice + PatientsSlice` → single store) gave us Redux-like separation of concerns with a fraction of the boilerplate, and the `persist` middleware handled localStorage serialization out of the box.

---


## 💻 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18+
- `npm` or `yarn`

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/sumanNayak29/doc-stetho.git
cd doc-stetho/doc-stetho

# 2. Install dependencies
yarn install

# 3. Configure environment variables
cp .env.example .env
# Add your Google OAuth Client ID:
# VITE_GOOGLE_CLIENT_ID=your_client_id.apps.googleusercontent.com

# 4. Start the dev server
yarn dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 👨‍⚕️ Demo Accounts

You can log in with any email/password (the app derives a doctor name from your email prefix), or use one of the mock credentials:

| Doctor | Email | Specialty |
|---|---|---|
| Dr. Gregory House | `g.house@docstetho.com` | [PASSWORD] | Diagnostic Medicine |
| Dr. Stephen Strange | `s.strange@docstetho.com` | [PASSWORD] | Neurosurgery |
| Dr. Helen Cho | `h.cho@docstetho.com` | [PASSWORD] | Genetics & Biotech |
| Dr. Meredith Grey | `m.grey@docstetho.com` | [PASSWORD] | General Surgery |
| Dr. Dana Scully | `d.scully@docstetho.com` | [PASSWORD] | Pathology |

---

## 🚢 Deployment

### Vercel (Recommended)

1. Connect your GitHub repo to [Vercel](https://vercel.com).
2. Add `VITE_GOOGLE_CLIENT_ID` under **Project → Settings → Environment Variables**.
3. Add your Vercel domain to **Authorized JavaScript Origins** in [Google Cloud Console](https://console.cloud.google.com/apis/credentials).
4. Vercel handles the SPA fallback automatically — no `vercel.json` config needed for this setup.

### Other Platforms

For Netlify, add a `_redirects` file in `/public`:
```
/*   /index.html   200
```

For Nginx:
```nginx
location / {
    try_files $uri $uri/ /index.html;
}
```

---

## 🧠 Challenges & Learnings

**Canvas oscilloscope rendering** was the most complex part of this project. Building a real-time sweeping waveform that mimics actual ICU monitors required implementing a custom animation loop using `requestAnimationFrame`, maintaining a rolling data buffer, and applying vector math to simulate physiologically accurate waveform shapes (P-QRS-T complex for ECG, dicrotic notch for ABP). Getting smooth, jitter-free rendering at 60fps while simultaneously updating multiple channels was a significant performance challenge — solved by isolating each waveform to its own Canvas context and carefully managing draw boundaries.

**Zustand's bounded slice pattern** was a deliberate architectural decision. As the store grew to cover auth, patients, and appointments, keeping slices composable yet unified via a single `persist`-wrapped store required careful typing and selector optimization using `useShallow` to prevent unnecessary re-renders.

---

## 🔒 Security Notes

- Patient states and session data are persisted via Zustand's `localStorage` middleware.
- For production medical deployments, `localStorage` should be encrypted or replaced with an authenticated server-side session store to align with HIPAA requirements.

---

## 📄 License

MIT License © [Suman Nayak](https://github.com/sumanNayak29)