import pdf from 'pdf-parse';
import mammoth from 'mammoth';
import fs from 'fs/promises';

export async function extractTextFromPDF(filePath: string): Promise<string> {
  try {
    const dataBuffer = await fs.readFile(filePath);
    const data = await pdf(dataBuffer);
    return data.text
      .replace(/[\r\n]+/g, '\n')
      .replace(/\s+/g, ' ')
      .trim();
  } catch (error) {
    throw new Error(`PDF extraction failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function extractTextFromDOCX(filePath: string): Promise<string> {
  try {
    const dataBuffer = await fs.readFile(filePath);
    const result = await mammoth.extractRawText({ buffer: dataBuffer });
    return result.value
      .replace(/[\r\n]+/g, '\n')
      .replace(/\s+/g, ' ')
      .trim();
  } catch (error) {
    throw new Error(`DOCX extraction failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}