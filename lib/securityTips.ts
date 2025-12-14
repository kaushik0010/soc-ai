// lib/securityTips.ts

export type SecurityTip = {
    title: string;
    tip: string;
    category?: 'response' | 'prevention' | 'detection' | 'general';
    priority?: 'high' | 'medium' | 'low';
};

export const securityTips: SecurityTip[] = [
    {
        title: "Principle of Least Privilege (PoLP)",
        tip: "Ensure all users, applications, and services only have the minimum permissions necessary to perform their required tasks. This minimizes the blast radius of a compromised account.",
        category: "prevention",
        priority: "high"
    },
    {
        title: "MFA Everywhere",
        tip: "Enable Multi-Factor Authentication (MFA) on all critical accounts, especially administrative access and VPNs. It is the most effective defense against credential theft.",
        category: "prevention",
        priority: "high"
    },
    {
        title: "Patch Management",
        tip: "Prioritize patching systems for vulnerabilities that are actively being exploited (NVD data). A quick patch is the best defense against known flaws.",
        category: "prevention",
        priority: "medium"
    },
    {
        title: "Defense in Depth",
        tip: "Layer your security controls (firewalls, endpoint protection, SIEM, WAF). Relying on a single point of failure (like a firewall) is a recipe for disaster.",
        category: "prevention",
        priority: "medium"
    },
    {
        title: "Baseline Monitoring",
        tip: "Establish a baseline of normal network and user activity. This makes it far easier to detect deviations, such as an employee accessing unusual file shares at 3 AM.",
        category: "detection",
        priority: "medium"
    },
    {
        title: "Logging is Not Enough",
        tip: "Ensure logs are centralized, normalized, and continuously monitored. An unread log entry provides zero security value.",
        category: "detection",
        priority: "high"
    },
    {
        title: "Incident Response Playbooks",
        tip: "Have predefined, tested playbooks for common attack scenarios (ransomware, data breach, DDoS). Seconds matter during an incident.",
        category: "response",
        priority: "high"
    },
    {
        title: "Zero Trust Architecture",
        tip: "Assume breach and verify explicitly. Don't trust any device or user inside or outside the network perimeter without validation.",
        category: "general",
        priority: "high"
    },
    {
        title: "Regular Security Training",
        tip: "Conduct regular, engaging security awareness training. Most breaches start with human error.",
        category: "prevention",
        priority: "medium"
    },
    {
        title: "Backup 3-2-1 Rule",
        tip: "Maintain 3 copies of your data, on 2 different media, with 1 copy stored offsite. Test restoration regularly.",
        category: "response",
        priority: "high"
    }
];