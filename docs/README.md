---
layout: home
permalink: index.html

repository-name: e22-co2060-PearlPath
title: PearlPath
---

# PearlPath  
*A MERN Stack-Based Integrated Tourism Platform for Sri Lanka*

**🌐 Live Website:** [https://pearlpath-frontend-deploy.vercel.app](https://pearlpath-frontend-deploy.vercel.app)

---

## Team
- E/22/124, R.G. Gunawardana – [e22124@eng.pdn.ac.lk](mailto:e22124@eng.pdn.ac.lk)  
- E/22/228, W.M.S. Manujitha – [e22228@eng.pdn.ac.lk](mailto:e22228@eng.pdn.ac.lk)  
- E/22/232, D.F.A.T.D. Mathangadeera – [e22232@eng.pdn.ac.lk](mailto:e22232@eng.pdn.ac.lk)  
- E/22/452, Y.M.C.J. Yagabamunu – [e22452@eng.pdn.ac.lk](mailto:e22452@eng.pdn.ac.lk)  

---

## Table of Contents
1. [Introduction](#introduction)  
2. [Solution Architecture](#solution-architecture)  
3. [Software Design](#software-design)  
4. [Testing](#testing)  
5. [Complete System Guides](#complete-system-guides)  
6. [Conclusion](#conclusion)  
7. [Links](#links)  

---

## Introduction

Tourists visiting Sri Lanka often face a fragmented digital ecosystem where accommodation, transportation, and tour services are spread across multiple platforms. This leads to inefficiencies, inconsistent data, and difficulty in planning a reliable travel experience.

**PearlPath** is a **MERN stack-based centralized tourism platform** that integrates hotels, vehicle rentals, and tour guide services into a single system. The platform provides a seamless and secure experience with verified listings, enabling users to plan and manage their entire यात्रा in one place.

---

## Solution Architecture

PearlPath is built using the **MERN Stack (MongoDB, Express.js, React.js, Node.js)** following a scalable three-tier architecture:

### 1. Presentation Layer (Frontend)
- Built with **React.js** and **Vite**
- Styled using **Tailwind CSS**
- Provides role-based dashboards for:
  - Tourists  
  - Service Providers  
  - Administrators  

### 2. Application Layer (Backend)
- Developed using **Node.js** and **Express.js**
- Implements RESTful APIs
- Handles:
  - Authentication & Authorization  
  - Booking logic  
  - Data validation  

### 3. Data Layer (Database)
- **MongoDB** (NoSQL database)
- Stores:
  - User data  
  - Listings (Hotels, Vehicles, Tours)  
  - Booking records  

### External Integrations
- **Google Maps API** for:
  - Location visualization  
  - Distance calculation  
  - Route planning  

---

## Software Design

### 1. Authentication & RBAC (Role-Based Access Control)
- Passwords secured using **Bcrypt**
- Session management via **JWT (JSON Web Tokens)**
- User roles:
  - Tourist  
  - Hotel Owner  
  - Vehicle Owner  
  - Admin  

---

### 2. Service Management System
Providers can:
- Add and manage listings  
- Upload images and details  
- Track booking requests  
- Update booking status in real-time  

---

### 3. Unified Booking Engine
- Centralized booking controller
- Prevents overlapping reservations
- Calculates cost dynamically based on:
  - Duration  
  - Service type  

---

### 4. UI/UX Design
- Modern **"Sunset Theme" UI**
- Built with Tailwind CSS + custom animations  
- Uses **Lucide React icons**
- Focus on:
  - Clean navigation  
  - Responsive design  
  - Smooth user experience  

---

## Testing

Testing was performed comprehensively across multiple levels, employing both automated scripts and manual evaluation, resulting in **158 passed test cases across 11 suites**.

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
- **Usability Feedback:** Distributed 4 targeted feedback forms (Tourist, Hotel Owner, Vehicle Owner, Tour Guide) using Google Apps Script to gather real-world user feedback and ensure an intuitive user experience.

---

## Complete System Guides

- 🛠️ **Developer & Maintainer Guide**: [PDF](docs/Pearl%20Path%20-Developer_Guide.pdf)
  - Technical architecture, database models, microservice gateway proxy setup, and API reference.
- 📖 **User Manual & Operating Guide**: [PDF](docs/Pearl%20Path%20-%20User%20Manual%20%26%20Operating%20Guide.pdf)
  - Role-based step-by-step user manual for Tourists, Hotel Owners, Vehicle Owners, Tour Guides, and Admins.
- 📝 **Software Testing Report**: [PDF](docs/PearlPath%20Software%20Testing%20Report.pdf)
  - Automated test execution logs (158 passed test cases across 11 suites), Jest/Supertest results, and Postman API validation evidence.

---

## Team Contributions

### D.F.A.T.D. Mathangadeera (E/22/232)
- Backend Architecture
- REST APIs
- AI Chatbot

### W.M.S. Manujitha (E/22/228)
- Discovery Modules
- Search Aggregation
- UI/UX Design
- Currency Conversion

### R.G. Gunawardana (E/22/124)
- Routing Infrastructure
- Postman API Testing
- Frontend Integration

### Y.M.C.J. Yagabamunu (E/22/452)
- Interactive Map Module
- Authentication / OTP
- Booking Validation
- Git Branching Strategy

---

## Conclusion

PearlPath provides a **scalable, MERN-based solution** to unify Sri Lanka's tourism services into a single platform. It significantly improves user convenience, system reliability, and service accessibility.

---

### Future Enhancements
- Online payment integration (Stripe / local gateways)  
- Real-time chat system  
- Mobile app (React Native)  
- AI-based recommendation system  

---

## Links

- [Project Repository](https://github.com/cepdnaclk/{{ page.repository-name }}){:target="_blank"}  
- [Project Page](https://cepdnaclk.github.io/{{ page.repository-name}}){:target="_blank"}  
- [Department of Computer Engineering](http://www.ce.pdn.ac.lk/)  
- [University of Peradeniya](https://eng.pdn.ac.lk/)
