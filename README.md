# Bazar.af - Kabul's Trusted Local Marketplace

Bazar.af is a modern, mobile-first e-commerce platform designed specifically for the local market in Kabul, Afghanistan. It connects local sellers with buyers, featuring multi-language support (Dari, Pashto, English), real-time inventory, and a seamless shopping experience.

## Features

- **Multi-Language Support**: Full RTL support for Dari (fa) and Pashto (ps), alongside English (en).
- **Seller Dashboard**: Comprehensive tools for sellers to manage products, view revenue charts (Recharts), and process orders.
- **Shopify-style Onboarding**: Multi-step seller registration with map pins and Tazkira (National ID) upload placeholders.
- **Amazon-style Buyer Experience**: Advanced product discovery, multi-image zoom/swipe, and a slide-up cart.
- **Firebase Backend**: Ready for Firebase Auth, Firestore, and Storage.
- **PWA Ready**: Built to be installable as a Progressive Web App.

## Tech Stack

- **Frontend**: React 19, Vite (mimicking Next.js App Router structure)
- **Styling**: Tailwind CSS v4, shadcn/ui components
- **Animations**: Framer Motion v11
- **State Management**: Zustand
- **Routing**: React Router DOM
- **i18n**: i18next, react-i18next
- **Backend/BaaS**: Firebase SDK v10

## Getting Started

### 1. Firebase Setup
1. Go to the [Firebase Console](https://console.firebase.google.com/) and create a new project.
2. Enable **Authentication** (Phone + Email/Password).
3. Enable **Firestore Database** and **Storage**.
4. Copy your Firebase configuration and update `firebase-applet-config.json` (or `.env.local` if you migrate to Next.js).

### 2. Installation
```bash
npm install
```

### 3. Development Server
```bash
npm run dev
```
The app will be available at `http://localhost:3000`.

### 4. Deployment (Vercel)
This project is ready to be deployed on Vercel.
1. Push your code to a GitHub repository.
2. Connect the repository to Vercel.
3. Vercel will automatically detect the Vite build settings.
4. Add your Firebase configuration as Environment Variables in Vercel.
5. Deploy!

## Seed Data
The application comes pre-seeded with realistic mock data for shops and products in Kabul (see `src/lib/seedData.ts`). This includes shops like "Rasool Zada Carpets" and "Parwan Fresh Groceries".

## License
MIT
