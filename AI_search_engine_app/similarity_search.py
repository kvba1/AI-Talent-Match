from models import get_bi_encoder
from sklearn.metrics.pairwise import cosine_similarity
from pdf_tools import extract_text_from_pdf
from database import get_candidates_df
from candidate import Candidate
import pandas as pd

def get_top_N_candidates(N: int, file_path: str):
    job_offer_text = extract_text_from_pdf(file_path)
    candidates_df = get_candidates_df('resumes', './data/resumes.db')
    
    job_offer_embedding = encode_texts([job_offer_text])[0]
    candidate_embeddings = encode_texts(candidates_df['Resume'].tolist())
    
    cosine_similarities = compute_cosine_similarities(job_offer_embedding, candidate_embeddings)
    
    top_n_candidates_df = get_top_n_candidates_df(candidates_df, cosine_similarities, N)
    
    top_n_candidates = create_candidate_objects(top_n_candidates_df)
    
    return top_n_candidates

def encode_texts(texts: list):
    bi_encoder = get_bi_encoder()
    embeddings = bi_encoder.encode(texts, convert_to_tensor=True)
    return embeddings.cpu()

def compute_cosine_similarities(job_offer_embedding, candidate_embeddings):
    return cosine_similarity([job_offer_embedding], candidate_embeddings)

def get_top_n_candidates_df(candidates_df: pd.DataFrame, cosine_similarities, N: int):
    top_n_indices = cosine_similarities[0].argsort()[-N:][::-1]
    top_n_candidates_df = candidates_df.iloc[top_n_indices]
    top_n_candidates_df['Score'] = cosine_similarities[0][top_n_indices]
    return top_n_candidates_df

def create_candidate_objects(top_n_candidates_df: pd.DataFrame):
    return [
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
