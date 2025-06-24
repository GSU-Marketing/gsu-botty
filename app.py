from flask import Flask, request, jsonify
from chatbot import ask_openai
from crawler import crawl_page

app = Flask(__name__)

# You can change this to match the real program pages later
DEFAULT_URL = "https://graduate.gsu.edu/degree-programs/"

@app.route("/ask", methods=["POST"])
def handle_question():
    data = request.json
    question = data.get("question", "")
    use_url = data.get("url", DEFAULT_URL)

    # Crawl GSU page content
    context = crawl_page(use_url)

    # Ask OpenAI
    answer = ask_openai(question, context)
    return jsonify({"answer": answer})

@app.route("/")
def index():
    return "GSU Chatbot is running."

if __name__ == "__main__":
    app.run(debug=True)
