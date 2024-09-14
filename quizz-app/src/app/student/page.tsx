'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';

type QuizQuestion = {
  question: string;
  options: string[];
  correctAnswer: string;
};

export default function StudentPage() {
  const [quizdata, setQuizData] = useState<QuizQuestion[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<QuizQuestion | null>(null);
  const [quizIterator, setQuizIterator] = useState<Iterator<QuizQuestion>>();
  const [answers, setAnswers] = useState<Record<number, string>>({}); // Store answers by question index
  const [hasMoreQuestions, setHasMoreQuestions] = useState<boolean>(true); // Track if more questions are available
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  const [result, setResult] = useState<number>(0)
  const router = useRouter();

  useEffect(() => {
    const fetchQuizData = async () => {
      const res = await fetch('/api/questions', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await res.json();
      setQuizData(data);

      const iterator = data.values(); // Create iterator from data
      setQuizIterator(iterator); // Set iterator in state

      const firstQuestion = iterator.next().value;
      setCurrentQuestion(firstQuestion); // Initialize the first question
    };

    fetchQuizData();
  }, []);

  const nextQuestion = () => {
    if (quizIterator) {

      const next = quizIterator.next();
      if (!next.done) {
        setCurrentQuestion(next.value);
        setCurrentIndex((prev) => prev + 1);
        setHasMoreQuestions(true);
        
      } else {
       
        setHasMoreQuestions(false);
       
      }
    }
  };

  const handleAnswerChange =  (answer: string) => {
    setAnswers({ ...answers, [currentIndex]: answer });
    console.log(answers)
  };

  const submitQuiz = async () => {
    try {
      const result = await Swal.fire({
        title:"Are you sure?",
        text: 'You want to submit it?',
        icon: 'warning',
        showCancelButton: true, 
        confirmButtonText: 'Submit',
        cancelButtonText: 'Restart',
        customClass: {
          confirmButton: 'custom-confirm-button',
          cancelButton: 'custom-cancel-button',
        }
      })

      if(result.isConfirmed){
        const res = await fetch('/api/validate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(answers),
        });
    
        if (res.ok) {
          const data = await res.json();
          console.log('Quiz Results:', data);
          setResult(data.length)
          router.push(`/result?score=${data.length}&total=${quizdata.length}`);
        }
      }else{
       window.location.reload();
      }

    } catch (error) {
      console.log(error)
    }
   
  };

  return (
  <div className='text-center'>
  <h1 className='text-center mt-2 font-bold text-3xl'>Quiz {currentIndex+1}/{quizdata?.length}</h1>
  {currentQuestion && (
    <div className='text-center mt-2'>
      <p className='text-xl mb-2'>{currentQuestion.question}</p>
      {currentQuestion.options.map((opt: string, optIndex: number) => (
       <div className='flex-col 'key={optIndex}>
         <label key={optIndex}>
          <input
            type="radio"
            name={`question-${currentIndex}`}
            value={opt}
            onChange={() => handleAnswerChange(opt)}
            className='ml-1'
          />
          {opt}
        </label>
       </div>
      ))}
    </div>
  )}
  {hasMoreQuestions ? (
    <button onClick={nextQuestion} className="bg-zinc-700 ml-2 rounded-md text-white pl-2 pr-2 mt-3">
      Next
    </button>
  ) : (
    <button onClick={submitQuiz} className='bg-zinc-700 ml-2 rounded-md text-white pl-2 pr-2 mt-3'>
    Submit
  </button> 
  )}

  {/* <div className='mt-3 text-3xl'>
    {result > 0 ? <h1>{result} Out of {quizdata.length}</h1>: ""}
  </div> */}
</div>

  );
}
