import { NextResponse } from 'next/server';
import ekartAPI from '@/lib/ekart';

/**
 * POST /api/admin/ekart/label
 * Download shipping labels for Ekart shipments
 */
export async function POST(req) {
  try {
    const { trackingIds, jsonOnly = false } = await req.json();

    if (!trackingIds || !Array.isArray(trackingIds) || trackingIds.length === 0) {
      return NextResponse.json(
        { error: 'Tracking IDs array is required' },
        { status: 400 }
      );
    }

    if (trackingIds.length > 100) {
      return NextResponse.json(
        { error: 'Maximum 100 tracking IDs allowed at once' },
        { status: 400 }
      );
    }

    console.log('📄 Downloading labels for:', trackingIds);

    const labelData = await ekartAPI.downloadLabel(trackingIds, jsonOnly);

    if (jsonOnly) {
      return NextResponse.json({
        success: true,
        data: labelData
      });
    } else {
      // Return PDF as downloadable file
      return new NextResponse(labelData, {
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': `attachment; filename="ekart-labels-${Date.now()}.pdf"`,
        },
      });
    }

  } catch (error) {
    console.error('❌ Ekart download label error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to download labels', 
        details: error.response?.data?.message || error.message 
      },
      { status: 500 }
    );
  }
}
