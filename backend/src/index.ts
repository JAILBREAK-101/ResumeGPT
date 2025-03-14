import './config/env'; 
import express from 'express';
import cors from 'cors';
import { resumeRouter } from './routes/resume';

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use('/api', resumeRouter);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});