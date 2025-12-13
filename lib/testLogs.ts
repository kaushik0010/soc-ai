// lib/testLogs.ts

export interface TestLog {
    id: string;
    name: string;
    source: "webhook" | "manual";
    text: string;
    description: string;
}

export const testLogs = [
    {
        id: "log1",
        name: "Critical: Firewall Block Evasion (IP)",
        source: "webhook",
        text: "ALERT: PaloAlto Firewall log [severity=CRITICAL]. Source IP 192.168.10.1 failed 5 authentication attempts and successfully connected on port 8080 after using a rotating proxy. User: jsmith. Destination: webserver-prod-03. Action: ACCEPT. Evasion detected.",
        description: "Tests critical severity, clear IOC (IP), and triggers the 'block_ip' action.",
    },
    {
        id: "log2",
        name: "Medium: Internal Account Compromise",
        source: "manual",
        text: "ERROR: Failed login attempts exceeded threshold for internal user 'hr_admin'. Last successful login was from Washington, and the latest attempt came from a non-whitelisted GeoIP location (China). Recommend immediate user disable.",
        description: "Tests medium severity, internal user target, and triggers the 'disable_user' action.",
    },
    {
        id: "log3",
        name: "Informational: Routine Software Update",
        source: "webhook",
        text: "INFO: SystemUpdater 4.5.1 successfully downloaded and applied security patch MS19-002 on endpoint corp-laptop-12. No vulnerabilities detected prior to patch.",
        description: "Tests low/informational severity, and should result in the 'create_ticket' action.",
    },
];