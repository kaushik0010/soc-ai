import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { LogEntry } from "@/models/LogEntry.model";
import { IncidentModel } from "@/models/Incident.model";

// Define the valid severity levels for classification counting
const SEVERITY_LEVELS = ["Critical", "High", "Medium", "Low", "Informational"];

export async function GET() {
    try {
        await connectDB();

        // 1. --- RUN CONCURRENT QUERIES ---
        const [
            totalLogs,
            logsBySource,
            incidentsBySeverity,
            logs24hTrend
        ] = await Promise.all([
            
            // A. Total Raw Log Count
            LogEntry.countDocuments({}),
            
            // B. Logs Grouped by Source (webhook, manual, etc.)
            LogEntry.aggregate([
                { $group: { _id: "$source", count: { $sum: 1 } } },
                { $sort: { count: -1 } }
            ]),
            
            // C. Incidents Grouped by Severity (Classification Distribution)
            IncidentModel.aggregate([
                { $group: { _id: "$severity", count: { $sum: 1 } } },
                { $sort: { count: -1 } }
            ]),
            
            // D. Logs Trend over Last 24 Hours
            LogEntry.aggregate([
                { $match: { createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } } },
                { 
                    $group: {
                        _id: { 
                            $dateToString: { 
                                format: "%H:00", 
                                date: "$createdAt",
                                timezone: "UTC" // Ensures consistent hourly grouping
                            }
                        }, 
                        count: { $sum: 1 } 
                    } 
                },
                { $sort: { _id: 1 } }
            ])
        ]);

        // 2. --- FORMAT THE RESULTS ---
        
        // Calculate Totals for Hero Stats (Security Alerts, Errors, etc.)
        const classificationTotals = {
            totalIncidents: 0,
            securityAlerts: 0,
            warnings: 0, // Placeholder mapping
            errors: 0, // Placeholder mapping
        };

        const severityDistribution: Record<string, number> = {};

        incidentsBySeverity.forEach(item => {
            const severity = item._id;
            const count = item.count;
            
            classificationTotals.totalIncidents += count;
            severityDistribution[severity] = count;

            if (severity === 'Critical' || severity === 'High') {
                classificationTotals.securityAlerts += count;
            } else if (severity === 'Medium' || severity === 'Low') {
                classificationTotals.warnings += count; // Using 'Warnings' for lower priority alerts
            } else if (severity === 'Informational') {
                classificationTotals.errors += count; // Using 'Errors' as a catch-all for informational logs (needs cleanup later)
            }
        });

        // 3. --- COMPILE FINAL RESPONSE ---
        return NextResponse.json({
            success: true,
            dashboardData: {
                // Hero Stats
                totalLogs: totalLogs,
                totalIncidents: classificationTotals.totalIncidents,
                securityAlerts: classificationTotals.securityAlerts,
                
                // Distribution Data
                logsBySource: logsBySource,
                incidentsBySeverity: severityDistribution,
                
                // Trend Data (Last 24 hours)
                logs24hTrend: logs24hTrend,
                
                // Placeholder for AI Score (Calculated on the frontend/next step)
                systemHealthScore: 78,
            }
        });

    } catch (error: any) {
        console.error("Dashboard Analytics Error:", error);
        return NextResponse.json(
            { success: false, message: "Failed to fetch analytics data." },
            { status: 500 }
        );
    }
}