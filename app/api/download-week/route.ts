import { NextRequest, NextResponse } from 'next/server'
import path from 'path'
import fs from 'fs'

const WORKSHEETS_ROOT = path.join(process.cwd(), 'public', 'worksheets')

const CHILD_FOLDER: Record<string, string> = {
  'c-alijah': 'Alijah',
  'c-olori': 'Olori-Joy',
  'c-seraiah': 'Seraiah',
  'c-amelia': 'Amelia',
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const childId = searchParams.get('childId')
  const weekNumber = searchParams.get('weekNumber')

  if (!childId || !weekNumber) {
    return NextResponse.json(
      { error: 'Missing childId or weekNumber parameter' },
      { status: 400 }
    )
  }

  const childFolder = CHILD_FOLDER[childId]
  if (!childFolder) {
    return NextResponse.json(
      { error: 'Invalid childId' },
      { status: 400 }
    )
  }

  const week = String(weekNumber).padStart(2, '0')
  const weekFolder = path.join(WORKSHEETS_ROOT, `week-${week}`, childFolder)

  // Verify the folder exists
  if (!fs.existsSync(weekFolder)) {
    return NextResponse.json(
      { error: 'Worksheets not found for this week and child' },
      { status: 404 }
    )
  }

  try {
    // Collect the PDF URLs for all four days
    const days = ['Mon', 'Tue', 'Thu', 'Fri']
    const pdfs: string[] = []

    days.forEach((day) => {
      const filePath = path.join(weekFolder, `${day}.pdf`)
      if (fs.existsSync(filePath)) {
        pdfs.push(`/worksheets/week-${week}/${childFolder}/${day}.pdf`)
      }
    })

    return NextResponse.json({
      childFolder,
      weekNumber,
      pdfs,
    })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch PDFs' },
      { status: 500 }
    )
  }
}
