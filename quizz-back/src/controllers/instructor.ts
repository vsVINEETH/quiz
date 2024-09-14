// src/controllers/instructor.ts
import { Request, Response } from 'express';
import QuestionModel from '../models/questions'; // Import Mongoose model

export const addQuestion = async (req: Request, res: Response): Promise<void> => {
  try {
    const newQuestion = new QuestionModel(req.body);
    await newQuestion.save();
    res.status(201).json(newQuestion);
    
  } catch (error:any) {
    res.status(500).json({ message: error.message });
  }
};

export const getQuestions = async (req: Request, res: Response): Promise<void> => {
  try {
    const questions = await QuestionModel.find();
    res.json(questions);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const validate = async (req:Request, res:Response):Promise<any> => {
  try{
    const answers = req.body;
    console.log(answers)
    const questions = await QuestionModel.find();
   // const result = questions.length == answers.length
      const out = questions.filter((ele,i) => {
        console.log(answers[i])
        return ele.correctAnswer == answers[i] ? answers[i] : 0;
      }).filter(Boolean); // Remove any nulls from the output

      console.log(out);
    return res.status(201).json(out);

  }catch(error:any){
    res.status(500).json({ message: error.message });
  }
}
