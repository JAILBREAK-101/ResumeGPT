import { Router, Request, Response, RequestHandler } from 'express';
// import { ParamsDictionary } from 'express-serve-static-core';
import multer from 'multer';
import path from 'path';
import { ResumeParser } from '../services/resumeParser';

interface MulterRequest extends Request {
  file?: Express.Multer.File;
}

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

const parseHandler: RequestHandler = async (req: MulterRequest, res: Response): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({ error: 'No file uploaded' });
      return;
    }

    const parsedResume = await parser.parse(req.file.path, req.file.mimetype);
    
    res.json({ 
      success: true,
      resume: parsedResume 
    });

  } catch (error) {
    console.error('Resume parsing error:', error);
    res.status(500).json({ 
      success: false,
      error: error instanceof Error ? error.message : 'Failed to parse resume' 
    });
  }
};

router.post('/parse', upload.single('resume'), parseHandler);

export const fileRouter = router;