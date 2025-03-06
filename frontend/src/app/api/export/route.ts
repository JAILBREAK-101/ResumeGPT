import { NextResponse } from 'next/server';
import type { Resume } from '@/lib/types/resume';
import { ExportHandler } from '@/lib/exports/handlers';

export async function POST(request: Request) {
  try {
    const { resume, options } = await request.json();

    // Validate input
    if (!resume || !options?.format) {
      return NextResponse.json(
        { error: 'Invalid request. Resume and format are required.' },
        { status: 400 }
      );
    }

    const handler = new ExportHandler();
    let result;
    let contentType;
    let fileName;

    // Handle different export formats
    switch (options.format) {
      case 'docx':
        result = await handler.toWord(resume);
        contentType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
        fileName = 'resume.docx';
        break;
      case 'pdf':
        result = await handler.toPDF(resume);
        contentType = 'application/pdf';
        fileName = 'resume.pdf';
        break;
      case 'xml':
        result = handler.toXML(resume);
        contentType = 'application/xml';
        fileName = 'resume.xml';
        break;
      case 'csv':
        result = handler.toCSV(resume);
        contentType = 'text/csv';
        fileName = 'resume.csv';
        break;
      case 'markdown':
        result = handler.toMarkdown(resume);
        contentType = 'text/markdown';
        fileName = 'resume.md';
        break;
      case 'html':
        result = handler.toHTML(resume);
        contentType = 'text/html';
        fileName = 'resume.html';
        break;
      default:
        result = JSON.stringify(resume, null, 2);
        contentType = 'application/json';
        fileName = 'resume.json';
    }

    // Create response with appropriate headers
    return new Response(result, {
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `attachment; filename="${fileName}"`,
      },
    });

  } catch (error) {
    console.error('Export error:', error);
    return NextResponse.json(
      { error: 'Failed to export resume' },
      { status: 500 }
    );
  }
}