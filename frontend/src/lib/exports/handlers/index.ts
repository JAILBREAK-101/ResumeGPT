import { Resume } from '@/lib/types/resume';
import { Document, Paragraph, HeadingLevel, Packer, TextRun } from 'docx';
import { jsPDF } from 'jspdf';
import json2xml from 'json2xml';
import { Parser } from 'json2csv';

export class ExportHandler {
  async toWord(resume: Resume): Promise<Buffer> {
    try {
      const doc = new Document({
        sections: [{
          properties: {},
          children: [
            new Paragraph({
              text: resume.name,
              heading: HeadingLevel.HEADING_1
            }),
            new Paragraph({
              children: [
                new TextRun(`Email: ${resume.email} | Phone: ${resume.phone}`)
              ]
            }),
            new Paragraph({
              text: 'Skills',
              heading: HeadingLevel.HEADING_2
            }),
            new Paragraph({
              children: resume.skills.map(skill => 
                new TextRun(`• ${skill}\n`)
              )
            }),
            ...resume.experience.map(exp => [
              new Paragraph({
                text: exp.company,
                heading: HeadingLevel.HEADING_3
              }),
              new Paragraph({
                children: [
                  new TextRun(`${exp.position} (${exp.startDate} - ${exp.endDate})\n`)
                ]
              }),
              ...exp.description.map(desc => 
                new Paragraph({ text: `• ${desc}` })
              )
            ]).flat()
          ]
        }]
      });
      return Packer.toBuffer(doc);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      throw new Error(`Failed to create Word document: ${errorMessage}`);
    }
  }

  async toPDF(resume: Resume): Promise<Buffer> {
    try {
      const doc = new jsPDF();
      let yPos = 20;
      const margin = 20;
      const lineHeight = 10;

      // Header
      doc.setFontSize(24);
      doc.text(resume.name, margin, yPos);
      yPos += lineHeight * 2;

      // Contact
      doc.setFontSize(12);
      doc.text(`Email: ${resume.email} | Phone: ${resume.phone}`, margin, yPos);
      yPos += lineHeight * 2;

      // Skills
      doc.setFontSize(16);
      doc.text('Skills', margin, yPos);
      yPos += lineHeight;
      doc.setFontSize(12);
      resume.skills.forEach(skill => {
        doc.text(`• ${skill}`, margin, yPos);
        yPos += lineHeight;
      });

      // Experience
      yPos += lineHeight;
      doc.setFontSize(16);
      doc.text('Experience', margin, yPos);
      yPos += lineHeight;

      resume.experience.forEach(exp => {
        doc.setFontSize(14);
        doc.text(exp.company, margin, yPos);
        yPos += lineHeight;
        doc.setFontSize(12);
        doc.text(`${exp.position} (${exp.startDate} - ${exp.endDate})`, margin, yPos);
        yPos += lineHeight;
        exp.description.forEach(desc => {
          doc.text(`• ${desc}`, margin, yPos);
          yPos += lineHeight;
        });
        yPos += lineHeight;
      });

      return Buffer.from(doc.output('arraybuffer'));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      throw new Error(`Failed to create PDF: ${errorMessage}`);
    }
  }

  toXML(resume: Resume): string {
    try {
      return json2xml(resume);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      throw new Error(`Failed to convert to XML: ${errorMessage}`);
    }
  }

  toCSV(resume: Resume): string {
    try {
      const parser = new Parser();
      return parser.parse(resume);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      throw new Error(`Failed to convert to CSV: ${errorMessage}`);
    }
  }

  toMarkdown(resume: Resume): string {
    try {
      return `# ${resume.name}
## Contact
- Email: ${resume.email}
- Phone: ${resume.phone}

## Skills
${resume.skills.map(skill => `- ${skill}`).join('\n')}

## Experience
${resume.experience.map(exp => `
### ${exp.company}
**${exp.position}** (${exp.startDate} - ${exp.endDate})
${exp.description.map(desc => `- ${desc}`).join('\n')}
`).join('\n')}`;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      throw new Error(`Failed to convert to Markdown: ${errorMessage}`);
    }
  }

  toHTML(resume: Resume): string {
    try {
      return `
<!DOCTYPE html>
<html>
<head>
  <title>${resume.name} - Resume</title>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; margin: 40px; }
    h1 { color: #2c3e50; }
    h2 { color: #34495e; border-bottom: 2px solid #eee; }
    .contact { margin-bottom: 20px; }
    .skills { margin: 20px 0; }
    .experience { margin: 20px 0; }
    .job { margin-bottom: 15px; }
    .job-header { font-weight: bold; }
    ul { list-style-type: none; padding-left: 0; }
  </style>
</head>
<body>
  <h1>${resume.name}</h1>
  <div class="contact">
    <p>Email: ${resume.email} | Phone: ${resume.phone}</p>
  </div>
  <div class="skills">
    <h2>Skills</h2>
    <ul>
      ${resume.skills.map(skill => `<li>${skill}</li>`).join('\n      ')}
    </ul>
  </div>
  <div class="experience">
    <h2>Experience</h2>
    ${resume.experience.map(exp => `
    <div class="job">
      <h3>${exp.company}</h3>
      <p class="job-header">${exp.position} (${exp.startDate} - ${exp.endDate})</p>
      <ul>
        ${exp.description.map(desc => `<li>${desc}</li>`).join('\n        ')}
      </ul>
    </div>`).join('\n    ')}
  </div>
</body>
</html>`;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      throw new Error(`Failed to convert to HTML: ${errorMessage}`);
    }
  }
}