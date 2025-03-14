import { NextRequest, NextResponse } from 'next/server';

// File validation
const allowedFileTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
const maxFileSize = 10 * 1024 * 1024; // 10MB

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('resume') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate file type and size
    if (!allowedFileTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type' },
        { status: 400 }
      );
    }

    if (file.size > maxFileSize) {
      return NextResponse.json(
        { error: 'File too large' },
        { status: 400 }
      );
    }

    // Forward to backend API
    const backendResponse = await fetch(`${process.env.BACKEND_URL}/api/parse`, {
      method: 'POST',
      body: formData,
    });

    if (!backendResponse.ok) {
      const error = await backendResponse.json();
      throw new Error(error.message || 'Backend processing failed');
    }

    const resume = await backendResponse.json();
    return NextResponse.json({ resume });

  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to process resume' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { message: 'Upload endpoint is working' },
    { status: 200 }
  );
}