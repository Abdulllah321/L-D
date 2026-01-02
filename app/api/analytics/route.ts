
import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import AnalyticsEvent from '@/models/AnalyticsEvent';
import { UAParser } from 'ua-parser-js';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { eventType, path, target, sessionId, referrer } = body;
    const userAgent = req.headers.get('user-agent') || '';
    
    // Simple device detection
    const parser = new UAParser(userAgent);
    const device = parser.getDevice();
    const deviceType = device.type === 'mobile' ? 'mobile' : device.type === 'tablet' ? 'tablet' : 'desktop';

    await connectDB();

    const event = await AnalyticsEvent.create({
      eventType,
      path,
      target,
      sessionId,
      userAgent,
      deviceType,
      referrer,
      timestamp: new Date()
    });

    return NextResponse.json({ success: true, id: event._id });
  } catch (error) {
    console.error('Analytics Error:', error);
    return NextResponse.json({ error: 'Failed to record event' }, { status: 500 });
  }
}

export async function GET(req: Request) {
    try {
        await connectDB();
        
        // 1. Get recent traffic (last 30 minutes) for the graph
        const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);
        const trafficData = await AnalyticsEvent.aggregate([
            { $match: { timestamp: { $gte: thirtyMinutesAgo }, eventType: 'view' } },
            { 
                $group: { 
                    _id: { 
                        $dateToString: { format: "%H:%M", date: "$timestamp", timezone: "Asia/Singapore" } // Adjust timezone if needed, simple aggregation by minute
                    },
                    users: { $addToSet: "$sessionId" } // Unique users
                }
            },
            {
                $project: {
                    time: "$_id",
                    users: { $size: "$users" }
                }
            },
            { $sort: { time: 1 } }
        ]);

        // 2. Active Users (approximate: distinct sessions in last 5 mins)
        const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
        const activeUsersCount = await AnalyticsEvent.distinct('sessionId', { timestamp: { $gte: fiveMinutesAgo } });
        
        // 3. Top Pages
        const topPages = await AnalyticsEvent.aggregate([
            { $match: { eventType: 'view' } },
            { $group: { _id: "$path", visits: { $sum: 1 } } },
            { $sort: { visits: -1 } },
            { $limit: 5 },
            { $project: { name: "$_id", visits: 1, _id: 0 } }
        ]);

        // 4. Device Usage
        const deviceUsage = await AnalyticsEvent.aggregate([
             { $match: { eventType: 'view' } },
             { $group: { _id: "$deviceType", count: { $sum: 1 } } }
        ]);
        
        // 5. Recent Events
        const recentEvents = await AnalyticsEvent.find()
            .sort({ timestamp: -1 })
            .limit(10)
            .lean();
        
        // 6. Total Clicks Today
        const startOfDay = new Date();
        startOfDay.setHours(0,0,0,0);
        const totalClicks = await AnalyticsEvent.countDocuments({ 
            eventType: 'click',
            timestamp: { $gte: startOfDay }
        });

        return NextResponse.json({
            trafficData,
            activeUsers: activeUsersCount.length,
            topPages,
            deviceUsage,
            recentEvents: recentEvents.map(e => ({
                id: e._id,
                type: e.eventType,
                target: e.target || e.path,
                timestamp: e.timestamp,
                user: e.sessionId.substring(0, 8) + '...' // Anonymize
            })),
            totalClicks
        });

    } catch (error) {
        console.error('Analytics Fetch Error:', error);
        return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 });
    }
}
