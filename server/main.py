import openai
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

# Initialize Flask app
app = Flask(__name__)
CORS(app)

# Set OpenAI API key
openai.api_key = os.getenv("OPEN_AI_KEY")
if not openai.api_key:
    raise ValueError("OPEN_AI_KEY is not set in environment variables.")

@app.route("/chat", methods=["POST"])
def chat():
    """
    Chat endpoint for processing user messages and returning responses from OpenAI's GPT model.
    """
    data = request.get_json()
    user_message = data.get("message", "")

    if not user_message:
        return jsonify({"error": "No message provided."}), 400

    try:
        # Use the new OpenAI ChatCompletion.create API
        response = openai.ChatCompletion.create(
            model="gpt-4",  # Replace with "gpt-3.5-turbo" if desired
            messages=[
                {"role": "system", "content": "You are a helpful assistant."},
                {"role": "user", "content": user_message}
            ]
        )

        # Extract the assistant's reply
        bot_message = response["choices"][0]["message"]["content"]

    except Exception as e:
        print("Error:", e)
        return jsonify({"error": "An error occurred while processing your request."}), 500

    return jsonify({"response": bot_message})

if __name__ == "__main__":
    app.run(debug=True)