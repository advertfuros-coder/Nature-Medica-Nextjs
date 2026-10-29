import { NextResponse } from "next/server";
import { requireAdmin } from "@/middleware/auth";
import { syncAllActiveShipments } from "@/lib/tracking-service";

/**
 * POST /api/admin/shipments/sync-all
 * Admin route to auto-sync all active/in-transit shipments
 */
export async function POST(req) {
  try {
    await requireAdmin(req);

    const { searchParams } = new URL(req.url);
    const force = searchParams.get("force") === "true";

    const report = await syncAllActiveShipments({
      maxBatch: 30,
      staleThresholdMinutes: force ? 0 : 15,
      force,
    });

    return NextResponse.json({
      success: true,
      message: `Successfully synchronized ${report.syncedCount} active shipments.`,
      report,
    });
  } catch (error) {
    console.error("Admin sync-all shipments error:", error);
    if (
      error.message === "Admin access required" ||
      error.message === "Authentication required"
    ) {
      return NextResponse.json(
        { error: "Unauthorized. Admin access required." },
        { status: 401 }
      );
    }
    return NextResponse.json(
      { error: "Batch sync failed", details: error.message },
      { status: 500 }
    );
  }
}
