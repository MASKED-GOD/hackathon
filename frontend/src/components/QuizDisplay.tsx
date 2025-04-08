'use client';

import { useState } from 'react';

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
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: string }>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!quiz || !quiz.quiz || !Array.isArray(quiz.quiz)) {
    return (
      <div className="p-6 text-error">
        Invalid quiz format. Please try again.
      </div>
    );
  }

  const handleAnswerSelect = (questionIndex: number, answer: string) => {
    if (!isSubmitted) {
      setSelectedAnswers(prev => ({
        ...prev,
        [questionIndex]: answer
      }));
    }
  };

  const calculateScore = () => {
    let correct = 0;
    quiz.quiz.forEach((question, index) => {
      if (selectedAnswers[index] === question.correct_answer) {
        correct++;
      }
    });
    return correct;
  };

  const handleSubmit = () => {
    setIsSubmitted(true);
  };

  const handleRetake = () => {
    setSelectedAnswers({});
    setIsSubmitted(false);
  };

  const getOptionClassName = (questionIndex: number, option: string) => {
    const baseClasses = "quiz-option p-3 rounded-md cursor-pointer transition-colors duration-200 hover:bg-hover-bg";
    
    if (!isSubmitted) {
      return `${baseClasses} ${selectedAnswers[questionIndex] === option ? 'selected' : ''}`;
    }

    if (option === quiz.quiz[questionIndex].correct_answer) {
      return `${baseClasses} correct`;
    }

    if (selectedAnswers[questionIndex] === option) {
      return `${baseClasses} incorrect`;
    }

    return baseClasses;
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Generated Quiz</h2>
      <div className="space-y-6">
        {quiz.quiz.map((question, index) => (
          <div key={index} className="border-b border-border-color pb-4 last:border-b-0">
            <h3 className="text-lg font-medium mb-3">
              {index + 1}. {question.question}
            </h3>
            <div className="space-y-2">
              {Array.isArray(question.options) && question.options.map((option) => (
                <div
                  key={option}
                  onClick={() => handleAnswerSelect(index, option)}
                  className={getOptionClassName(index, option)}
                >
                  {option}
                </div>
              ))}
            </div>
            {isSubmitted && selectedAnswers[index] !== question.correct_answer && (
              <div className="mt-2 text-success font-medium">
                Correct answer: {question.correct_answer}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-8">
        {!isSubmitted ? (
          <button
            onClick={handleSubmit}
            disabled={Object.keys(selectedAnswers).length !== quiz.quiz.length}
            className={`generate-button w-full py-2 px-4 rounded-md font-medium transition-colors duration-200 ${
              Object.keys(selectedAnswers).length !== quiz.quiz.length ? 'opacity-50' : ''
            }`}
          >
            Submit Answers
          </button>
        ) : (
          <div className="space-y-4">
            <div className="score-display">
              Your Score: {calculateScore()} out of {quiz.quiz.length}
            </div>
            <button
              onClick={handleRetake}
              className="generate-button w-full py-2 px-4 rounded-md font-medium transition-colors duration-200"
            >
              Retake Quiz
            </button>
          </div>
        )}
      </div>
    </div>
  );
} 