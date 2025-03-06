import { Router, Request, Response } from 'express';
import multer from 'multer';
import { ResumeParser } from '../services/resumeParser';

const upload = multer({
  dest: 'uploads/',
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type'));
    }
  }
});

const router = Router();
const parser = new ResumeParser();

router.post('/parse', upload.single('resume'), async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({ error: 'No file uploaded' });
      return;
    }

    const parsedResume = await parser.parse(req.file.path, req.file.mimetype);
    res.json({ resume: parsedResume });
    return;

  } catch (error) {
    res.status(500).json({ 
      error: error instanceof Error ? error.message : 'Failed to parse resume' 
    });
    return;
  }
});

export const resumeRouter = router;