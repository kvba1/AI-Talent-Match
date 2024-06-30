from models import get_bi_encoder
from sklearn.metrics.pairwise import cosine_similarity
from pdf_tools import extract_text_from_pdf
from database import get_candidates
from candidate import Candidate


def get_top_N_candidates(N: int, file_path :str):
    bi_encoder = get_bi_encoder()
    job_offer_text = extract_text_from_pdf(file_path)
    candidates_df = get_candidates('./data/resumes.db')
    
    # Encode job offer
    job_offer_embedding = bi_encoder.encode(job_offer_text, convert_to_tensor=True)
    # Encode candidate resumes
    candidate_embeddings = bi_encoder.encode(candidates_df['Resume'].tolist(), convert_to_tensor=True)
    
    job_offer_embedding = job_offer_embedding.cpu()
    candidate_embeddings = candidate_embeddings.cpu()
    
    # Compute cosine similarities
    cosine_similarities = cosine_similarity([job_offer_embedding], candidate_embeddings)
    
    # Get top N candidates (e.g., top 50)
    top_n_indices = cosine_similarities[0].argsort()[-N:][::-1]
    top_n_candidates_df = candidates_df.iloc[top_n_indices]
    
    # Add score field
    top_n_candidates_df['Score'] = cosine_similarities[0][top_n_indices]
    
    # Create Candidate objects
    top_n_candidates = [
        Candidate(
            category=row['Category'],
            resume=row['Resume'],
            phone_number=row['Phone Number'],
            email=row['Email'],
            first_name=row['First Name'],
            last_name=row['Last Name'],
            score=row['Score']
        )
        for _, row in top_n_candidates_df.iterrows()
    ]
    
    return top_n_candidates