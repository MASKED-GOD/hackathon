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
    const baseClasses = "quiz-option p-4 rounded-lg cursor-pointer transition-colors duration-300 hover:bg-hover-bg";
    
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
    <div className="quiz-container p-8">
      <h2 className="text-3xl font-bold mb-8 text-center text-gold">Generated Quiz</h2>
      <div className="space-y-8">
        {quiz.quiz.map((question, index) => (
          <div key={index} className="border-b border-border-color pb-6 last:border-b-0">
            <h3 className="question-title">
              {index + 1}. {question.question}
            </h3>
            <div className="space-y-3">
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
              <div className="mt-3 text-success font-medium pl-4 border-l-2 border-success">
                Correct answer: {question.correct_answer}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-10">
        {!isSubmitted ? (
          <button
            onClick={handleSubmit}
            disabled={Object.keys(selectedAnswers).length !== quiz.quiz.length}
            className={`generate-button w-full py-3 px-6 rounded-lg font-medium transition-all duration-300 ${
              Object.keys(selectedAnswers).length !== quiz.quiz.length ? 'opacity-50' : ''
            }`}
          >
            Submit Answers
          </button>
        ) : (
          <div className="space-y-6">
            <div className="score-display">
              Your Score: {calculateScore()} out of {quiz.quiz.length}
            </div>
            <button
              onClick={handleRetake}
              className="generate-button w-full py-3 px-6 rounded-lg font-medium transition-all duration-300"
            >
              Retake Quiz
            </button>
          </div>
        )}
      </div>
    </div>
  );
} 