# 🌾 AI Agri-Advisor  For Farmer Support
### Decentralizing Agricultural Expertise through Generative AI  

AI Agri-Advisor is a bilingual AI-powered agricultural advisory web application that provides personalized government scheme recommendations to farmers using Google Gemini (LLM).

This project bridges the knowledge gap in Indian agriculture by delivering context-aware, Tamil & English scheme guidance in a simple and accessible interface.

---

## 📌 Problem Statement

Indian agriculture depends heavily on government schemes, subsidies, and welfare programs. However, many farmers are unable to access these benefits due to:

- Complex government websites  
- Lack of digital literacy  
- Language barriers (English-heavy portals)  
- No personalized recommendation systems  
- Dependence on middlemen  

As a result, eligible farmers often miss financial support, insurance schemes, and crop-related benefits.

AI Agri-Advisor solves this issue using Generative AI to provide structured, personalized recommendations based on farmer profile data.

---

## 🧠 System Overview

The application uses a decoupled architecture separating frontend UI from AI logic.

### End-to-End Data Flow

Farmer Input (React UI)  
→ Structured JSON Profile  
→ geminiService.ts (Prompt Engineering Layer)  
→ Google Gemini API  
→ Structured JSON Response  
→ Dynamic UI Rendering  

The AI is controlled using strict system prompts to ensure:

- Verified scheme suggestions  
- Structured JSON output  
- No conversational filler  
- Bilingual response generation  

---

## 🛠️ Tech Stack

- **Frontend:** React 19 (Functional Components + Hooks)  
- **Language:** TypeScript  
- **Styling:** Tailwind CSS  
- **Build Tool:** Vite  
- **AI Model:** Google Gemini 3 Flash  
- **API Library:** @google/genai  
- **Development Environment:** Visual Studio Code  

---

## ✨ Key Features

- ✅ Personalized Scheme Recommendation  
- ✅ Bilingual Support (English & Tamil)  
- ✅ AI-Powered Natural Language Understanding  
- ✅ Structured JSON Output  
- ✅ Mobile-First Responsive Design  
- ✅ Fast Response Time (Low Latency Model)  
- ✅ Secure API Key Handling  

---

## 📂 Project Structure

```
FARMER_SUPPORT/
│
├── src/
│   ├── services/
│   │   └── geminiService.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
│
├── img/
├── node_modules/
├── .env
├── package.json
├── package-lock.json
├── tsconfig.json
├── vite.config.ts
└── index.html
```

### Important Files

- **geminiService.ts**  
  Handles AI prompt engineering and communication with Google Gemini API.

- **App.tsx**  
  Manages user interface, farmer input collection, and response rendering.

- **main.tsx**  
  Entry point of the React application.

- **.env**  
  Stores the Gemini API key securely (not committed to GitHub).

---

## 🔐 Security & Ethical AI

- API keys are stored securely using `.env`
- `.env` is excluded via `.gitignore`
- No farmer data is permanently stored
- AI responses are restricted using strict system prompts
- Designed to assist farmers, not replace official government sources

---

## ⚙️ Installation & Setup

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/jeevaa006/FARMER_SUPPORT.git
cd FARMER_SUPPORT
```

### 2️⃣ Install Dependencies

```bash
npm install
```

### 3️⃣ Add Environment Variable

Create a `.env` file in the root directory and add:

```
VITE_GEMINI_API_KEY=your_api_key_here
```

### 4️⃣ Run Development Server

```bash
npm run dev
```

The application will start at:

```
http://localhost:5173
```

---

## 📦 Production Build

To generate optimized build files:

```bash
npm run build
```

To preview production build locally:

```bash
npm run preview
```

---

## 🌍 Deployment

This project can be deployed to:

- Vercel  
- Netlify  
- Render  
- Any static hosting platform  

---

## 🔮 Future Enhancements

- Voice input using Speech-to-Text (Tamil)
- WhatsApp Bot integration
- Official Government API integration
- Crop disease detection using Computer Vision (CNN)
- Multi-language expansion beyond Tamil
- Offline mode for rural connectivity limitations

---

## 👨‍💻 Developer

**Jeevanantham K**  
B.Tech – Artificial Intelligence & Data Science  
Academic Year: 2025–2026  

---

## 📜 License

This project is developed for academic, research, and educational purposes.

---

⭐ If you found this project useful, feel free to star the repository.
