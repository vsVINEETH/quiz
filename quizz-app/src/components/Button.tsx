'use client'
import { useRouter } from 'next/navigation'
import React from 'react'

function Button() {
  const router = useRouter()
  const handleStart = () => {
    router.push('/student')
  }

  const handleAdd = () => {
    router.push('/instructor')
  }
  return (
    <div className='flex justify-center items-center mt-5'>
        <button onClick={handleStart} className='bg-zinc-700 font-bold p-2 rounded-md text-blue-50 ml-2'>Start Quizz</button>
        <button onClick={handleAdd} className='bg-zinc-700 font-bold p-2 rounded-md text-blue-50 ml-2'>Add Quizz</button>
    </div>
  )
}

export default Button

