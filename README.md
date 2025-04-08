# AI Quiz Generator

An AI-powered quiz generator that helps teachers create interactive quizzes for their students. The application uses OpenAI's GPT-3.5 to generate quizzes based on user inputs such as topic, subject, grade level, and number of questions.

## Features

- Generate quizzes based on custom parameters
- Multiple choice questions with correct answers
- Modern and responsive UI
- Real-time quiz generation
- Easy to use interface

## Tech Stack

- Frontend: Next.js, TypeScript, Tailwind CSS
- Backend: Python Flask
- AI: OpenAI GPT-3.5

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- Python (v3.8 or higher)
- OpenAI API key

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create a virtual environment:
   ```bash
   python -m venv venv
   ```

3. Activate the virtual environment:
   - Windows:
     ```bash
     venv\Scripts\activate
     ```
   - Unix/MacOS:
     ```bash
     source venv/bin/activate
     ```

4. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

5. Create a `.env` file and add your OpenAI API key:
   ```
   OPENAI_API_KEY=your_openai_api_key_here
   ```

6. Run the Flask server:
   ```bash
   python app.py
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

1. Fill in the quiz parameters:
   - Topic
   - Subject
   - Grade Level
   - Number of Questions

2. Click "Generate Quiz" to create a new quiz

3. The generated quiz will appear below the form with questions and answers

## Deployment

### Backend Deployment

The backend can be deployed to any Python-compatible hosting service (e.g., Heroku, PythonAnywhere, or AWS).

1. Set up your environment variables on the hosting platform
2. Deploy your Flask application
3. Update the frontend API URL to point to your deployed backend

### Frontend Deployment

The frontend can be deployed to Vercel or any other static hosting service:

1. Push your code to a Git repository
2. Connect your repository to your hosting service
3. Configure the environment variables
4. Deploy your application

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 