
import Button from "@/components/Button";
import Image from "next/image";
export default function Home() {
  return (
    <main>
      <div className="container">
        <h1 className="text-2xl text-center font-bold mt-3">Welcome to quizz hub</h1>
        <div className="mt-5 flex justify-center">
        <Image
          src="/assets/quiz.png" // Path to image in the 'public' folder
          alt="Quiz Hub"
          width={500} // Specify width in pixels
          height={300} // Specify height in pixels
          priority={true} // Optionally prioritize the image loading
        />
      </div>
        <Button/>
      </div>
    </main>
  );
}
