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
 
## 🌟 Milestone 3: Progress & Team Contributions
 
The project was developed collaboratively, with each team member contributing to both frontend and backend development while taking primary responsibility for specific modules. Regular communication and integration of completed work ensured that all system components functioned together successfully.
 
### 👤 R.G. Gunawardana (E/22/124)
- **Backend Infrastructure:** Primarily responsible for developing the backend routing infrastructure, including implementing and configuring API routes that connect the frontend with the database.
- **Testing & Quality Assurance:** Carried out extensive API testing using Postman to verify data flow, validate responses, and identify edge cases.
- **Frontend UI:** Designed and implemented UI components to improve the usability and overall user experience of the web application.
### 👤 W.M.S. Manujitha (E/22/228)
- **Exploration & Discovery:** Developed the travel exploration and discovery modules, including advanced search and dynamic filtering for hotels and vehicles using MongoDB aggregation pipelines.
- **UX Enhancements:** Built the experience pages with user-friendly features such as infinite scrolling, asynchronous loading states, and efficient pagination.
- **Real-Time Currency Conversion:** Implemented a currency conversion feature to allow international tourists to easily view prices in their preferred currencies.
### 👤 D.F.A.T.D. Mathangadeera (E/22/232)
- **Backend Architecture:** Led the design of the backend structure, developed RESTful APIs, and managed database interactions essential for system functionality.
- **AI Integration:** Conducted research on AI technologies and successfully integrated an AI chatbot into the system to provide automated, real-time travel assistance and answer user queries.
### 👤 Y.M.C.J. Yagabamunu (E/22/452)
- **Route Planning & Mapping:** Developed the route planning and interactive map module utilizing the Google Maps API.
- **Authentication & Notifications:** Implemented secure user login, OTP-based email verification, and password recovery. Integrated automated email notifications using Nodemailer and developed a notification synchronization feature in the admin dashboard.
- **System Validation & Version Control:** Built the booking availability validation system, managed provider functionalities, and maintained a stable codebase by resolving Git merge conflicts and integrating project modules.
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
 
## 👥 Project Team
 
**31 - Team NextDev**
