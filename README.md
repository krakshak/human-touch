**Live Demo**: https://humanizer-demo-app.windsurf.build/

# Getting Started with Humanizer App

A web application for transforming AI-generated or robotic text into natural, human-sounding writing using advanced AI models. The app manages user credits, project history, and supports file imports for seamless workflow.

---

## Table of Contents
- [Pages & Functionality](#pages--functionality)
- [Tech Stack](#tech-stack)
- [Setup & Usage](#setup--usage)
- [Deployment](#deployment)

---

## Pages & Functionality

### Home (`/`)
- **Input & Output:** Enter text to be "humanized" and view the result.
- **Modes:** Choose between API mode (live credits) or Demo mode.
- **Credits Tracker:** Shows credits left and total credits used.
- **Import:** Automatically loads text imported from Dashboard uploads.
- **Buy Credits:** Button to purchase more credits.

### Dashboard (`/dashboard`)
- **Project History:** View all previously humanized texts.
- **File Uploads:** Upload documents and import their contents to the Home page for humanization.
- **Import to Humanizer:** Button for each upload to send its content to the Home page input.
- **Credits Overview:** See your credits usage and history.

### Pricing (`/pricing`)
- **Plan Information:** View available credit packages and pricing.
- **Purchase:** Link to payment page.

### Payment (`/payment`)
- **Checkout:** Complete payment for more credits.

### Login / Signup (`/login`, `/signup`)
- **Authentication:** Register or log in to your account.

### Contact (`/contact`)
- **Support:** Contact form for user support or feedback.

---

## Tech Stack

### Frontend
- **React** (Create React App)
- **CSS** (custom styles)
- **React Router** (page navigation)

### Backend
- **Supabase** (user authentication, database for credits, projects, and history)
- **Undetectable AI API** (for humanizing text)

### Deployment
- **Netlify** (static site hosting and CI/CD)
- **windsurf.build** (Netlify integration for automated deployments)

---

## Setup & Usage

1. **Install dependencies:**
   ```sh
   npm install
   ```
2. **Configure secrets:**
   - Copy `src/secrets.js.example` to `src/secrets.js` and fill in your API keys.
   - Set up your Supabase project and update credentials in `src/supabaseClient.js`.
3. **Run locally:**
   ```sh
   npm start
   ```
   The app will be available at [http://localhost:3000](http://localhost:3000).
4. **Build for production:**
   ```sh
   npm run build
   ```

---

## Deployment

- The app is configured for Netlify deployment. Use the `netlify.toml` for build settings.
- Deploy manually via Netlify UI or use CLI:
  ```sh
  npm install -g netlify-cli
  netlify deploy
  ```
- Or use the automated deployment via windsurf.build (see project instructions).

---

## Notes
- Make sure to set all required environment variables (API keys, Supabase credentials) in Netlify for production.
- Credits and user data are managed securely in Supabase.
- For any issues or contributions, please open an issue or pull request.
