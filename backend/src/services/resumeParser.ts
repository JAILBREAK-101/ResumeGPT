import { openai } from '../config/openai';
import { extractTextFromPDF, extractTextFromDOCX } from '../utils/fileExtractor';
import type { Resume } from '../types/resume';

export class ResumeParser {
  private readonly systemPrompt = `You are a precise resume parser. Extract and structure the following information:
  - name: Full name of the candidate
  - email: Email address
  - phone: Phone number in E.164 format
  - skills: Array of individual skills
  - experience: Array of work experiences with:
    - company: Company name
    - position: Job title
    - startDate: Start date (YYYY-MM format)
    - endDate: End date (YYYY-MM format)
    - description: Array of bullet points describing responsibilities

  Return only valid JSON matching this structure without any additional text.`;

  async parse(filePath: string, fileType: string): Promise<Resume> {
    try {
      // Extract text based on file type
      const text = fileType === 'application/pdf' 
        ? await extractTextFromPDF(filePath)
        : await extractTextFromDOCX(filePath);

      // Split text into chunks if too large
      const chunks = this.chunkText(text, 4000);
      const results = await Promise.all(
        chunks.map(chunk => this.processChunk(chunk))
      );

      // Merge results if multiple chunks
      const mergedResult = this.mergeResults(results);
      
      // Validate final structure
      if (!this.validateResumeData(mergedResult)) {
        throw new Error('Invalid resume data structure');
      }

      return mergedResult;
    } catch (error) {
      throw new Error(`Resume parsing failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private async processChunk(text: string): Promise<Partial<Resume>> {
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: this.systemPrompt },
        { role: "user", content: text }
      ],
      temperature: 0.3,
      max_tokens: 2000
    });

    const content = completion.choices[0].message?.content;
    if (!content) {
      throw new Error('No response from OpenAI');
    }

    return JSON.parse(content);
  }

  private chunkText(text: string, maxLength: number): string[] {
    if (text.length <= maxLength) return [text];
    
    const chunks: string[] = [];
    let current = '';
    const sentences = text.split(/[.!?]+/);

    for (const sentence of sentences) {
      if ((current + sentence).length > maxLength) {
        chunks.push(current);
        current = sentence;
      } else {
        current += sentence;
      }
    }
    if (current) chunks.push(current);
    return chunks;
  }

  private mergeResults(results: Partial<Resume>[]): Resume {
    return {
      name: results[0].name || '',
      email: results[0].email || '',
      phone: results[0].phone || '',
      skills: [...new Set(results.flatMap(r => r.skills || []))],
      experience: results.flatMap(r => r.experience || [])
    };
  }

  private validateResumeData(data: any): data is Resume {
    return (
      typeof data === 'object' &&
      typeof data.name === 'string' &&
      typeof data.email === 'string' &&
      typeof data.phone === 'string' &&
      Array.isArray(data.skills) &&
      Array.isArray(data.experience) &&
      data.experience.every((exp: any) =>
        typeof exp.company === 'string' &&
        typeof exp.position === 'string' &&
        typeof exp.startDate === 'string' &&
        typeof exp.endDate === 'string' &&
        Array.isArray(exp.description)
      )
    );
  }
}