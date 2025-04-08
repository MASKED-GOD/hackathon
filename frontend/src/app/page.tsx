'use client';

import { useState, useEffect } from 'react';
import { QuizForm } from '../components/QuizForm';
import { QuizDisplay } from '../components/QuizDisplay';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5000';

export default function Home() {
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [backendStatus, setBackendStatus] = useState('checking');

  // Check backend connection on component mount
  useEffect(() => {
    const checkBackend = async () => {
      try {
        const response = await fetch(`${API_URL}/test`, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          },
        });
        
        if (response.ok) {
          setBackendStatus('connected');
          setError('');
        } else {
          setBackendStatus('error');
          setError('Backend server is running but returned an error.');
        }
      } catch (err) {
        console.error('Backend connection error:', err);
        setBackendStatus('error');
        setError('Could not connect to the backend server. Please make sure it is running.');
      }
    };

    checkBackend();
  }, []);

  const generateQuiz = async (formData: any) => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`${API_URL}/generate-quiz`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(formData),
        credentials: 'include',
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate quiz');
      }

      try {
        const parsedQuiz = JSON.parse(data.quiz);
        setQuiz(parsedQuiz);
      } catch (e) {
        console.error('JSON parsing error:', e);
        throw new Error('Invalid quiz format received from server');
      }
    } catch (err: any) {
      console.error('API error:', err);
      if (err.message === 'Failed to fetch') {
        setError('Could not connect to the server. Please make sure the backend is running.');
      } else {
        setError(err.message || 'Failed to generate quiz. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8">AI Quiz Generator</h1>
        <p className="text-center mb-8 text-foreground/80">Generate quizzes using Google's Gemini AI</p>
        
        {/* Backend status indicator */}
        <div className={`text-center mb-4 ${
          backendStatus === 'connected' ? 'status-connected' :
          backendStatus === 'error' ? 'status-error' :
          'text-yellow-500'
        }`}>
          {backendStatus === 'connected' && '✓ Connected to backend'}
          {backendStatus === 'error' && '✗ Not connected to backend'}
          {backendStatus === 'checking' && '⟳ Checking backend connection...'}
        </div>

        <div className="bg-input-bg rounded-lg shadow-lg overflow-hidden border border-border-color">
          <QuizForm onSubmit={generateQuiz} loading={loading} />
          {error && (
            <div className="p-4 mx-6 mb-6 text-error bg-error/10 rounded-md border border-error/20">
              {error}
            </div>
          )}
          {quiz && <QuizDisplay quiz={quiz} />}
        </div>
      </div>
    </main>
  );
}
