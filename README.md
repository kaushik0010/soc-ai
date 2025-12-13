# 🛡️ SOC-AI: Instant Security Triage and Automation Platform

**Project Goal:** To transform raw, noisy security logs into structured, actionable intelligence and automated remediation actions in under a second, making security operations scalable and accessible for small-to-medium businesses (SMBs).

## ✨ Core Architecture and Technology Stack

SOC-AI leverages the high-speed processing of Groq and the orchestration power of Kestra to deliver real-time security automation.

* **Frontend:** Next.js, React, TypeScript, Tailwind CSS
* **Backend/API:** Next.js Route Handlers, TypeScript
* **Database:** MongoDB (for persistent log and incident storage)
* **Core AI Engine:** **Groq** (using `llama-3.3-70b-versatile` for sub-second, highly reliable structured triage)
* **Orchestration Engine:** **Kestra** (for managing and executing automated remediation flows)
* **Visualization:** Custom Next.js components and charts (for the Dashboard)

---

## Day 5: Final Polish, Autonomous Triage & Deployment Readiness

This day focused entirely on transforming the functional prototype into a polished, market-ready product, demonstrating a robust, end-to-end autonomous security platform.

### ✨ Key Features Implemented

| Feature Area | Achievement | Technical Implementation |
| :--- | :--- | :--- |
| **User Experience (UX)** | **Professional Landing Page:** Replaced the default Next.js page with a professional, modular, high-conversion landing page. | Created modular components (`HeroSection`, `HowItWorksSection`, etc.) and established a global `Header` and `Footer` in `app/layout.tsx`. |
| **Data Integrity** | **Mongoose Schema Fixes:** Resolved critical database `CastError` issues by enforcing strict typing on array sub-documents. | Defined explicit Mongoose sub-schemas (`MitreTechniqueMongooseSchema`) and used the stable pattern: `type: [Schema], required: true, default: []`. |
| **Visualization** | **Shadcn/Recharts Trend Chart:** Upgraded the manual bar chart to use `shadcn/ui ChartContainer` and `Recharts`, adding tooltips and dynamic color spiking. | Replaced custom rendering with industry-standard, responsive charting components for better performance and presentation. |
| **Security Posture** | **Information Hiding:** Removed sensitive internal MongoDB `_id` values from the frontend output panel. | Updated `LogPlayground.tsx` to log internal IDs to the console only, and display only the shortened, public-facing Incident UUID. |
| **Product Readiness** | **SaaS Architecture:** Confirmed the project model is structured as a scalable SaaS offering, ready for multi-tenancy integration via Webhooks. | Formalized the integration model for the final presentation, emphasizing ease of use for small companies (SMBs). |

---

### 🔨 Core Architectural Fixes & Polish

1.  **Mongoose Reliability:** The Mongoose schema for the `Incident` model is now finalized and fully robust against inconsistent LLM output, guaranteeing data integrity.
2.  **Global UI Layout:** All common UI elements were correctly migrated to `app/layout.tsx` for consistency and optimal performance across all routes.
3.  **Component Modularization:** All major UI sections were split into dedicated components, significantly boosting code maintainability and adherence to the Single Responsibility Principle.

### 🚀 Conclusion: Autonomous and Production-Ready

The SOC-AI Platform stands as a complete, autonomous solution demonstrating the full life cycle of an incident:
$$\text{Ingest Logs} \xrightarrow{\text{Groq/Oumi Triage}} \text{Structured Decision} \xrightarrow{\text{Kestra Execution Agent}} \text{Autonomous Action}$$

This architecture provides a superior foundation for future scaling and feature development, proving the viability of the **Autonomous SOC** model.

---

## 🛠️ Getting Started

### Prerequisites

* Node.js (v18+)
* MongoDB Instance (local or Atlas)
* Groq API Key
* Kestra Server running locally (`http://localhost:8080`)

### Setup and Running

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/kaushik0010/soc-ai.git
    cd soc-ai
    ```
2.  **Install dependencies:**
    ```bash
    pnpm install
    ```
3.  **Configure environment:** Create a `.env.local` file:
    ```
    # Database
    MONGODB_URI=your_mongodb_connection_string
    
    # Groq API
    GROQ_API_KEY=your_groq_api_key
    
    # Kestra API (Localhost default)
    KESTRA_USERNAME=admin
    KESTRA_PASSWORD=admin
    ```
4.  **Run the application:**
    ```bash
    pnpm dev
    ```
5.  **View the Dashboard:** Navigate to `http://localhost:3000/dashboard`

---