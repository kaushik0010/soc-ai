# 🛡️ SOC-AI: Instant Security Triage and Automation Platform

**Project Goal:** To transform raw, noisy security logs into structured, actionable intelligence and automated remediation actions in under a second, making security operations scalable and accessible for small-to-medium businesses (SMBs).

## 🎬 Demo Video & Live Link

| Resource | Link |
| :--- | :--- |
| **Live Application** | `https://soc-ai-bice.vercel.app/` |
| **YouTube Demo** | `https://youtu.be/LbuHXiPznJE` |

---

## 🛑 The Problem

Security Operations Centers (SOCs) face two critical, compounding challenges:

1.  **Alert Fatigue:** Security analysts are overwhelmed by thousands of false positives and raw, unstructured logs, leading to burnout and missed critical incidents.
2.  **Slow Response:** Manual triage and remediation (blocking an IP, creating a ticket) takes minutes or hours. In an age of automated attacks, this latency is unacceptable, leading to extended security breaches.

## ✅ The Solution: Autonomous Security Operations

The **SOC-AI Platform** solves this by enforcing an **Intelligent, Human-Governed Automation** pipeline:

1.  **High-Speed Triage:** We use **Groq** to instantly convert raw, unstructured logs into structured, actionable JSON data (Severity, IOCs, Action).
2.  **Human-in-the-Loop (HITL) Safety:** The AI suggests the action, but **Kestra** executes the critical remediation flow only after an analyst provides explicit sign-off, ensuring auditability and safety.
3.  **Continuous Improvement:** A built-in Reinforcement Learning (RL) loop allows analysts to correct the AI's triage, guaranteeing the system learns and improves with every incident.

---

## 🏗️ Core Architecture and Technology Stack

SOC-AI leverages a specialized, high-performance stack, treating both the AI and Orchestrator as specialized microservices. [Image of SOC-AI Platform Architecture]

### Technology Stack

| Component | Technology | Role |
| :--- | :--- | :--- |
| **Frontend** | Next.js 15, React, Tailwind CSS | Professional, modular UI/UX with global layout consistency. |
| **Backend/API** | Next.js Route Handlers, TypeScript | Secure intake via Webhooks and management of data between services. |
| **Database** | MongoDB & Mongoose | Persistent and highly reliable storage for Logs and Incidents. |
| **Core AI Engine** | **Groq** (`llama-3.3-70b-versatile`) | Sub-second, low-latency, highly reliable **Structured Triage**. |
| **Orchestration** | **Kestra** | The **Execution Agent** that manages and executes secure remediation flows (e.g., `block-ip`). |
| **Visualization** | Shadcn/Recharts | Industry-standard visualization for Log Trends and Kestra Status. |

### The Automation Loop (The Formula)

The platform's efficiency is based on this core, specialized pipeline:

$$\text{Ingest Logs} \xrightarrow{\text{Groq/Oumi Triage}} \text{Structured Decision} \xrightarrow{\text{Kestra Execution Agent}} \text{Autonomous Action}$$

---

## ✨ Key Features & Autonomous Intelligence

### 1. **Intelligent Triage & Decision-Making**

The Groq/Oumi Triage Agent is designed for reliable output:

* **Structured Output:** Uses Zod schemas to enforce clean JSON output, eliminating unreliable text summarization and generating structured fields (Severity, IOCs, MITRE Techniques).
* **Data Integrity:** Mongoose schema is hardened with explicit array sub-documents and stable patterns to ensure data stability from the LLM output.

### 2. **Human-in-the-Loop (HITL) Execution**

We integrate Kestra as a final security guardrail:

* **Auditable Action:** The AI suggests an action, but the Kestra flow is triggered only when the analyst manually clicks **"Approve & Run Kestra Flow"** in the log drawer, ensuring all critical actions are human-governed.
* **Kestra Status:** The Dashboard provides real-time status of all Kestra executions, confirming the success or failure of autonomous actions.

### 3. **Continuous Reinforcement Learning**

* **Oumi Feedback Model:** Analysts use the **Oumi Feedback Model** located within the log detail drawer to submit corrections (e.g., overriding Severity or adding a MITRE Technique).
* **Granular Training:** This per-log feedback provides high-quality data for DPO/RLHF, continuously training the AI Agent and improving future triage accuracy.

---

## 🚀 Future Scope

1.  **Multi-Tenancy:** Implement `clientId` on log ingestion and use it to filter all dashboard/log queries, enabling a true multi-tenant SaaS deployment.
2.  **Kestra Dynamic Targets:** Enhance Kestra flows to accept and execute remediation actions on dynamic cloud environments (e.g., dynamically blocking an IP in an AWS Security Group or Azure NSG).
3.  **Advanced LLM Chaining:** Implement a secondary validation LLM (Guardrail Agent) to verify the suggested action before it's presented to the human analyst.

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

    NEXT_PUBLIC_API_URL="http://localhost:3000/api"
    KESTRA_API_URL="http://localhost:8080/api/v1"
    ```
4.  **Run the application:**
    ```bash
    pnpm dev
    ```
5.  **View the Dashboard:** Navigate to `http://localhost:3000/dashboard`