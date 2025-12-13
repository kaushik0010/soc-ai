// lib/securityTips.ts

export const securityTips = [
    {
        title: "Principle of Least Privilege (PoLP)",
        tip: "Ensure all users, applications, and services only have the minimum permissions necessary to perform their required tasks. This minimizes the blast radius of a compromised account.",
    },
    {
        title: "MFA Everywhere",
        tip: "Enable Multi-Factor Authentication (MFA) on all critical accounts, especially administrative access and VPNs. It is the most effective defense against credential theft.",
    },
    {
        title: "Patch Management",
        tip: "Prioritize patching systems for vulnerabilities that are actively being exploited (NVD data). A quick patch is the best defense against known flaws.",
    },
    {
        title: "Defense in Depth",
        tip: "Layer your security controls (firewalls, endpoint protection, SIEM, WAF). Relying on a single point of failure (like a firewall) is a recipe for disaster.",
    },
    {
        title: "Baseline Monitoring",
        tip: "Establish a baseline of normal network and user activity. This makes it far easier to detect deviations, such as an employee accessing unusual file shares at 3 AM.",
    },
    {
        title: "Logging is Not Enough",
        tip: "Ensure logs are centralized, normalized, and continuously monitored. An unread log entry provides zero security value.",
    },
];