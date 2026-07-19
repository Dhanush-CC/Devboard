# DevBoard 🚀

DevBoard is a full-stack, enterprise-grade developer dashboard built with the MERN stack. It allows users to search for GitHub profiles, visualize their coding habits, generate AI-powered insights, and compare developers side-by-side. 

**Live Demo:** [Insert Your Vercel URL Here]

## ✨ Features

* **Real-Time Data Visualization:** Integrates with the GitHub API to fetch user data, repositories, and languages, visualizing them using dynamic `Recharts` (Pie and Bar charts).
* **AI-Powered Insights:** Leverages Google's Gemini AI to analyze a developer's tech stack and generate a comprehensive technical summary.
* **Side-by-Side Comparison:** A dedicated comparison tool that concurrently fetches multiple profiles and graphs their statistics head-to-head.
* **Secure Authentication:** Complete custom auth system using JSON Web Tokens (JWT) and bcrypt password hashing.
* **Persistent Bookmarking:** Logged-in users can save and remove favorite developer profiles to their personalized dashboard.
* **Smart Theming:** Fully integrated Light/Dark mode with local-storage persistence and zero-flash loading.
* **Enterprise-Ready Architecture:** Designed with isolated contexts, strict TypeScript typing, and modular routing.

## 🛠️ Tech Stack

**Frontend:**
* React (Vite)
* TypeScript
* Tailwind CSS
* React Router DOM
* Recharts (Data Visualization)
* Lucide React (Icons)
* Axios

**Backend:**
* Node.js
* Express.js
* MongoDB / Mongoose
* JSON Web Tokens (JWT)
* Bcrypt
* Google Gemini API

## 🚀 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine.

### Prerequisites
* Node.js installed
* A MongoDB database (local or MongoDB Atlas)
* A Google Gemini API Key

### Installation

1. **Clone the repository**
   ```bash
   git clone [https://github.com/yourusername/devboard.git](https://github.com/yourusername/devboard.git)
   cd devboard