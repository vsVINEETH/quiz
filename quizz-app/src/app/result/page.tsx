'use client';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function ResultPage() {
  const searchParams = useSearchParams();
  const score = searchParams.get('score');
  const total = searchParams.get('total');

  return (
    <div className='text-center mt-5'>
      <h1 className='text-3xl font-bold'>Quiz Results</h1>
      <p className='text-xl mt-3'>You scored {score} out of {total}.</p>
      <Link href='/student'>
      <button className='bg-zinc-700 ml-2 rounded-md text-white pl-2 pr-2 mt-3'>Try Again</button>
      </Link>
    </div>
  );
}
