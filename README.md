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
 
### 👤 D.F.A.T.D. Mathangadeera (E/22/232)
- Backend Architecture
- REST APIs
- AI Chatbot

### 👤 W.M.S. Manujitha (E/22/228)
- Discovery Modules
- Search Aggregation
- UI/UX Design
- Currency Conversion

### 👤 R.G. Gunawardana (E/22/124)
- Routing Infrastructure
- Postman API Testing
- Frontend Integration

### 👤 Y.M.C.J. Yagabamunu (E/22/452)
- Interactive Map Module
- Authentication / OTP
- Booking Validation
- Git Branching Strategy
---
 
## 🎯 Milestone 4: Comprehensive System Testing

Testing was performed across multiple levels, employing both automated scripts and manual evaluation, resulting in **158 passed test cases across 11 suites**.

### 1. Unit Testing (Jest)
- Validated individual components in isolation using the **AAA (Arrange, Act, Assert)** pattern.
- Implemented robust unit tests for all major database models (`User.js`, `Booking.js`, `Hotel.js`, `Vehicle.js`, etc.).
- Verified Mongoose schema validation, default assignments, Enum enforcement, and Bcrypt password hashing logic.

### 2. Integration Testing (Jest & Supertest)
- Verified the interaction between REST API endpoints, the database, and third-party services.
- Extensively tested the `/api/login` endpoint against 100+ edge cases (missing fields, invalid formats, unauthenticated requests).
- Utilized **Test Doubles (Mocking)** for external dependencies like the Gemini AI Trip Planner to ensure deterministic and fast execution without hitting API rate limits.

### 3. API Testing (Postman)
- Executed manual end-to-end API validations.
- Verified accurate status codes (200, 400, 401, 404, 500) and response structures.
- Tested JWT token generation and Bearer authorization across protected routes.

### 4. End-to-End (E2E) & Usability Testing
- **UI Workflows:** Verified full user flows on the frontend (Registration, Interactive Dashboards, Booking creation).
- **Usability Feedback:** Distributed targeted feedback forms (Tourist, Hotel Owner, Vehicle Owner, Tour Guide) to gather real-world user feedback and ensure an intuitive user experience.

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
