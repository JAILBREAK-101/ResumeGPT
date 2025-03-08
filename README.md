# ResumeGPT - AI-Powered Resume Parser

[![GitHub license](https://img.shields.io/github/license/GenixTech/ResumeGPT)](https://github.com/GenixTech/ResumeGPT/blob/main/LICENSE)
[![GitHub issues](https://img.shields.io/github/issues/GenixTech/ResumeGPT)](https://github.com/GenixTech/ResumeGPT/issues)
[![GitHub stars](https://img.shields.io/github/stars/GenixTech/ResumeGPT)](https://github.com/GenixTech/ResumeGPT/stargazers)
[![Contributions welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg)](https://github.com/GenixTech/ResumeGPT/blob/main/CONTRIBUTING.md)

## 📌 Overview
**ResumeGPT** is an AI-powered resume parser that extracts key information from resumes (PDF/DOCX) and structures it into JSON format. It helps recruiters, HR professionals, and job seekers to process resumes efficiently.

## 🚀 Features
- ✅ Upload resumes (PDF/DOCX)
- ✅ Extracts Name, Email, Phone, Skills, Experience, and Education
- ✅ Multiple export formats:
  - JSON (API & Download)
  - PDF (ATS-friendly format)
  - DOCX (Formatted resume)
  - XML (Structured data)
  - CSV (Spreadsheet-compatible)
  - Markdown (Documentation-friendly)
  - HTML (Web-ready format)
- ✅ Download parsed data as JSON
- ✅ Simple UI for uploading & viewing results
<!-- - ✅ Deployable on Vercel (Frontend) & Render/Fly.io (Backend)  -->

## 🛠️ Tech Stack
- **Frontend:** Next.js, TailwindCSS
- **Backend:** Node.js (Express.js)
- **Database:** MongoDB (Optional for history tracking)
- **AI Processing:** OpenAI API (or NLP libraries like `compromise` or `natural`)
- **File Handling:** Multer for file uploads

## 📂 Project Structure
```
ResumeGPT/
│── frontend/ (Next.js UI)
│── backend/ (Node.js & Express API)
│── models/ (Mongoose Schema for saving data)
│── routes/ (API endpoints)
│── uploads/ (Temporary file storage)
│── .env (Environment variables)
│── package.json (Dependencies)
│── README.md (Project guide)
```

## 🔧 Installation & Setup
### 1️⃣ Clone the Repository
```bash
git clone https://github.com/yourusername/resumegpt.git
cd resumegpt
```

### 2️⃣ Setup Backend
```bash
cd backend
npm install
```

Create a `.env` file and add:
```
PORT=4000
OPENAI_API_KEY=your_openai_api_key
MONGO_URI=your_mongodb_connection_string (optional)
```

Start backend:
```bash
npm start
```

### 3️⃣ Setup Frontend
```bash
cd ../frontend
npm install
npm run dev
```

## 🚀 API Endpoints
### **1. Upload Resume & Extract Data**
**POST** `/api/upload`
- **Request:** Upload a resume file
- **Response:** JSON object with parsed details

### **2. Get Processed Resumes (if using DB)**
**GET** `/api/resumes`
- **Response:** List of previously processed resumes

## 📌 Deployment
- **Frontend:** Deploy on Vercel
- **Backend:** Deploy on Render/Fly.io

## 🔥 Contributing
Want to improve ResumeGPT? Feel free to fork the repo, make changes, and create a pull request!

## 📝 License
MIT License

