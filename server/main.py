from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

@app.route("/chat", methods=["POST"])
def chat():
    data = request.get_json()  # Get data from the frontend
    user_message = data.get("message", "")

    # Replace this logic with your chatbot's processing logic
    if "security" in user_message.lower():
        response_message = "It seems like you're asking about security vulnerabilities. Here's what I can tell you: ..."
    elif "hello" in user_message.lower():
        response_message = "Hello! How can I assist you today?"
    else:
        response_message = "I'm not sure I understand. Can you elaborate?"

    return jsonify({"response": response_message})

if __name__ == "__main__":
    app.run(debug=True)