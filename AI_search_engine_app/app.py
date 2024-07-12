from flask import Flask, jsonify, request
from similarity_search import get_top_N_candidates, create_candidate_objects
from flask_cors import CORS
from werkzeug.utils import secure_filename
import os
from database import add_top_candidates, delete_candidates, get_candidates_df
from dotenv import load_dotenv
from candidate import Candidate

app = Flask(__name__)
CORS(app)

load_dotenv()

db_path = os.getenv('DB_PATH')

if not db_path:
    raise ValueError("DB_PATH environment variable is not set.")

@app.route('/upload', methods=['POST'])
def upload_file():
    
        if 'file' not in request.files:
            return jsonify({'error': 'No file part'}), 400
        
        file = request.files['file']
        n = int(request.args.get('n', 10))
        
        if file.filename == '':
            return jsonify({'error': 'No selected file'}), 400
        
        if file.content_type != 'application/pdf':
            return jsonify({'error': 'Only PDF files are allowed'}), 400

        if file:
            filename = secure_filename(file.filename)
            upload_folder = './data/file/'
            os.makedirs(upload_folder, exist_ok=True)
            filepath = os.path.join(upload_folder, filename)
            file.save(filepath)        

            top_candidates = get_top_N_candidates(n, filepath)
            if top_candidates:
                add_top_candidates(db_path, top_candidates)
                
            if os.path.exists(filepath):
                os.remove(filepath)
            
            return jsonify({'success': 'File uploaded correctly'}), 200
                

@app.route('/top_candidates', methods=['GET'])
def get_top_candidates():
        
        top_candidates_df = get_candidates_df('top_candidates', db_path)
        if not top_candidates_df.empty:
            top_candidates = [
                Candidate(
                    category=row['category'],
                    resume=row['resume'],
                    phone_number=row['phone_number'],
                    email=row['email'],
                    first_name=row['first_name'],
                    last_name=row['last_name'],
                    score=row['score']
                ).to_dict()
                for _, row in top_candidates_df.iterrows()
                ]

            delete_candidates(db_path)
            return jsonify(top_candidates), 200
        else:
            return jsonify({'error': 'No candidates in database'}), 404

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001, debug=True)
