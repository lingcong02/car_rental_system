import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(req: Request) {
  // Create upload directory if it doesn't exist
  const uploadDir = path.join(process.cwd(), 'public', 'vehicles_image');
  try {
    await fs.access(uploadDir);
  } catch {
    await fs.mkdir(uploadDir, { recursive: true });
  }

  const formData = await req.formData();
  const files = formData.getAll('images') as File[];

  if (!files || files.length === 0) {
    return NextResponse.json(
      { error: 'No files uploaded' },
      { status: 400 }
    );
  }

  const uploadedFiles = [];

  for (const file of files) {
    const buffer = await file.arrayBuffer();
    const fileName = `${Date.now()}-${file.name.replace(/\s+/g, '-')}`;
    const filePath = path.join(uploadDir, fileName);

    await fs.writeFile(filePath, Buffer.from(buffer));
    uploadedFiles.push(`/vehicles_image/${fileName}`);
  }

  return NextResponse.json({
    success: true,
    files: uploadedFiles
  });
}