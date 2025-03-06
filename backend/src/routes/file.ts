import { Router, Request } from 'express';
import multer from 'multer';
import path from 'path';
import { ResumeParser } from '../services/resumeParser';

// Configure multer
const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
    cb(null, `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF and DOCX files are allowed.'));
    }
  }
});

const router = Router();
const parser = new ResumeParser();

router.post('/parse', upload.single('resume'), async (req: Request & { file?: Express.Multer.File}, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const parsedResume = await parser.parse(req.file.path, req.file.mimetype);
    
    return res.json({ 
      success: true,
      resume: parsedResume 
    });

  } catch (error) {
    console.error('Resume parsing error:', error);
    return res.status(500).json({ 
      success: false,
      error: error instanceof Error ? error.message : 'Failed to parse resume' 
    });
  }
});

export const fileRouter = router;