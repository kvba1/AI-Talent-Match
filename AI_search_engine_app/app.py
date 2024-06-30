from flask import Flask, jsonify, request
from similarity_search import get_top_N_candidates
from flask_cors import CORS
from werkzeug.utils import secure_filename
import os
import mimetypes

app = Flask(__name__)
CORS(app)

current_file_path = None

@app.route('/upload', methods=['POST'])
def upload_file():
    global current_file_path
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    
    if file.content_type != 'application/pdf':
        return jsonify({'error': 'Only PDF files are allowed'}), 400

    if file:
        filename = secure_filename(file.filename)
        filepath = os.path.join('./data/file/', filename)
        file.save(filepath)
        current_file_path = filepath
        return jsonify({'message': 'File successfully uploaded', 'result': filename}), 200

@app.route('/top_candidates', methods=['GET'])
def get_top_candidates():
    global current_file_path
    if not current_file_path:
        return jsonify({'error': 'No file has been uploaded'}), 400

    try:
        n = int(request.args.get('n', 10))
        top_candidates = get_top_N_candidates(n, current_file_path)
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