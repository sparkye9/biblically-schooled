import { NextRequest, NextResponse } from 'next/server'
import path from 'path'
import fs from 'fs'
import { createReadStream } from 'fs'

const archiver = require('archiver')

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
    // Create response with streaming
    const response = new NextResponse(
      new ReadableStream((controller) => {
        const archive = archiver('zip', { zlib: { level: 6 } })

        archive.on('error', (err: Error) => {
          controller.error(err)
        })

        archive.on('data', (chunk: Buffer) => {
          controller.enqueue(chunk)
        })

        archive.on('end', () => {
          controller.close()
        })

        // Add PDF files for Monday, Tuesday, Thursday
        const days = ['Mon', 'Tue', 'Thu']

        days.forEach((day) => {
          const filePath = path.join(weekFolder, `${day}.pdf`)
          if (fs.existsSync(filePath)) {
            archive.file(filePath, {
              name: `${childFolder}_Week${weekNumber}_${day}.pdf`,
            })
          }
        })

        archive.finalize()
      })
    )

    response.headers.set('Content-Type', 'application/zip')
    response.headers.set(
      'Content-Disposition',
      `attachment; filename="Week${weekNumber}_${childFolder}.zip"`
    )

    return response
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create zip' },
      { status: 500 }
    )
  }
}
