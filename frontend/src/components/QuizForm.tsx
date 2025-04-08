'use client';

import { useState } from 'react';

interface QuizFormProps {
  onSubmit: (data: any) => void;
  loading: boolean;
}

export function QuizForm({ onSubmit, loading }: QuizFormProps) {
  const [formData, setFormData] = useState({
    topic: '',
    subject: '',
    grade: '',
    num_questions: '5',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      num_questions: parseInt(formData.num_questions) || 5,
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (name === 'num_questions') {
      const numValue = parseInt(value);
      if (isNaN(numValue) || numValue < 1) {
        return;
      }
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="topic" className="block text-sm font-medium">
            Topic
          </label>
          <input
            type="text"
            id="topic"
            name="topic"
            value={formData.topic}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 rounded-md focus:ring-2 focus:ring-primary"
            placeholder="e.g., Gravity"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="subject" className="block text-sm font-medium">
            Subject
          </label>
          <input
            type="text"
            id="subject"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 rounded-md focus:ring-2 focus:ring-primary"
            placeholder="e.g., Physics"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="grade" className="block text-sm font-medium">
            Grade Level
          </label>
          <input
            type="text"
            id="grade"
            name="grade"
            value={formData.grade}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 rounded-md focus:ring-2 focus:ring-primary"
            placeholder="e.g., 9th"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="num_questions" className="block text-sm font-medium">
            Number of Questions
          </label>
          <input
            type="number"
            id="num_questions"
            name="num_questions"
            value={formData.num_questions}
            onChange={handleChange}
            min="1"
            max="20"
            required
            className="w-full px-3 py-2 rounded-md focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>

      <div className="mt-6">
        <button
          type="submit"
          disabled={loading}
          className={`generate-button w-full py-2 px-4 rounded-md font-medium transition-colors duration-200 ${
            loading ? 'opacity-50' : ''
          }`}
        >
          {loading ? 'Generating Quiz...' : 'Generate Quiz'}
        </button>
      </div>
    </form>
  );
} 