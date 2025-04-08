from flask import Flask, request, jsonify
from flask_cors import CORS
import google.generativeai as genai
import os
import json
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
# Enable CORS for all routes and origins
CORS(app, supports_credentials=True)

# Initialize Gemini API
api_key = os.getenv('GEMINI_API_KEY')
if not api_key:
    raise ValueError("No Gemini API key found in environment variables")

# Configure Gemini
genai.configure(api_key=api_key)

# List available models
print("Available models:")
for m in genai.list_models():
    print(m.name)

# Initialize the model (using the correct model name)
model = genai.GenerativeModel('gemini-1.5-pro')

@app.route("/", methods=["GET"])
def health_check():
    return jsonify({"status": "healthy"}), 200

@app.route("/test", methods=["GET"])
def test():
    return jsonify({"message": "Backend is working!"}), 200

@app.route("/generate-quiz", methods=["POST", "OPTIONS"])
def generate_quiz():
    # Handle preflight request
    if request.method == "OPTIONS":
        return {"message": "preflight"}, 200

    try:
        data = request.json
        if not data:
            return jsonify({"error": "No data provided"}), 400

        topic = data.get("topic")
        subject = data.get("subject")
        grade = data.get("grade")
        num_questions = data.get("num_questions", 5)

        if not all([topic, subject, grade]):
            return jsonify({"error": "Missing required fields"}), 400
        
        prompt = f"""You are a quiz generator. Your task is to create a {num_questions}-question multiple-choice quiz for {grade} grade students about {topic} in {subject}.

Rules:
1. Generate exactly {num_questions} questions
2. Each question must have exactly 4 options labeled as A, B, C, D
3. Provide one correct answer for each question
4. Response must be in valid JSON format
5. Do not include any explanations or additional text
6. Follow this exact JSON structure:

{{
    "quiz": [
        {{
            "question": "What is the question text?",
            "options": [
                "A) First option",
                "B) Second option",
                "C) Third option",
                "D) Fourth option"
            ],
            "correct_answer": "A) First option"
        }}
    ]
}}

Generate the quiz now, ensuring it's challenging but appropriate for {grade} grade level."""
        
        print(f"Sending prompt to Gemini: {prompt}")  # Debug log
        
        # Set generation config to ensure proper formatting
        response = model.generate_content(
            prompt,
            generation_config=genai.types.GenerationConfig(
                temperature=0.7,
                top_p=1.0,
                top_k=40,
                candidate_count=1,
            )
        )
        
        # Get text response
        quiz_data = response.text
        print(f"Received response from Gemini: {quiz_data}")  # Debug log
        
        # Validate JSON response
        try:
            parsed_data = json.loads(quiz_data)
            return jsonify({"quiz": quiz_data})
        except json.JSONDecodeError as e:
            print(f"JSON parsing error: {str(e)}")
            print(f"Response received: {quiz_data}")
            # Try to clean the response to get valid JSON
            try:
                # Find JSON content between curly braces
                start_idx = quiz_data.find('{')
                end_idx = quiz_data.rfind('}') + 1
                if start_idx >= 0 and end_idx > start_idx:
                    json_content = quiz_data[start_idx:end_idx]
                    parsed_data = json.loads(json_content)
                    return jsonify({"quiz": json_content})
                else:
                    return jsonify({"error": "Invalid quiz format received"}), 500
            except:
                return jsonify({"error": "Invalid quiz format received"}), 500
    
    except Exception as e:
        print(f"Error generating quiz: {str(e)}")  # Add logging
        return jsonify({"error": f"Failed to generate quiz: {str(e)}"}), 500

if __name__ == "__main__":
    # Get port from environment variable or default to 5000
    port = int(os.environ.get('PORT', 5000))
    # Run the app on 0.0.0.0 to make it accessible from other machines
    print(f"Starting Flask server on port {port}...")  # Debug log
    app.run(debug=False, host='0.0.0.0', port=port)
