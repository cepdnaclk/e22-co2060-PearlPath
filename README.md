# Pearl Path – Sri Lankan Tourism Support Platform

A centralized digital travel support platform designed to simplify travel planning in Sri Lanka by integrating hotels, attractions, tour guides, and vehicle services into a single system.

This project is developed using the **MERN stack (MongoDB, Express, React, Node.js)** as part of an academic software project.

---

## 📌 Project Description

Tourists visiting Sri Lanka often face challenges because they must use multiple disconnected platforms to plan their trips. This leads to confusion, unreliable information, and potential safety risks.

**Pearl Path** solves this problem by providing a single unified digital platform that brings together verified travel services.

The system provides:

- Centralized search for hotels and attractions  
- Real-time route planning with map integration  
- Verified tour guide and transport listings  
- Safe and reliable travel information  
- User-friendly travel planning experience  

The platform is designed as a **web-based application** following a **three-tier architecture**.

---

## 🧱 High-Level Architecture

The system follows a **three-tier architecture**:

### Frontend
- React-based responsive web application  
- Provides interactive UI/UX for users  

### Backend
- Node.js with Express.js  
- Handles REST APIs, authentication, and business logic  

### Database
- MongoDB for storing:
  - Service provider listings  
  - Reviews and ratings  
  - User profiles  

### External Integrations
- Google Maps API for:
  - Geolocation services  
  - Route planning  
  - Distance calculation  
  - Attraction search  

---

## ⚙️ Technology Stack

- **Frontend:** React  
- **Backend:** Node.js, Express.js  
- **Database:** MongoDB  
- **Maps & Geolocation:** Google Maps API  
- **Version Control:** Git & GitHub  

---


## 📁 Repository Structure (Initial)

```
root/
│
├── code/
├── docs/
└── README.md
```

> The folder structure will be expanded as development progresses.

---





## 🚀 Getting Started

### Clone Repository

```bash
git clone <repository-url>
cd pearl-path
```

### ⚠️ A Crucial Warning About Security (Read This First!)
Before running any Git commands, open your `.gitignore` file in your root backend folder. Make sure it contains a line that says `.env`.

**Never commit your raw `.env` file to GitHub.** If your app-specific passwords or email credentials leak onto a public GitHub repository, malicious bots can scrape them within seconds to send spam, which could get your email account banned. Keeping `.env` in your `.gitignore` ensures only the underlying code changes are pushed, while your private credentials stay safely on your local machine.

### Step 1: Create the `.env` file from `.env.example`
In your `code/backend/` folder, create a new text file named `.env` based on the `.env.example` template:

```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-specific-password
EMAIL_FROM="PearlPath Support" <your-email@gmail.com>
```

---

## Project Team

31 - Team NextDev




