import { NextResponse } from "next/server";
import { getPoolIfConfigured } from "@/lib/db";

export const runtime = "nodejs";

// GET /api/progress/subjects
// Returns the list of known subjects/table types from DB
export async function GET() {
  try {
    const pool = getPoolIfConfigured();
    if (!pool) {
      return NextResponse.json({ ok: true, rows: [], warning: 'DB not configured' });
    }
    const { rows } = await pool.query(
      `SELECT subject_name, table_type, total_pdfs, current_progress FROM public.progress ORDER BY subject_name, table_type`
    );
    return NextResponse.json({ ok: true, rows });
  } catch (err: any) {
    console.error("/api/progress/subjects error", err);
    return NextResponse.json({ ok: false, error: err?.message || String(err) }, { status: 500 });
  }
}
