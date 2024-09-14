
'use client';
import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { useRouter } from 'next/navigation';

export default function InstructorPage() {
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '', '', '']);
  const [correctAnswer, setCorrectAnswer] = useState('');
  const [errors, setErrors] = useState<{ question?: string; options?: string[]; correctAnswer?: string }>({});

  const [data, setData] = useState([]);

  const router = useRouter()
  
  useEffect(() => {
    const callMain = async () => {
      const res = await fetch('/api/questions',{
        method:'GET',
        headers:{'Content-Type': 'application/json' },
      })

      if(res.ok){
        const jsonData = await res.json();
        return setData(jsonData);
      }else{
        console.error('Failed to fetch questions')
      }
    }
    
    callMain();
  },[])

  console.log(data)

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const submitQuestion = async () => {
    
    setErrors({});

    // Validation
  const newErrors: { question?: string; options?: string[]; correctAnswer?: string } = {};

  if (!question.trim()) {
    newErrors.question = 'Question is required';
  }
  
  if (options.some(opt => !opt.trim())) {
    newErrors.options = options.map(opt => opt.trim() ? '' : 'Option is required');
  }

  if (!correctAnswer.trim()) {
    newErrors.correctAnswer = 'Correct answer is required';
  }

  if (Object.keys(newErrors).length > 0) {
    setErrors(newErrors);
    return; // Stop form submission if validation errors exist
  }

    const result = await Swal.fire({
      title:"Are you sure?",
      text: 'Do you want to add this question?',
      icon: 'warning',
      showCancelButton: true, 
      confirmButtonText: 'Yes',
      cancelButtonText: 'cancel',
      customClass: {
        confirmButton: 'custom-confirm-button',
        cancelButton: 'custom-cancel-button',
      }
    })

    if(result.isConfirmed){
      const newQuestion = { question, options, correctAnswer };

      const res = await fetch('/api/questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newQuestion),
      });
  
      if (res.ok) {
        Swal.fire({
          title:"Question Added",
          text: 'Qusetion added successfully',
          icon: 'success',
          confirmButtonText: 'Ok',
          customClass: {
            confirmButton: 'custom-confirm-button',
          }
        })
        setQuestion('');
        setOptions(['', '', '', '']);
        setCorrectAnswer('');
      } else {

        Swal.fire({
          title:"Something Happend",
          text: 'Failed to add question',
          icon: 'error',
          confirmButtonText: 'Ok',
          customClass: {
            confirmButton: 'custom-confirm-button',
          }
        })
      }
    }
  };

  const handleHome = async () => {
    const result = await Swal.fire({
      title:"Are you sure?",
      text: 'Do you want return to home',
      icon: 'warning',
      showCancelButton: true, 
      confirmButtonText: 'Yes',
      cancelButtonText: 'cancel',
      customClass: {
        confirmButton: 'custom-confirm-button',
        cancelButton: 'custom-cancel-button',
      }
    })

    if(result.isConfirmed){
      router.push('/')
    }else{
      return;
    }
  }


  return (
    <div>
      <h1 className='font-bold text-2xl text-center mb-5 text-white'>Instructor Dashboard</h1>
      <div className='flex justify-center items-center'>
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Enter your question"
          className={`border-spacing-1 border-gray-600 border rounded-md ml-1 text-black ${errors.question ? 'border-red-600' : ''}`}
        />
        {errors.question && <p className='text-red-600'>{errors.question}</p>}
      </div>
  
      <div className='flex-col flex justify-center items-center'>
        {options.map((opt, index) => (
          <div key={index}>
            <input
              type="text"
              value={opt}
              onChange={(e) => handleOptionChange(index, e.target.value)}
              placeholder={`Option ${index + 1}`}
              className={`border-spacing-1 border-black border rounded-md ml-1 mt-2 text-black ${errors.options?.[index] ? 'border-red-600' : ''}`}
            />
            {errors.options?.[index] && <p className='text-red-600'>{errors.options[index]}</p>}
          </div>
        ))}
        <input
          type="text"
          value={correctAnswer}
          onChange={(e) => setCorrectAnswer(e.target.value)}
          placeholder="Correct Answer"
          className={`border-spacing-1 border-gray-600 border rounded-md ml-1 mt-2 text-black ${errors.correctAnswer ? 'border-red-600' : ''}`}
        />
        {errors.correctAnswer && <p className='text-red-600'>{errors.correctAnswer}</p>}
        <button onClick={submitQuestion} className='bg-zinc-700 ml-2 rounded-md text-white pl-1 pr-1 mt-2'>Add question</button>
        <button onClick={handleHome} className='bg-zinc-700 ml-2 rounded-md text-white pl-1 pr-1 mt-2'>Back to Home</button>
      </div>
  
      <p className='ml-5 font-bold'>Total questions {data?.length}</p>
      <div className="max-h-40 overflow-y-auto mt-10 bg-black text-white pl-5">
        {data?.map((ele: any, index: number) => (
          <div key={index}>
            <br />
            <h3>{ele?.question}</h3>
            {/* <ul>
            {ele?.options.map((option: string, i: number) => (
              <li key={i}>{option}</li>
           ))}
         </ul> */} 
            <p>Correct Answer : {ele?.correctAnswer}</p>
          </div>
        ))}
      </div>
    </div>
  );  

 }
