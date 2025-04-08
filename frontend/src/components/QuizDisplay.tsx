'use client';

interface Question {
  question: string;
  options: string[];
  correct_answer: string;
}

interface Quiz {
  quiz: Question[];
}

interface QuizDisplayProps {
  quiz: Quiz;
}

export function QuizDisplay({ quiz }: QuizDisplayProps) {
  if (!quiz || !quiz.quiz || !Array.isArray(quiz.quiz)) {
    return (
      <div className="p-6 text-red-500">
        Invalid quiz format. Please try again.
      </div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Generated Quiz</h2>
      <div className="space-y-6">
        {quiz.quiz.map((question, index) => (
          <div key={index} className="border-b pb-4 last:border-b-0">
            <h3 className="text-lg font-medium mb-3">
              {index + 1}. {question.question}
            </h3>
            <div className="space-y-2">
              {Array.isArray(question.options) && question.options.map((option, optionIndex) => (
                <div
                  key={optionIndex}
                  className={`p-3 rounded-md ${
                    option === question.correct_answer
                      ? 'bg-green-100 border border-green-200'
                      : 'bg-gray-50 border border-gray-200'
                  }`}
                >
                  {option}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 