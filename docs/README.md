---
layout: home
permalink: index.html

# Please update this with your repository name and project title
repository-name: e22-co2060-PearlPath
title: PearlPath
---

[comment]: # "This is the standard layout for the project, but you can clean this and use your own template, and add more information required for your own project"

# PearlPath

---

## Team
-  E/22/124, R.G.GUNAWARDANA, [e22124@eng.pdn.ac.lk](mailto:e22124@eng.pdn.ac.lk)
-  E/22/228, W.M.S.MANUJITHA, [e22228@eng.pdn.ac.lk](mailto:e22228@eng.pdn.ac.lk)
-  E/22/452, Y.M.C.J.YAGABAMUNU, [e22452@eng.pdn.ac.lk](mailto:e22452@eng.pdn.ac.lk)
-  E/22/232, D.F.A.T.D.MATHANGADEERA, [e22232@eng.pdn.ac.lk](mailto:e22232@eng.pdn.ac.lk)

#### Table of Contents
1. [Introduction](#introduction)
2. [Solution Architecture](#solution-architecture)
3. [Software Designs](#software-designs)
4. [Testing](#testing)
5. [Conclusion](#conclusion)
6. [Links](#links)

## Introduction

Tourists visiting Sri Lanka currently face a fragmented digital landscape, requiring them to juggle multiple disconnected platforms for hotel bookings, transport rentals, and finding reliable tour guides. This fragmentation leads to planning fatigue, inconsistent information, and potential safety risks due to unverified listings.

**PearlPath** is a centralized travel support platform designed to simplify this experience. By integrating hotels, vehicle services, and tour guides into a single unified system, it provides a "one-stop-shop" for travel planning. The platform focuses on reliability, verified listings, and a seamless user experience, allowing tourists to explore the beauty of Sri Lanka with confidence.

## Solution Architecture

PearlPath follows a modern **Three-Tier Architecture** to ensure scalability, security, and a responsive user experience.

- **Presentation Layer (Frontend)**: Built with **React.js** and **Vite**, utilizing **Tailwind CSS** for a premium "Sunset" themed UI. It provides interactive dashboards for tourists, service providers, and administrators.
- **Logic Layer (Backend)**: Powered by **Node.js** and **Express.js**, this layer manages RESTful APIs, business logic for bookings, and secure **JWT-based authentication**.
- **Data Layer (Database)**: **MongoDB** serves as the primary document store, handling complex relationships between users, bookings, and diverse service categories (Hotels, Vehicles, Tours).

### High-Level Diagram
The system integrates with the **Google Maps API** for geolocation, distance calculation, and interactive route planning, ensuring tourists can visualize their journey in real-time.

## Software Designs

### 1. Authentication & Role-Based Access Control (RBAC)
The system implements a robust security layer using **Bcrypt** for password hashing and **JSON Web Tokens (JWT)** for session management. Users are categorized into four roles:
- **Tourist**: Browse and book services.
- **Hotel Owner**: Manage property listings and booking requests.
- **Vehicle Owner**: Manage transport listings and availability.
- **Admin**: Oversee the platform, approve new providers, and manage system-wide data.

### 2. Service Management System
Service providers have dedicated dashboards where they can:
- List new properties or vehicles with rich media and detailed descriptions.
- Monitor incoming booking requests.
- Update booking statuses (Pending, Confirmed, Rejected, Cancelled) which reflect in real-time on the tourist's profile.

### 3. Unified Booking Engine
A centralized booking controller handles transactions across different categories. It calculates total prices based on stay duration or rental days and prevents double bookings by managing availability dates.

### 4. User Interface Design
The "Sunset" design system uses a curated palette of oranges, golds, and teals, combined with glassmorphic elements and smooth transitions (using **Lucide React** icons and custom CSS animations) to provide a premium feel.

## Testing

Testing was conducted across several layers to ensure platform stability:

- **Unit Testing**: Backend controllers were tested individually to verify correct data handling for user registration and booking logic.
- **API Testing**: Tools like Postman and internal scripts (`testEndpoint.js`) were used to validate REST API endpoints, ensuring correct status codes and JSON responses.
- **Integration Testing**: Verified the flow between frontend React components and the backend API, specifically for complex forms like property registration and booking checkout.
- **Manual Testing**: End-to-end user journeys were tested, from creating a tourist account to successfully completing a hotel reservation and viewing it in the "My Bookings" dashboard.

## Conclusion

PearlPath successfully demonstrates a unified approach to travel planning in Sri Lanka. By consolidating fragmented services into a single, high-performance web platform, we have created a tool that significantly reduces the friction of trip organization.

### Future Developments
- **Payment Integration**: Implementing Stripe or local payment gateways for secure financial transactions.
- **Real-time Communication**: Adding a chat system for direct interaction between tourists and service providers.
- **Mobile Application**: Developing a React Native version of the platform for on-the-go travel support.

## Links

- [Project Repository](https://github.com/cepdnaclk/{{ page.repository-name }}){:target="_blank"}
- [Project Page](https://cepdnaclk.github.io/{{ page.repository-name}}){:target="_blank"}
- [Department of Computer Engineering](http://www.ce.pdn.ac.lk/)
- [University of Peradeniya](https://eng.pdn.ac.lk/)
