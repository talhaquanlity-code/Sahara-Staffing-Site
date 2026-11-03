# Sahara Staffing Inc. — React + Vite Landing Page

A modern, high-performance React + Vite web application converted from the standalone Sahara Staffing landing page. Built with **React 18**, **Tailwind CSS**, **Lucide React**, **GSAP**, and **Lenis** smooth scrolling.

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```
The application will launch at `http://localhost:3000`.

### 3. Build for Production
```bash
npm run build
```

### 4. Preview Production Build
```bash
npm run preview
```

---

## 📁 Project Architecture & Components

```
├── public/
│   └── favicon.svg              # Brand faceted golden polyhedron icon
├── src/
│   ├── assets/                  # Static assets
│   ├── components/
│   │   ├── Articles.jsx         # "Our latest Articles" grid with hover zoom
│   │   ├── BentoGrowthCapital.jsx # 3-card bento grid with floating tags & balance counter
│   │   ├── Calculator.jsx       # Interactive revenue slider & real-time funding estimate
│   │   ├── CashflowWidget.jsx   # Hero interactive cashflow card with tab switching
│   │   ├── FAQ.jsx              # Expandable accordion with smooth height transition
│   │   ├── Footer.jsx           # Rounded obsidian footer with socials & multi-language switch
│   │   ├── Header.jsx           # Floating navigation pill, logo, mobile drawer
│   │   ├── Hero.jsx             # Hero section with cinematic portrait grading & GSAP entrance
│   │   ├── LogoMarquee.jsx      # Infinite seamless horizontal ticker with partner logos
│   │   ├── Modal.jsx            # Lead capture modal dialog with form fields
│   │   ├── NextGenPayment.jsx   # 2-column asymmetric payment section & cards
│   │   ├── SaharaLogo.jsx       # Reusable multi-faceted gold SVG logo
│   │   ├── SpeakToExperts.jsx   # Expert avatar stack & CTA
│   │   └── Toast.jsx            # Action toast notifications with auto-dismiss
│   ├── context/
│   │   └── UIContext.jsx        # Global modal & toast state management
│   ├── data/
│   │   ├── articlesData.js      # Blog / playbook cards data
│   │   ├── cashflowData.js      # Hero widget presets (weekly, monthly, yearly)
│   │   ├── faqData.js           # FAQ questions and answers
│   │   └── testimonialsData.js  # Quotes and founder profiles
│   ├── App.jsx                  # Main application orchestrator & smooth scroll setup
│   ├── index.css                # Tailwind base + custom animations & slider styling
│   └── main.jsx                 # React root mount
├── index.html                   # HTML entry point with Google Fonts
├── tailwind.config.js           # Sahara color palette & typography theme
├── vite.config.js               # Vite bundler configuration
└── package.json                 # Project scripts and dependencies
```

---

## ✨ Features Included
- **Modular Component Hierarchy**: Broken into clean, maintainable, single-responsibility React components.
- **Interactive State**:
  - Live revenue slider with real-time dynamic funding calculations.
  - Interactive Cashflow widget with Weekly / Monthly / Yearly tab switches and animated stacked bars.
  - Full FAQ accordion with active states and expand/collapse transitions.
  - Full-bleed founder testimonial carousel with smooth slide changes.
  - Global Modal and Toast notification system wired up via React Context (`useUI`).
  - Mobile-responsive drawer menu.
  - Multi-language switcher with feedback toasts.
- **Styling**: Tailwind CSS with custom Sahara Gold, Obsidian canvas, Slate Card, and soft lavender/slate palettes.
- **Lenis Smooth Scroll**: Buttery smooth hardware-accelerated scrolling.
- **GSAP Animations**: Fluid entrance timelines for hero elements and interactive cards.

