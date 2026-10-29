import { NextResponse } from "next/server";
import { syncAllActiveShipments } from "@/lib/tracking-service";

/**
 * Scheduled Cron Auto-Sync Route
 * Route: /api/cron/sync-shipments
 *
 * Runs periodically (e.g. every 15-30 mins via Google Cloud Scheduler, Vercel Cron, or external pinger)
 * to automatically advance parcels to the next stage in real-time.
 */
export async function GET(req) {
  return handleSync(req);
}

export async function POST(req) {
  return handleSync(req);
}

async function handleSync(req) {
  try {
    const { searchParams } = new URL(req.url);
    const force = searchParams.get("force") === "true";
    const batch = parseInt(searchParams.get("batch") || "30", 10);
    const staleMins = parseInt(searchParams.get("staleMins") || "15", 10);

    // Optional secret token check (if configured in environment)
    const cronSecret = process.env.CRON_SECRET;
    const authHeader = req.headers.get("authorization");
    const queryKey = searchParams.get("key");

    if (cronSecret) {
      const isAuthorized =
        authHeader === `Bearer ${cronSecret}` || queryKey === cronSecret;
      if (!isAuthorized) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
    }

    console.log(`⏰ Cron sync triggered (force: ${force}, batch: ${batch}, stale: ${staleMins}m)...`);

    const report = await syncAllActiveShipments({
      maxBatch: Math.min(batch, 50),
      staleThresholdMinutes: staleMins,
      force,
    });

    return NextResponse.json({
      success: true,
      message: `Auto-sync completed. ${report.syncedCount} shipments updated. ${report.stageChangeCount} packages advanced to next stage.`,
      report,
    });
  } catch (error) {
    console.error("❌ Cron sync error:", error);
    return NextResponse.json(
      { error: "Cron auto-sync failed", details: error.message },
      { status: 500 }
    );
  }
}
