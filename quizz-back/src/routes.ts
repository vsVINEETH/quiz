import { Router } from 'express';
import { addQuestion, getQuestions, validate } from './controllers/instructor';

const router = Router();

router.post('/questions', addQuestion);
router.get('/questions', getQuestions);
router.post('/validate', validate)

export default router;
