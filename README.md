# Healthcare Wellness & Preventive Care Portal

## Core Problem in One Line

Patients lack a simple and secure way to track preventive wellness goals, and providers lack visibility into patient compliance resulting in poor preventive care outcomes.

## Problem Overview

Today, many patients fail to meet basic wellness goals and often miss preventive health checkups. This leads to avoidable health issues, increased treatment costs, and poor long-term outcomes.
Healthcare providers also struggle to monitor patient compliance, track lifestyle goals, and access accurate patient wellness data.

There is **no simple, unified platform** that helps patients stay engaged with their wellness journey while giving providers basic visibility into preventive care compliance all in a secure and privacy-compliant manner.

---

## What Problem Are We Solving?

We aim to build a **Healthcare Wellness & Preventive Care Portal** that:

### For Patients:

- Makes it easy to **set and track wellness goals** (steps, hydration, exercise).
- Sends **preventive care reminders** (checkups, screenings, vaccines).
- Provides a **simple dashboard** for health goals and tips.
- Ensures **privacy and secure access** to their personal health information.

### For Healthcare Providers:

- Offers a **lightweight view of patient compliance** with wellness goals.
- Makes patient tracking simple without exposing unnecessary personal data.
- Provides tools to promote **preventive care engagement**.

---

## Why Is This Challenging?

- Health data must be handled **securely and privately** (HIPAA-aware).
- Needs **role-based access**: patient vs. provider.
- Must be **fast, usable, and responsive** across devices.
- Requires backend → frontend → cloud integration.
- Users expect real-time, simple dashboards and reminders.

---

# Solution (Patient & Provider Journeys)

## Patient Journey

1. **Sign Up & Consent**
   The patient creates an account, accepts the consent notice, and securely logs in.

2. **Personal Dashboard**
   After logging in, the patient sees a simple dashboard showing:

   - Wellness goals (steps, water intake, exercise)
   - Preventive care reminders (vaccines, checkups)
   - Daily health tip for awareness

3. **Goal Tracking**
   Patients can easily log progress (e.g., steps walked, water consumed) and see how close they are to their goals.

4. **Profile Management**
   Patients can update basic health details like allergies, medications, and personal info to keep their record accurate.

5. **Motivation & Compliance**
   The system helps patients stay consistent with preventive care and encourages daily wellness habits.

---

## Provider Journey

1. **Provider Login**
   A healthcare provider logs in through the same secure system but is given provider-level access.

2. **Patient List View**
   Providers see a list of patients showing their wellness compliance status at a glance.

3. **Patient Overview**
   Clicking a patient shows:

   - Their wellness goals
   - Their logged progress
   - Their preventive care compliance levels

   (Only essential information is shown to protect patient privacy.)

4. **Better Preventive Care Management**
   Providers can quickly identify which patients need follow-up, encouragement, or care reminders.

---

# Final Outcome

The system delivers an easy-to-use, privacy-aware wellness platform where:

- **Patients stay consistent with daily wellness and preventive care**, and
- **Providers gain simple visibility into patient compliance** to support better outcomes.

---

# Technical Specification

## **Frontend Next.js + Tailwind CSS**

**Why:**
Next.js gives fast routing, server-side rendering, and great developer experience.
It keeps the UI responsive, clean, and easy to extend, while CSS Modules ensure styles stay modular and conflict-free.

## **Backend Node.js (Express.js)**

**Why:**
Express is lightweight, fast to prototype, and ideal for building REST APIs.
It provides full control over routes, middleware, security, and integrates easily with authentication systems.

## **Database MongoDB (NoSQL)**

**Why:**
Wellness goals and log entries are flexible and user-specific, making a NoSQL schema ideal.
MongoDB allows quick scaling, document-based structure, and painless cloud hosting via MongoDB Atlas.

## **Authentication JWT + Bcrypt**

**Why:**
JWT enables stateless, secure sessions across both patient and provider roles.
Bcrypt ensures passwords are safely hashed, reducing credential risk and meeting healthcare privacy expectations.

## **Rate Limiting, Input Validation**

**Why:**
A healthcare-focused app must guard against common attacks.
rate-limiting prevents brute force, and validation protects against malicious input.

## **Deployment Vercel (Frontend) + Render/ (Backend)**

**Why:**
These platforms make deployment effortless, handle HTTPS automatically, and allow environment variable isolation essential for secure health-related apps.

---

# Data Model

### **User**

The **User** model stores all account-level information for both patients and providers.
It keeps the user’s role (patient/provider), login details, and basic health profile such as allergies and medications.
For security, passwords are saved only as hashed values, and consent is stored for healthcare data handling.

## **1. User**

| Field           | Type          | Notes                       |
| --------------- | ------------- | --------------------------- |
| `id`            | String        | Unique user identifier      |
| `role`          | String        | `"patient"` or `"provider"` |
| `name`          | String        | Full name                   |
| `email`         | String        | Unique login email          |
| `passwordHash`  | String        | Hashed password             |
| `consentGiven`  | Boolean       | Required for patient signup |
| `profile`       | Object        | Basic health info           |
| └ `allergies`   | Array<String> | Optional                    |
| └ `medications` | Array<String> | Optional                    |
| `createdAt`     | Date          | Timestamp                   |

---

### **Goal**

The **Goal** model represents any wellness target a patient wants to track — such as steps, water intake, or exercise.
Each goal has a target value, unit, and a history of progress entries so the dashboard can show daily tracking and growth over time.

| Field       | Type                 | Notes                                          |
| ----------- | -------------------- | ---------------------------------------------- |
| `id`        | String               | Goal ID                                        |
| `userId`    | String               | Reference to a patient                         |
| `type`      | String               | `"steps"`, `"water"`, `"exercise"`, `"custom"` |
| `target`    | Number               | e.g., 5000 steps / 2000 ml                     |
| `unit`      | String               | `"steps"`, `"ml"`, `"minutes"`                 |
| `progress`  | Array<ProgressEntry> | Daily logs                                     |
| `createdAt` | Date                 | Timestamp                                      |

---

### **Progress Entry**

Every time a patient logs activity (like “3000 steps today”), a **Progress Entry** is created.
It captures the date and the value logged, helping visualize trends and compliance.

---

### **Reminder**

The **Reminder** model handles preventive care reminders like routine checkups or recurring wellness prompts.
It supports both one-time and recurring reminders (daily/weekly) to encourage consistent habits.
