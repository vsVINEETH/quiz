// src/models/questions.ts

import mongoose from "mongoose";

mongoose
.connect('mongodb://localhost:27017/quiz')
.then((con) => {
    console.log('DB connected successfully to questions collection')
})
.catch((err) => {
    console.log("something went wrong check your user collection", err)
})

// Define the schema for the Question model
const questionSchema = new mongoose.Schema({
  question: String,
  options: [String],  // Define the type of elements in the options array
  correctAnswer: String,
});

// Create the model based on the schema
const QuestionModel = mongoose.model("Question", questionSchema);

export default QuestionModel;
