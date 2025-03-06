import { NextResponse } from 'next/server'
import type { Resume } from '@/lib/types/resume'

export async function GET() {
  try {
    // Fetch resumes from your backend
    return NextResponse.json({ resumes: [] })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch resumes' },
      { status: 500 }
    )
  }
}