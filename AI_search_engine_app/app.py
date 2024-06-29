from flask import Flask, jsonify, request
from similarity_search import get_top_N_candidates
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/top_candidates', methods=['GET'])
def get_top_candidates():
    try:
        n = int(request.args.get('n', 10))  # Default to top 10 candidates if not specified
        top_candidates = get_top_N_candidates(n)
        response = [
            {
                'category': candidate.category,
                'resume': candidate.resume,
                'phone_number': candidate.phone_number,
                'email': candidate.email,
                'first_name': candidate.first_name,
                'last_name': candidate.last_name,
                'score': candidate.score,
            }
            for candidate in top_candidates
        ]
        return jsonify(response)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001, debug=True)