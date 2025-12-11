// /api/logs/list/route.ts
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { LogEntry } from "@/models/LogEntry.model";
import mongoose from "mongoose"; // Required for aggregation

export async function GET(req: NextRequest) {
    try {
        await connectDB();

        const { searchParams } = new URL(req.url);

        const page = parseInt(searchParams.get("page") || "1", 10);
        const limit = parseInt(searchParams.get("limit") || "20", 10); // Increased limit to 20 for typical lists
        
        // Search Params from the URL
        const userId = searchParams.get("userId");
        const source = searchParams.get("source");
        const severityFilter = searchParams.get("classification"); // We use 'classification' URL param for Incident Severity
        const search = searchParams.get("search")?.trim();
        const startDate = searchParams.get("startDate");
        const endDate = searchParams.get("endDate");

        // --- 1. Base Query and Initial Match Stage ---
        const initialMatchQuery: Record<string, any> = {};

        if (userId) initialMatchQuery.userId = userId;
        if (source) initialMatchQuery.source = source;

        // Date range filter
        if (startDate || endDate) {
            initialMatchQuery.createdAt = {};
            if (startDate) initialMatchQuery.createdAt.$gte = new Date(startDate);
            if (endDate) initialMatchQuery.createdAt.$lte = new Date(endDate);
        }

        // --- 2. Build Aggregation Pipeline ---
        const pipeline: mongoose.PipelineStage[] = [];

        // Apply initial filters (Source, User, Date Range)
        if (Object.keys(initialMatchQuery).length > 0) {
            pipeline.push({ $match: initialMatchQuery });
        }
        
        // Sort before joining/paginating
        pipeline.push({ $sort: { createdAt: -1 } });
        
        // 2a. $LOOKUP: Join LogEntry with IncidentModel
        pipeline.push({
            $lookup: {
                from: "incidents", // Mongoose collection name for IncidentModel
                localField: "_id",
                foreignField: "logEntryIds",
                as: "incidentDetails", // Array containing the linked Incident(s)
            },
        });

        // 2b. Add Severity Filter (Classification parameter)
        if (severityFilter) {
            // We match logs where the linked incident's severity matches the filter
            pipeline.push({
                $match: {
                    "incidentDetails.0.severity": severityFilter, // Check the severity of the primary linked incident
                },
            });
        }
        
        // 2c. Add Text Search Filter
        if (search) {
             // We search rawText on the log, and title/summary on the incidentDetails
             pipeline.push({
                 $match: {
                     $or: [
                         { rawText: { $regex: search, $options: "i" } },
                         { "incidentDetails.title": { $regex: search, $options: "i" } },
                         { "incidentDetails.summary": { $regex: search, $options: "i" } },
                     ],
                 },
             });
         }

        // --- 3. Paginate and Count using $facet (Efficient) ---
        pipeline.push({
            $facet: {
                // Get the total count of documents matching the filter
                totalCount: [
                    { $count: "total" }
                ],
                // Get the paginated results
                paginatedResults: [
                    { $skip: (page - 1) * limit },
                    { $limit: limit }
                ]
            }
        });

        // Execute the aggregation pipeline
        const aggregationResult = await LogEntry.aggregate(pipeline);
        
        // Extract results from the $facet structure
        const totalLogs = aggregationResult[0]?.totalCount[0]?.total || 0;
        const logs = aggregationResult[0]?.paginatedResults || [];
        
        return NextResponse.json({
            success: true,
            totalLogs,
            page,
            limit,
            logs,
        });

    } catch (error: any) {
        console.error("Error fetching logs:", error);
        // Log detailed error and return generic 500 status
        return NextResponse.json(
            { success: false, message: "Server error", error: error.message },
            { status: 500 }
        );
    }
}